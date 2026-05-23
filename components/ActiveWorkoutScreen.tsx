"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ProgressRing from "./ProgressRing";
import { icons } from "@/lib/icons";
import type { Workout } from "@/lib/types";

function parseExercise(raw: string): { name: string; sets: string; reps: string; weight: string } {
  const match = raw.match(/^(.+?)\s*—\s*(\d+)×(\d+)(?:\s*@\s*([\d.]+\w+))?$/);
  if (match) return { name: match[1], sets: match[2], reps: match[3], weight: match[4] || "" };
  return { name: raw, sets: "—", reps: "—", weight: "" };
}

export default function ActiveWorkoutScreen({
  workout,
  onStop,
  onComplete,
}: {
  workout: Workout;
  onStop: () => void;
  onComplete: (seconds: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  const targetSec = (workout.duration || 30) * 60;
  const pct = Math.min((elapsed / targetSec) * 100, 100);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const exercises = (workout.exerciseList || []).map(parseExercise);

  return (
    <div
      ref={scrollRef}
      className="hide-scroll"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        animation: "fade-in 0.3s ease",
      }}
    >
      <div className="blob" style={{ width: 240, height: 240, background: "var(--accent)", top: -70, right: -60 }} />
      <div className="blob" style={{ width: 200, height: 200, background: "var(--accent-2)", top: 220, left: -70 }} />

      <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ padding: "calc(16px + env(safe-area-inset-top)) 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={onStop}
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid var(--border-color)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <Icon d={icons.x} size={17} stroke={2.6} style={{ color: "var(--ink)" }} />
          </button>
          <span
            style={{
              fontSize: 12,
              color: paused ? "var(--ink-soft)" : "var(--accent)",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: paused ? "var(--surface)" : "var(--accent-soft)",
              padding: "7px 14px",
              borderRadius: 999,
            }}
          >
            {paused ? "Paused" : "● Active"}
          </span>
          <div style={{ width: 40 }} />
        </div>

        {/* Timer */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 22px" }}>
          <div className="font-display" style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 14, fontWeight: 700 }}>
            {workout.title}
          </div>

          <ProgressRing value={pct} size="lg">
            <div style={{ textAlign: "center" }}>
              <div
                className="font-display"
                style={{
                  fontSize: 54,
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {mm}:{ss}
              </div>
              <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 8, fontWeight: 600 }}>
                of {workout.duration}:00
              </div>
            </div>
          </ProgressRing>

          {exercises.length > 0 && (
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 700 }}>Scroll for exercises</div>
              <svg width={14} height={8} viewBox="0 0 14 8" fill="none">
                <path d="M1 1l6 6 6-6" stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: "0 22px 36px", display: "flex", gap: 12, flexShrink: 0 }}>
          <button
            onClick={() => setPaused((p) => !p)}
            style={{
              flex: 1,
              height: 58,
              borderRadius: 999,
              background: "rgba(255,255,255,0.8)",
              border: "1.6px solid var(--border-color)",
              color: "var(--ink)",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: '"Quicksand", sans-serif',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <Icon d={paused ? icons.play : icons.pause} size={16} fill={paused ? "currentColor" : "none"} stroke={2} />
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => { setPaused(true); setDone(true); }}
            style={{
              flex: 1.3,
              height: 58,
              borderRadius: 999,
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: '"Quicksand", sans-serif',
              cursor: "pointer",
              boxShadow: "0 12px 26px -10px var(--accent)",
            }}
          >
            Complete
          </button>
        </div>
      </div>

      {/* Exercise list */}
      {exercises.length > 0 && (
        <div style={{ position: "relative", padding: "8px 22px 48px" }}>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>
            Exercises
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {exercises.map((ex, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px 16px",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 20,
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "var(--accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12.5,
                      color: "var(--accent-text)",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{ex.name}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {[
                    { val: ex.sets, suffix: "S" },
                    { val: ex.reps, suffix: "R" },
                    ...(ex.weight ? [{ val: ex.weight, suffix: "" }] : []),
                  ].map(({ val, suffix }, idx) => (
                    <div
                      key={idx}
                      style={{
                        minWidth: 42,
                        padding: "5px 9px",
                        borderRadius: 10,
                        background: "var(--surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{val}</span>
                      {suffix && <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--ink-faint)" }}>{suffix}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Congratulations overlay */}
      {done && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(165deg, var(--accent-soft) 0%, var(--accent-2-soft) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "0 32px",
            animation: "congrats-in 0.5s cubic-bezier(0.34,1.1,0.4,1) both",
          }}
        >
          {/* Animated checkmark */}
          <svg width={130} height={130} viewBox="0 0 130 130" fill="none" style={{ marginBottom: 32 }}>
            <circle
              cx={65} cy={65} r={54}
              stroke="var(--accent)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={320}
              style={{ animation: "check-circle 1.1s cubic-bezier(0.4,0,0.2,1) 0.1s both" }}
            />
            <polyline
              points="38,67 56,85 92,46"
              stroke="var(--accent)"
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={80}
              style={{ animation: "check-draw 0.7s cubic-bezier(0.4,0,0.2,1) 0.9s both" }}
            />
          </svg>

          <div
            className="font-display"
            style={{ fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.15, animation: "fade-up 0.6s ease 0.5s both" }}
          >
            Workout Complete!
          </div>
          <div style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 10, fontWeight: 600, textAlign: "center", animation: "fade-up 0.6s ease 0.65s both" }}>
            {`${mm}:${ss} · ${workout.title}`}
          </div>

          <div style={{ marginTop: 48, width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 12, animation: "fade-up 0.6s ease 0.8s both" }}>
            <button
              onClick={() => onComplete(elapsed)}
              style={{
                width: "100%", height: 58, borderRadius: 999,
                background: "var(--accent)", border: "none", color: "#fff",
                fontSize: 16.5, fontWeight: 700, fontFamily: '"Quicksand", sans-serif',
                cursor: "pointer", letterSpacing: "0.01em",
              }}
            >
              Save &amp; Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
