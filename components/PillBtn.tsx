"use client";

import type { CSSProperties, ReactNode } from "react";

export default function PillBtn({
  children,
  variant = "primary",
  tone = "accent",
  leadIcon,
  trailIcon,
  onClick,
  style = {},
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "soft";
  tone?: "accent" | "accent-2" | "accent-3";
  leadIcon?: ReactNode;
  trailIcon?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}) {
  const base = `var(--${tone})`;
  const soft = `var(--${tone}-soft)`;

  let bg: string;
  let color: string;
  let border = "none";
  let shadow = "none";

  if (variant === "primary") {
    bg = base;
    color = "#ffffff";
    shadow = "none";
  } else if (variant === "soft") {
    bg = soft;
    color = base;
  } else {
    bg = "transparent";
    color = "var(--ink)";
    border = "1.6px solid var(--border-inner)";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 58,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        position: "relative",
        border,
        cursor: disabled ? "not-allowed" : "pointer",
        background: bg,
        color,
        boxShadow: disabled ? "none" : shadow,
        fontSize: 16.5,
        fontWeight: 700,
        fontFamily: '"Quicksand", sans-serif',
        letterSpacing: "0.01em",
        opacity: disabled ? 0.45 : 1,
        transition: "transform 0.12s cubic-bezier(0.34,1.4,0.5,1), opacity 0.12s",
        ...style,
      }}
      onTouchStart={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
      }}
      onTouchEnd={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {leadIcon && <span style={{ position: "absolute", left: 12, display: "flex" }}>{leadIcon}</span>}
      {children}
      {trailIcon && <span style={{ position: "absolute", right: 18, display: "flex" }}>{trailIcon}</span>}
    </button>
  );
}
