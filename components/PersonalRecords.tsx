"use client";

import { useMemo } from "react";
import Icon from "./Icon";
import { icons } from "@/lib/icons";
import type { CompletedSession } from "@/lib/types";

type PR = {
  name: string;
  maxWeight: number;
  maxReps: number;
  bestSets: number;
  date: string;
  isNew: boolean;
};

function parsePRs(sessions: CompletedSession[]): PR[] {
  // map: name → { maxWeight, maxReps, bestSets, date }
  const map: Record<string, { maxWeight: number; maxReps: number; bestSets: number; date: string }> = {};

  // Sort oldest → newest so "isNew" can be detected from the latest session
  const sorted = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const session of sorted) {
    for (const raw of session.exerciseList ?? []) {
      const m = raw.match(/^(.+?)\s*—\s*(\d+)×(\d+)(?:\s*@\s*([\d.]+))?/);
      if (!m) continue;
      const name = m[1].trim();
      const sets = parseInt(m[2], 10);
      const reps = parseInt(m[3], 10);
      const weight = m[4] ? parseFloat(m[4]) : 0;
      const existing = map[name];
      if (!existing || weight > existing.maxWeight || (weight === existing.maxWeight && reps > existing.maxReps)) {
        map[name] = { maxWeight: weight, maxReps: reps, bestSets: sets, date: session.date };
      }
    }
  }

  // Mark PRs set in the most recent session as new
  const latestDate = sessions.length ? new Date(Math.max(...sessions.map(s => new Date(s.date).getTime()))).toDateString() : "";

  return Object.entries(map)
    .map(([name, v]) => ({
      name,
      maxWeight: v.maxWeight,
      maxReps: v.maxReps,
      bestSets: v.bestSets,
      date: v.date,
      isNew: new Date(v.date).toDateString() === latestDate,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function PersonalRecords({ sessions }: { sessions: CompletedSession[] }) {
  const prs = useMemo(() => parsePRs(sessions), [sessions]);

  if (prs.length === 0) {
    return (
      <div>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 12 }}>
          Personal Records
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 0 6px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={icons.trophy} size={20} stroke={2} style={{ color: "var(--accent)" }} />
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-faint)", fontWeight: 600 }}>Complete workouts to earn PRs.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Personal Records
        </span>
        <span style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 700 }}>{prs.length} lifts</span>
      </div>

      <div className="hide-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginRight: -4 }}>
        {prs.map((pr) => (
          <div
            key={pr.name}
            style={{
              flexShrink: 0,
              width: 148,
              background: "var(--surface)",
              borderRadius: 18,
              padding: "14px 14px 12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent bar top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "18px 18px 0 0", background: "var(--accent)" }} />

            {/* Trophy + New badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icons.trophy} size={14} stroke={2} style={{ color: "var(--accent)" }} />
              </div>
              {pr.isNew && (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "#fff", background: "var(--accent)", padding: "3px 7px", borderRadius: 999, letterSpacing: "0.04em" }}>
                  NEW
                </span>
              )}
            </div>

            {/* Exercise name */}
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {pr.name}
            </div>

            {/* Best performance */}
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {pr.maxWeight > 0 ? `${pr.maxWeight} lbs` : `${pr.maxReps} reps`}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 600, marginTop: 3 }}>
              {pr.bestSets}×{pr.maxReps}{pr.maxWeight > 0 ? ` @ ${pr.maxWeight}lbs` : ""}
            </div>

            {/* Date */}
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 600, marginTop: 8 }}>
              {new Date(pr.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
