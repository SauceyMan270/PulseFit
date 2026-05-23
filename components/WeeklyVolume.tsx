"use client";

import type { CompletedSession } from "@/lib/types";

function parseVolume(exerciseList: string[]): { sets: number; reps: number; tonnage: number } {
  let sets = 0, reps = 0, tonnage = 0;
  for (const raw of exerciseList) {
    const m = raw.match(/—\s*(\d+)×(\d+)(?:\s*@\s*([\d.]+))?/);
    if (m) {
      const s = parseInt(m[1], 10);
      const r = parseInt(m[2], 10);
      const w = m[3] ? parseFloat(m[3]) : 0;
      sets += s;
      reps += s * r;
      tonnage += s * r * w;
    }
  }
  return { sets, reps, tonnage };
}

function getMondayOf(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - (day === 0 ? 6 : day - 1));
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function weekKey(d: Date): string {
  return getMondayOf(d).toISOString().split("T")[0];
}

function sumWeek(sessions: CompletedSession[], monday: Date) {
  const key = weekKey(monday);
  const inWeek = sessions.filter(s => weekKey(new Date(s.date)) === key);
  let sets = 0, reps = 0, tonnage = 0;
  for (const s of inWeek) {
    const v = parseVolume(s.exerciseList ?? []);
    sets += v.sets; reps += v.reps; tonnage += v.tonnage;
  }
  return { sets, reps, tonnage, count: inWeek.length };
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function WeeklyVolume({ sessions }: { sessions: CompletedSession[] }) {
  const now = new Date();
  const thisMonday = getMondayOf(now);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);

  const cur = sumWeek(sessions, thisMonday);
  const prev = sumWeek(sessions, lastMonday);

  // 4-week bar data
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const mon = new Date(thisMonday);
    mon.setDate(mon.getDate() - (3 - i) * 7);
    const v = sumWeek(sessions, mon);
    const label = mon.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, reps: v.reps, tonnage: v.tonnage, count: v.count };
  });

  const maxReps = Math.max(1, ...weeks.map(w => w.reps));

  const delta = prev.reps === 0
    ? null
    : Math.round(((cur.reps - prev.reps) / prev.reps) * 100);

  const stats = [
    { label: "Sets",   val: fmt(cur.sets) },
    { label: "Reps",   val: fmt(cur.reps) },
    { label: "Volume", val: cur.tonnage > 0 ? `${fmt(cur.tonnage)} lbs` : "—" },
  ];

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Weekly Volume
        </span>
        {delta !== null && (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: delta >= 0 ? "var(--accent)" : "var(--accent-2)",
              background: delta >= 0 ? "var(--accent-soft)" : "var(--accent-2-soft)",
              padding: "4px 10px",
              borderRadius: 999,
            }}
          >
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}% vs last week
          </span>
        )}
      </div>

      {/* Stat trio */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {stats.map(({ label, val }) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: "var(--surface)",
              borderRadius: 14,
              padding: "12px 8px",
              textAlign: "center",
            }}
          >
            <div
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}
            >
              {val}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 700, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 4-week bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
        {weeks.map((w, i) => {
          const isThis = i === 3;
          const barH = maxReps > 0 ? Math.max(6, Math.round((w.reps / maxReps) * 64)) : 6;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", height: 64, display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: barH,
                    borderRadius: 8,
                    background: isThis ? "var(--accent)" : "var(--accent-soft)",
                    transition: "height 0.6s cubic-bezier(0.34,1.1,0.4,1)",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: isThis ? "var(--accent)" : "var(--ink-faint)", whiteSpace: "nowrap" }}>
                {w.label}
              </span>
            </div>
          );
        })}
      </div>

      {cur.count === 0 && (
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "var(--ink-faint)", fontWeight: 600 }}>
          Complete a workout to track volume.
        </div>
      )}
    </div>
  );
}
