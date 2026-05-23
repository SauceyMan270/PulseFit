"use client";

import Icon from "./Icon";
import { icons } from "@/lib/icons";

export type Day = { label: string; status: "checked" | "empty" | "dash" };

export default function DayTracker({
  days,
  labelsAbove = true,
  size = "md",
  tone = "accent",
  labelColor = "var(--ink-soft)",
  onToggle,
}: {
  days: Day[];
  labelsAbove?: boolean;
  size?: "sm" | "md";
  tone?: "accent" | "accent-2" | "accent-3";
  labelColor?: string;
  onToggle?: (i: number) => void;
}) {
  const dim = size === "sm" ? 30 : 34;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 4 }}>
      {days.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
          {labelsAbove && (
            <span style={{ fontSize: 11, color: labelColor, fontWeight: 700 }}>{d.label}</span>
          )}
          <button
            onClick={() => onToggle && onToggle(i)}
            disabled={!onToggle}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: onToggle ? "pointer" : "default",
            }}
          >
            {d.status === "checked" && (
              <div
                style={{
                  width: dim,
                  height: dim,
                  borderRadius: "50%",
                  background: `var(--${tone})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 6px 14px -6px var(--${tone})`,
                }}
              >
                <Icon d={icons.check} size={dim * 0.5} stroke={3.2} style={{ color: "#fff" }} />
              </div>
            )}
            {d.status === "empty" && (
              <div
                style={{
                  width: dim,
                  height: dim,
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "1.6px solid var(--border-inner)",
                }}
              />
            )}
            {d.status === "dash" && (
              <div
                style={{
                  width: dim,
                  height: dim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 12, height: 2, background: "var(--ink-faint)", borderRadius: 2 }} />
              </div>
            )}
          </button>
          {!labelsAbove && (
            <span style={{ fontSize: 11, color: labelColor, fontWeight: 700 }}>{d.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
