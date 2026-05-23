"use client";

import Icon from "./Icon";
import { icons } from "@/lib/icons";

export default function SettingsRow({
  iconD,
  label,
  value,
  divider,
  tone = "accent",
  onClick,
}: {
  iconD: string | string[];
  label: string;
  value?: string;
  divider?: boolean;
  tone?: "accent" | "accent-2" | "accent-3";
  onClick?: () => void;
}) {
  return (
    <>
      <button
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "15px 18px",
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: `var(--${tone}-soft)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`var(--${tone})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {Array.isArray(iconD) ? iconD.map((p, i) => <path key={i} d={p} />) : <path d={iconD} />}
          </svg>
        </div>
        <span style={{ flex: 1, textAlign: "left", fontSize: 15.5, color: "var(--ink)", fontWeight: 600 }}>{label}</span>
        {value && <span style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>{value}</span>}
        <Icon d={icons.chevronRight} size={17} stroke={2.4} style={{ color: "var(--ink-faint)" }} />
      </button>
      {divider && <div style={{ height: 1, background: "var(--border-inner)", marginLeft: 67 }} />}
    </>
  );
}
