"use client";

import { useRef, useState } from "react";
import Card from "../Card";
import Icon from "../Icon";
import WeeklyVolume from "../WeeklyVolume";
import PersonalRecords from "../PersonalRecords";
import { icons } from "@/lib/icons";
import { useAppearEffect } from "@/lib/useAppearEffect";
import type { Dispatch, State } from "@/lib/types";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun…6=Sat → remap to Mon=0…Sun=6
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function ScheduleTab({ state }: { state: State; dispatch: Dispatch }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const containerRef = useRef<HTMLDivElement>(null);
  useAppearEffect(containerRef);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);

  // Build workout count map: day → count
  const countMap: Record<number, number> = {};
  for (const s of state.completedSessions ?? []) {
    const d = new Date(s.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      countMap[day] = (countMap[day] || 0) + 1;
    }
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelected(null);
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Intensity: 0=none, 1=light, 2=mid, 3=full
  const intensity = (count: number) => {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    return 3;
  };

  const cellBg = (lvl: number) => {
    if (lvl === 0) return "var(--surface)";
    if (lvl === 1) return "var(--accent-soft)";
    if (lvl === 2) return "color-mix(in srgb, var(--accent) 45%, var(--accent-soft))";
    return "var(--accent)";
  };

  const cellColor = (lvl: number) => lvl === 3 ? "#fff" : lvl > 0 ? "var(--accent-text)" : "var(--ink)";

  // Selected day sessions
  const selectedSessions = selected
    ? (state.completedSessions ?? []).filter(s => {
        const d = new Date(s.date);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === selected;
      })
    : [];

  // Stats for viewed month
  const monthWorkouts = Object.values(countMap).reduce((a, b) => a + b, 0);
  const monthMinutes = (state.completedSessions ?? [])
    .filter(s => { const d = new Date(s.date); return d.getFullYear() === viewYear && d.getMonth() === viewMonth; })
    .reduce((a, s) => a + s.durationMin, 0);
  const activeDays = Object.keys(countMap).length;

  // Grid cells: blanks + days
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={containerRef} style={{ padding: "20px 20px 16px" }}>
      {/* Header */}
      <div data-appear style={{ marginBottom: 20 }}>
        <div className="font-display" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
          Schedule
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 7, fontWeight: 600 }}>Your monthly workout heatmap</div>
      </div>

      {/* Personal Records */}
      <Card data-appear style={{ marginBottom: 14 }}>
        <PersonalRecords sessions={state.completedSessions ?? []} />
      </Card>

      {/* Month stats strip */}
      <div data-appear style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[
          { val: monthWorkouts, label: "Workouts" },
          { val: activeDays,    label: "Active days" },
          { val: monthMinutes,  label: "Minutes" },
        ].map(({ val, label }) => (
          <Card key={label} style={{ flex: 1, padding: "12px 10px", textAlign: "center" }}>
            <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{val}</div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 700, marginTop: 4 }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Calendar card */}
      <Card data-appear style={{ marginBottom: 14 }}>
        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button onClick={prevMonth} style={{ background: "var(--surface)", border: "none", cursor: "pointer", width: 34, height: 34, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>{monthLabel}</span>
          <button onClick={nextMonth} style={{ background: "var(--surface)", border: "none", cursor: "pointer", width: 34, height: 34, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Day labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "var(--ink-faint)", letterSpacing: "0.04em", paddingBottom: 4 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((day, idx) => {
            if (!day) return <div key={`blank-${idx}`} />;
            const isToday = isCurrentMonth && day === today.getDate();
            const isSel = selected === day;
            const lvl = intensity(countMap[day] || 0);
            return (
              <button
                key={day}
                onClick={() => setSelected(isSel ? null : day)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 11,
                  border: isSel
                    ? "2.5px solid var(--accent)"
                    : isToday
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  background: isToday ? "var(--accent)" : cellBg(lvl),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "border 0.12s",
                  padding: 0,
                }}
              >
                <span
                  className="font-display"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isToday ? "#fff" : isSel ? "var(--accent)" : cellColor(lvl),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 700 }}>Less</span>
          {[0, 1, 2, 3].map(lvl => (
            <div key={lvl} style={{ width: 14, height: 14, borderRadius: 5, background: cellBg(lvl), border: "1px solid var(--border-inner)" }} />
          ))}
          <span style={{ fontSize: 10.5, color: "var(--ink-faint)", fontWeight: 700 }}>More</span>
        </div>
      </Card>

      {/* Selected day detail */}
      {selected && (
        <Card data-appear style={{ marginBottom: 14 }}>
          <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: selectedSessions.length ? 12 : 0 }}>
            {new Date(viewYear, viewMonth, selected).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          {selectedSessions.length === 0 ? (
            <div style={{ fontSize: 13.5, color: "var(--ink-faint)", fontWeight: 600, marginTop: 6 }}>No workouts logged.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {selectedSessions.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", background: "var(--surface)", borderRadius: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon d={icons.dumbbell} size={17} stroke={2} style={{ color: "var(--accent)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600, marginTop: 2 }}>{s.durationMin} min</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Weekly Volume Tracker */}
      <Card data-appear style={{ marginBottom: 14 }}>
        <WeeklyVolume sessions={state.completedSessions ?? []} />
      </Card>
    </div>
  );
}
