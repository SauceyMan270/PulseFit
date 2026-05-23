"use client";

import { useRef } from "react";
import Icon from "../Icon";
import Card from "../Card";
import PillBtn from "../PillBtn";
import ProgressRing from "../ProgressRing";
import DayTracker from "../DayTracker";
import { icons } from "@/lib/icons";
import { useAppearEffect } from "@/lib/useAppearEffect";
import type { Dispatch, IconKey, State, Workout } from "@/lib/types";

export default function WorkoutsTab({
  state,
  dispatch,
  openWorkout,
}: {
  state: State;
  dispatch: Dispatch;
  openWorkout: (w: Workout) => void;
  startWorkout: (w: Workout) => void;
}) {
  const { workoutPlans, weekCompleted } = state;
  const completedCount = weekCompleted.filter((x) => x).length;
  const pct = Math.round((completedCount / 7) * 100);
  const containerRef = useRef<HTMLDivElement>(null);
  useAppearEffect(containerRef);

  return (
    <div ref={containerRef} style={{ padding: "20px 20px 16px" }}>
      <div data-appear style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Workouts
          </div>
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 7, fontWeight: 500 }}>
            Train with purpose, every day.
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: "openSheet", sheet: "workoutType" })}
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            background: "var(--accent)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            boxShadow: "0 10px 20px -8px var(--accent)",
          }}
        >
          <Icon d={icons.plus} size={20} stroke={2.8} style={{ color: "#fff" }} />
        </button>
      </div>

      {/* Weekly progress card */}
      <Card data-appear style={{ marginBottom: 20, background: "linear-gradient(140deg, var(--accent) 0%, var(--accent-2) 100%)", border: "none", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>This Week</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
              <span
                className="font-display"
                style={{ fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
              >
                {completedCount}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>/ 7</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 6, fontWeight: 600 }}>Workouts completed</div>
          </div>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{pct}%</span>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <DayTracker
            days={["M", "T", "W", "T", "F", "S", "S"].map((l, i) => ({
              label: l,
              status: weekCompleted[i] ? "checked" : "empty",
            }))}
            size="sm"
            labelColor="rgba(255,255,255,0.9)"
            onToggle={(i) => dispatch({ type: "toggleWeekDay", index: i })}
          />
        </div>
      </Card>

      <div data-appear style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>Your Workouts</span>
        <span style={{ color: "var(--ink-soft)", fontSize: 13, fontWeight: 700 }}>
          {workoutPlans.length} {workoutPlans.length === 1 ? "plan" : "plans"}
        </span>
      </div>

      {workoutPlans.length === 0 ? (
        <Card data-appear style={{ textAlign: "center", padding: "32px 18px", marginBottom: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Icon d={icons.dumbbell} size={24} stroke={2} style={{ color: "var(--accent)" }} />
          </div>
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 500 }}>
            No workouts yet — create your first one!
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 16 }}>
          {workoutPlans.map((p, idx) => {
            const k = (p.iconKey || "dumbbell") as IconKey;
            const d = icons[k];
            const tones = ["accent", "accent-2", "accent-3"] as const;
            const tone = tones[idx % 3];
            return (
              <Card
                key={p.id}
                data-appear
                onClick={() => openWorkout(p)}
                style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 15px" }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 17,
                    background: `var(--${tone}-soft)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={`var(--${tone})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {Array.isArray(d) ? d.map((path, j) => <path key={j} d={path} />) : <path d={d} />}
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3, fontWeight: 600 }}>
                    {p.exercises} {p.exercises === 1 ? "exercise" : "exercises"} · {p.duration} min · {p.level}
                  </div>
                </div>
                <Icon d={icons.chevronRight} size={19} stroke={2.4} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
              </Card>
            );
          })}
        </div>
      )}

      <div data-appear>
        <PillBtn
          onClick={() => dispatch({ type: "openSheet", sheet: "workoutType" })}
          leadIcon={
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon d={icons.plus} size={18} stroke={2.8} style={{ color: "#fff" }} />
            </div>
          }
        >
          New Workout
        </PillBtn>
      </div>
    </div>
  );
}
