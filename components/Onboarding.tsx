"use client";

import { useLayoutEffect, useState } from "react";
import Icon from "./Icon";
import PillBtn from "./PillBtn";
import { icons } from "@/lib/icons";

export default function Onboarding({
  onSubmit,
  bg,
  endColor,
}: {
  onSubmit: (name: string, weightUnit: "lbs" | "kg") => void;
  bg: string;
  endColor: string;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");

  useLayoutEffect(() => {
    document.documentElement.style.background = bg;
    document.documentElement.style.backgroundColor = endColor;
    document.body.style.background = bg;
    document.body.style.backgroundColor = endColor;
  }, [bg, endColor]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: bg,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* ambient blobs */}
      <div className="blob" style={{ width: 220, height: 220, background: "var(--accent)", top: -60, right: -50 }} />
      <div className="blob" style={{ width: 200, height: 200, background: "var(--accent-2)", bottom: 40, left: -60 }} />

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px" }}>
        {step === 0 && (
          <div style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.3,0.4,1) both" }}>
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: 24,
                background: "linear-gradient(140deg, #46d69b 0%, #52b6f0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28,
                boxShadow: "0 18px 36px -12px rgba(70,180,140,0.6)",
                animation: "floaty 4s ease-in-out infinite",
              }}
            >
              <Icon d={icons.zap} size={38} fill="#fff" stroke={0} style={{ color: "#fff" }} />
            </div>
            <div
              className="font-display"
              style={{ fontSize: 46, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14 }}
            >
              Welcome to<br />Pulse
            </div>
            <div style={{ fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 38, maxWidth: 290, fontWeight: 500 }}>
              A bright little space to train, track, and stay happily consistent.
            </div>
            <PillBtn onClick={() => setStep(1)}>Get Started</PillBtn>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.3,0.4,1) both" }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Step 1 of 2
            </div>
            <div
              className="font-display"
              style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12 }}
            >
              What&apos;s your name?
            </div>
            <div style={{ fontSize: 15.5, color: "var(--ink-soft)", marginBottom: 30, fontWeight: 500 }}>We&apos;ll use it to greet you.</div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
              placeholder="Your name"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.7)",
                border: "1.6px solid var(--border-color)",
                borderRadius: 20,
                padding: "18px 20px",
                color: "var(--ink)",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: '"Quicksand", sans-serif',
                outline: "none",
                marginBottom: 32,
                boxShadow: "var(--shadow-soft)",
              }}
            />
            <PillBtn disabled={!name.trim()} onClick={() => setStep(2)}>Continue</PillBtn>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.3,0.4,1) both" }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Step 2 of 2
            </div>
            <div
              className="font-display"
              style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12 }}
            >
              Weight unit?
            </div>
            <div style={{ fontSize: 15.5, color: "var(--ink-soft)", marginBottom: 32, fontWeight: 500 }}>Used for tracking exercise weights.</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 40 }}>
              {(["lbs", "kg"] as const).map((unit) => {
                const active = weightUnit === unit;
                return (
                  <button
                    key={unit}
                    onClick={() => setWeightUnit(unit)}
                    style={{
                      flex: 1,
                      padding: "26px 0",
                      borderRadius: 24,
                      background: active ? "var(--accent)" : "rgba(255,255,255,0.7)",
                      border: active ? "none" : "1.6px solid var(--border-color)",
                      color: active ? "#fff" : "var(--ink)",
                      fontSize: 24,
                      fontWeight: 700,
                      fontFamily: '"Quicksand", sans-serif',
                      cursor: "pointer",
                      boxShadow: active ? "0 12px 26px -10px var(--accent)" : "var(--shadow-soft)",
                      transition: "all 0.18s",
                    }}
                  >
                    {unit}
                  </button>
                );
              })}
            </div>
            <PillBtn onClick={() => onSubmit(name.trim(), weightUnit)}>Start Training</PillBtn>
          </div>
        )}
      </div>
    </div>
  );
}
