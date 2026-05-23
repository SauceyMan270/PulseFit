"use client";

import { icons } from "@/lib/icons";
import type { TabKey } from "@/lib/types";

const navTabs: { key: TabKey; label: string; d: string | string[] }[] = [
  { key: "home", label: "Home", d: icons.home },
  { key: "workouts", label: "Workouts", d: icons.dumbbell },
  { key: "progress", label: "Progress", d: icons.chart },
  { key: "schedule", label: "Schedule", d: icons.calendar },
  { key: "profile", label: "Profile", d: icons.user },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        padding: "0 16px",
        paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
        pointerEvents: "none",
        // Fill the home-indicator safe area with the theme gradient so no harsh line
        background: "linear-gradient(to top, var(--nav-bg) 0%, transparent 100%)",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border-color)",
          borderRadius: 30,
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-around",
          padding: "9px 6px",
        }}
      >
        {navTabs.map(({ key, label, d }) => {
          const a = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 6px 6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                minWidth: 56,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 30,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: a ? "var(--accent-soft)" : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <svg
                  width={21}
                  height={21}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={a ? "var(--accent)" : "var(--ink-faint)"}
                  strokeWidth={a ? 2.4 : 1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
                </svg>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  color: a ? "var(--accent)" : "var(--ink-faint)",
                  fontWeight: 700,
                  fontFamily: '"Quicksand", sans-serif',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
