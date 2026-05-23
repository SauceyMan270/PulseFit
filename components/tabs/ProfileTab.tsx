"use client";

import { useRef } from "react";
import Icon from "../Icon";
import Card from "../Card";
import ProgressRing from "../ProgressRing";
import DayTracker from "../DayTracker";
import SettingsRow from "../SettingsRow";
import { icons } from "@/lib/icons";
import { THEMES } from "@/lib/types";
import { useAppearEffect } from "@/lib/useAppearEffect";
import type { Dispatch, State } from "@/lib/types";

export default function ProfileTab({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const { firstName, lastName, tier, level, xp, weekCompleted, theme, goalLabel, streak } = state;
  const completedCount = weekCompleted.filter((x) => x).length;
  const pct = Math.round((completedCount / 7) * 100);
  const containerRef = useRef<HTMLDivElement>(null);
  useAppearEffect(containerRef);

  return (
    <div ref={containerRef} style={{ padding: "20px 20px 16px" }}>
      <div data-appear style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em" }}>Profile</div>
        <button
          onClick={() => dispatch({ type: "openSheet", sheet: "settings" })}
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
          }}
        >
          <Icon d={icons.settings} size={20} stroke={2} style={{ color: "var(--accent)" }} />
        </button>
      </div>

      {/* Profile header card */}
      <Card data-appear style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 26,
            background: "linear-gradient(140deg, var(--accent) 0%, var(--accent-2) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 12px 24px -10px var(--accent)",
          }}
        >
          <span className="font-display" style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>
            {firstName.charAt(0).toUpperCase()}
            {lastName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", wordBreak: "break-word" }}>
            {firstName}
            {lastName ? ` ${lastName}` : ""}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "var(--accent-3-soft)",
              color: "var(--accent-3)",
              fontSize: 12,
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: 999,
              marginTop: 6,
            }}
          >
            <Icon d={icons.crown} size={12} stroke={2.2} />
            {tier}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            Level {level} · {xp.toLocaleString()} XP
          </div>
        </div>
      </Card>

      {/* Edit profile button */}
      <button
        data-appear
        onClick={() => dispatch({ type: "openSheet", sheet: "editProfile" })}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "13px 0",
          borderRadius: 999,
          border: "1.6px solid var(--border-inner)",
          background: "var(--card-bg)",
          cursor: "pointer",
          color: "var(--ink)",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: '"Quicksand", sans-serif',
          marginBottom: 14,
        }}
      >
        <Icon d={icons.pencil} size={15} stroke={2.2} style={{ color: "var(--accent)" }} />
        Edit Profile
      </button>

      {/* This week card */}
      <Card data-appear style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>This Week</div>
            <div
              className="font-display"
              style={{ fontSize: 36, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, marginTop: 10, fontVariantNumeric: "tabular-nums" }}
            >
              {completedCount} <span style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-faint)" }}>of 7</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, fontWeight: 600 }}>Workouts completed</div>
          </div>
          <ProgressRing value={pct} size="sm">
            <span className="font-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{pct}%</span>
          </ProgressRing>
        </div>
      </Card>

      {/* Settings rows */}
      <Card data-appear style={{ marginBottom: 14, padding: 6 }}>
        <SettingsRow
          iconD={icons.target}
          label="Goals"
          value={goalLabel}
          divider
          tone="accent"
          onClick={() => dispatch({ type: "openSheet", sheet: "goals" })}
        />
        <SettingsRow
          iconD={icons.sun}
          label="Appearance"
          value={THEMES[theme]?.label ?? theme}
          divider
          tone="accent-2"
          onClick={() => dispatch({ type: "openSheet", sheet: "settings" })}
        />
        <SettingsRow
          iconD={icons.user}
          label="Account"
          tone="accent-3"
          onClick={() => dispatch({ type: "openSheet", sheet: "account" })}
        />
      </Card>

      {/* Streak card */}
      <Card data-appear style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Activity Streak</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13.5,
              fontWeight: 800,
              color: "var(--accent)",
              background: "var(--accent-soft)",
              padding: "5px 11px",
              borderRadius: 999,
            }}
          >
            <Icon d={icons.flame} size={13} fill="var(--accent)" stroke={0} />
            {streak} {streak === 1 ? "day" : "days"}
          </span>
        </div>
        <DayTracker
          labelsAbove={false}
          days={["M", "T", "W", "T", "F", "S", "S"].map((l, i) => ({
            label: l,
            status: weekCompleted[i] ? "checked" : "empty",
          }))}
          onToggle={(i) => dispatch({ type: "toggleWeekDay", index: i })}
        />
      </Card>

      {/* Achievements */}
      <button
        data-appear
        onClick={() => dispatch({ type: "openSheet", sheet: "achievements" })}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "15px 16px",
          borderRadius: 22,
          background: "var(--card-bg)",
          backdropFilter: "blur(14px)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-soft)",
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "var(--accent-3-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon d={icons.trophy} size={18} stroke={2} style={{ color: "var(--accent-3)" }} />
        </div>
        <span style={{ flex: 1, textAlign: "left", fontSize: 15.5, color: "var(--ink)", fontWeight: 700 }}>
          View Achievements
        </span>
        <Icon d={icons.chevronRight} size={18} stroke={2.4} style={{ color: "var(--ink-faint)" }} />
      </button>

      {/* Reset */}
      <button
        data-appear
        onClick={() => dispatch({ type: "openSheet", sheet: "reset" })}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "15px 16px",
          borderRadius: 22,
          background: "linear-gradient(135deg, #ffe5e5 0%, #ffd6d6 100%)",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 6px 18px -8px rgba(220,60,60,0.22)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(220,60,60,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon d={icons.refresh} size={17} stroke={2} style={{ color: "#d94040" }} />
        </div>
        <span style={{ flex: 1, textAlign: "left", fontSize: 14.5, color: "#c03030", fontWeight: 700 }}>
          Reset All Data
        </span>
      </button>
    </div>
  );
}
