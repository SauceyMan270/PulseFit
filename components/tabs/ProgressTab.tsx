"use client";

import { useRef } from "react";
import Icon from "../Icon";
import Card from "../Card";
import PillBtn from "../PillBtn";
import ProgressRing from "../ProgressRing";
import DayTracker from "../DayTracker";
import { icons } from "@/lib/icons";
import { useAppearEffect } from "@/lib/useAppearEffect";
import type { Dispatch, State } from "@/lib/types";

export default function ProgressTab({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const { weekCompleted, workoutsThisMonth, streak, weekHistory } = state;
  const completedCount = weekCompleted.filter((x) => x).length;
  const goal = 7;
  const pct = Math.round((completedCount / goal) * 100);

  const chartData = state.monthlyBars;
  const maxY = Math.max(6, ...chartData);

  const stats: { d: string | string[]; label: string; val: string | number; sub: string; tone: "accent" | "accent-2" }[] = [
    { d: icons.dumbbell, label: "Workouts", val: workoutsThisMonth, sub: "this month", tone: "accent" },
    { d: icons.flame, label: "Streak", val: streak, sub: streak === 1 ? "day" : "days", tone: "accent-2" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  useAppearEffect(containerRef);

  return (
    <div ref={containerRef} style={{ padding: "20px 20px 16px" }}>
      <div data-appear style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div className="font-display" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Progress
          </div>
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 7, fontWeight: 500 }}>Stay consistent. See results.</div>
        </div>
        <button
          onClick={() => dispatch({ type: "setTab", tab: "schedule" })}
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            background: "var(--accent-soft)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          <Icon d={icons.calendar} size={19} stroke={2} style={{ color: "var(--accent)" }} />
        </button>
      </div>

      {/* Big ring */}
      <Card data-appear style={{ marginBottom: 14, alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 18px" }}>
          <ProgressRing value={pct} size="lg">
            <div style={{ textAlign: "center" }}>
              <div
                className="font-display"
                style={{ fontSize: 52, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
              >
                {pct}
                <span style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-faint)" }}>%</span>
              </div>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6, fontWeight: 700 }}>Weekly goal</div>
              <div style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 600 }}>
                {completedCount} of {goal} workouts
              </div>
            </div>
          </ProgressRing>
        </div>
        <div style={{ width: "100%", height: 1, background: "var(--border-inner)", marginBottom: 16 }} />
        <div style={{ width: "100%" }}>
          <DayTracker
            days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((l, i) => ({
              label: l,
              status: weekCompleted[i] ? "checked" : "empty",
            }))}
            onToggle={(i) => dispatch({ type: "toggleWeekDay", index: i })}
          />
        </div>
      </Card>

      {/* Stat duo */}
      <div data-appear style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `var(--${s.tone}-soft)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={`var(--${s.tone})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {Array.isArray(s.d) ? s.d.map((p, j) => <path key={j} d={p} />) : <path d={s.d} />}
              </svg>
            </div>
            <span
              className="font-display"
              style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
            >
              {s.val}
            </span>
            <span style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 5, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 11.5, color: "var(--ink-faint)", fontWeight: 600 }}>{s.sub}</span>
          </Card>
        ))}
      </div>

      {/* Past weeks */}
      {weekHistory && weekHistory.length > 0 && (
        <Card data-appear style={{ marginBottom: 14 }}>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Past Weeks
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {weekHistory.map((w, i) => {
              const weekPct = Math.round((w.completed / w.goal) * 100);
              const label = new Date(w.weekStart + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>Week of {label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                      {w.completed}/{w.goal}
                    </span>
                  </div>
                  <div style={{ height: 8, background: "var(--ring-track)", borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${weekPct}%`,
                        background: w.completed >= w.goal ? "var(--accent)" : "var(--accent-2)",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Chart */}
      {(() => {
        const days = ["M","T","W","T","F","S","S"];
        const vals = weekCompleted.map(v => v ? 1 : 0);
        const W = 300, H = 130;
        const PAD_L = 20, PAD_R = 20, PAD_T = 24, PAD_B = 28;
        const chartW = W - PAD_L - PAD_R;
        const chartH = H - PAD_T - PAD_B;
        const baseline = PAD_T + chartH;
        const max = Math.max(...vals, 1);
        const tension = 0.45;

        function xAt(i: number) { return PAD_L + (i / 6) * chartW; }
        function yAt(v: number) { return PAD_T + chartH - (v / max) * chartH * 0.82; }

        const pts = vals.map((v, i) => [xAt(i), yAt(v)] as [number, number]);

        // Cardinal spline → bezier (exact port of reference implementation)
        function cardinalCurves(points: [number,number][]) {
          const result: [number,number,number,number,number,number][] = [];
          for (let i = 0; i < points.length; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[Math.min(i + 1, points.length - 1)];
            const p3 = points[Math.min(i + 2, points.length - 1)];
            const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 3;
            const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 3;
            const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 3;
            const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 3;
            result.push([cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]]);
          }
          return result;
        }

        const curves = cardinalCurves(pts);

        // Build area fill path
        let areaD = `M ${pts[0][0]} ${baseline} L ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 0; i < curves.length - 1; i++) {
          const c = curves[i];
          areaD += ` C ${c[0].toFixed(1)} ${c[1].toFixed(1)}, ${c[2].toFixed(1)} ${c[3].toFixed(1)}, ${c[4].toFixed(1)} ${c[5].toFixed(1)}`;
        }
        areaD += ` L ${pts[pts.length-1][0]} ${baseline} Z`;

        // Build line path
        let lineD = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 0; i < curves.length - 1; i++) {
          const c = curves[i];
          lineD += ` C ${c[0].toFixed(1)} ${c[1].toFixed(1)}, ${c[2].toFixed(1)} ${c[3].toFixed(1)}, ${c[4].toFixed(1)} ${c[5].toFixed(1)}`;
        }

        const peakVal = Math.max(...vals);
        const peakIdx = vals.indexOf(peakVal as 0 | 1);
        let todayIdx = vals.length - 1;
        for (let i = vals.length - 1; i >= 0; i--) { if (vals[i] > 0) { todayIdx = i; break; } }

        return (
          <Card data-appear style={{ marginBottom: 14, paddingBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>This Week</span>
              <span style={{ color: "var(--ink-soft)", fontSize: 12.5, fontWeight: 600 }}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block", overflow: "visible" }}>
              <defs>
                <linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.18 }} />
                  <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#wkGrad)" />
              <path d={lineD} stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Peak dot — hollow */}
              {vals[peakIdx] > 0 && (
                <circle cx={xAt(peakIdx)} cy={yAt(vals[peakIdx])} r={6} fill="var(--card-solid)" stroke="var(--accent)" strokeWidth="2.5" />
              )}
              {/* Today dot — filled, only if different from peak */}
              {todayIdx !== peakIdx && vals[todayIdx] > 0 && (
                <circle cx={xAt(todayIdx)} cy={yAt(vals[todayIdx])} r={5.5} fill="var(--accent)" />
              )}
              {/* X-axis labels */}
              {days.map((d, i) => (
                <text key={i} x={xAt(i)} y={H - 4} fontSize="11" fill="var(--ink-faint)" textAnchor="middle" fontWeight="700" fontFamily="Nunito, sans-serif">{d}</text>
              ))}
            </svg>
          </Card>
        );
      })()}

      <div data-appear style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => dispatch({ type: "openSheet", sheet: "history" })}
          style={{
            width: "100%", height: 58, borderRadius: 999, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            fontSize: 16.5, fontWeight: 700, fontFamily: '"Quicksand", sans-serif',
            color: "#fff", letterSpacing: "0.01em",
            boxShadow: "0 10px 24px -10px var(--accent)",
          }}
        >
          <Icon d={icons.trending} size={19} stroke={2.2} style={{ color: "#fff" }} />
          See Progress
        </button>
        <PillBtn
          tone="accent-2"
          onClick={() => dispatch({ type: "openSheet", sheet: "insights" })}
          trailIcon={<Icon d={icons.chevronRight} size={20} stroke={2.4} style={{ color: "#fff" }} />}
        >
          View Insights
        </PillBtn>
      </div>
    </div>
  );
}
