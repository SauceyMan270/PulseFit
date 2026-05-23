"use client";

import { useRef } from "react";
import Icon from "../Icon";
import Card from "../Card";
import PillBtn from "../PillBtn";
import ProgressRing from "../ProgressRing";
import { icons } from "@/lib/icons";
import { greetingForHour } from "@/lib/reducer";
import { useAppearEffect } from "@/lib/useAppearEffect";
import type { Dispatch, IconKey, State, Workout } from "@/lib/types";

export default function HomeTab({
  state,
  dispatch,
  openWorkout,
  startWorkout,
}: {
  state: State;
  dispatch: Dispatch;
  openWorkout: (w: Workout) => void;
  startWorkout: (w: Workout) => void;
}) {
  const { streak, workoutsThisMonth, todayPlan, weekCompleted } = state;
  const completedCount = weekCompleted.filter(Boolean).length;
  const weekPct = Math.round((completedCount / 7) * 100);
  const containerRef = useRef<HTMLDivElement>(null);
  useAppearEffect(containerRef);

  return (
    <div ref={containerRef} style={{ padding: "20px 20px 16px" }}>
      {/* Greeting hero */}
      <div data-appear style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--accent-soft)",
              color: "var(--accent-text)",
              fontSize: 12.5,
              fontWeight: 800,
              padding: "6px 12px",
              borderRadius: 999,
              marginBottom: 10,
            }}
          >
            <Icon d={icons.sun} size={13} stroke={2.2} />
            {greetingForHour()}
          </div>
          <div
            className="font-display"
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              wordBreak: "break-word",
            }}
          >
            {state.firstName}
          </div>
          <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 10, maxWidth: 190, fontWeight: 500, lineHeight: 1.45 }}>
            {workoutsThisMonth === 0 ? "Ready for your first workout?" : "Let's keep that momentum going."}
          </div>
        </div>
        <ProgressRing value={weekPct} size="md" trackColor="rgba(255,255,255,0.25)" progressColor="var(--accent)">
          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
            >
              {completedCount}
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>/7</span>
            </div>
            <div style={{ fontSize: 10.5, color: "var(--accent)", marginTop: 3, fontWeight: 700 }}>this week</div>
          </div>
        </ProgressRing>
      </div>

      {/* Today's plan */}
      <div data-appear style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
          <span className="font-display" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            Today&apos;s Plan
          </span>
          <button
            onClick={() => dispatch({ type: "setTab", tab: "workouts" })}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}
          >
            View all <Icon d={icons.chevronRight} size={14} stroke={2.4} />
          </button>
        </div>
        {todayPlan ? (
          <Card onClick={() => openWorkout(todayPlan)} style={{ display: "flex", padding: 0, overflow: "hidden", alignItems: "center", border: "none"}}>
            <div
              style={{
                width: 96,
                height: 96,
                flexShrink: 0,
                background: "linear-gradient(140deg, var(--accent) 0%, var(--accent-2) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                {(() => {
                  const k = (todayPlan.iconKey || "dumbbell") as IconKey;
                  const d = icons[k];
                  return Array.isArray(d) ? d.map((p, j) => <path key={j} d={p} />) : <path d={d} />;
                })()}
              </svg>
            </div>
            <div style={{ padding: "14px 16px", flex: 1, minWidth: 0 }}>
              <div className="font-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>{todayPlan.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 3, fontWeight: 600 }}>
                {todayPlan.duration} min · {todayPlan.equipment || todayPlan.level}
              </div>
            </div>
            <Icon d={icons.chevronRight} size={19} stroke={2.4} style={{ color: "var(--ink-faint)", marginRight: 14, flexShrink: 0 }} />
          </Card>
        ) : (
          <Card style={{ textAlign: "center", padding: "28px 18px" }}>
            <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 500 }}>
              No workout planned for today yet.
            </div>
          </Card>
        )}
      </div>

      {/* Stat duo */}
      <div data-appear style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Card style={{ flex: 1, padding: "16px 16px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Icon d={icons.flame} size={20} fill="var(--accent)" stroke={0} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {streak}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4, fontWeight: 600 }}>
            day streak
          </div>
        </Card>
        <Card style={{ flex: 1, padding: "16px 16px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: "var(--accent-2-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Icon d={icons.dumbbell} size={20} stroke={2} style={{ color: "var(--accent-2)" }} />
          </div>
          <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {workoutsThisMonth}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4, fontWeight: 600 }}>
            this month
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div data-appear>
        <PillBtn
          onClick={() =>
            todayPlan ? startWorkout(todayPlan) : dispatch({ type: "openSheet", sheet: "workoutType" })
          }
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
              <Icon d={todayPlan ? icons.play : icons.plus} size={18} fill={todayPlan ? "#fff" : "none"} stroke={todayPlan ? 0 : 2.6} style={{ color: "#fff" }} />
            </div>
          }
        >
          {todayPlan ? "Start Workout" : "New Workout"}
        </PillBtn>
      </div>
    </div>
  );
}
