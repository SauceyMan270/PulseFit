"use client";

import { useEffect, useState, useId, type ReactNode } from "react";

type Size = "sm" | "md" | "lg";

const CFG: Record<Size, { d: number; s: number }> = {
  sm: { d: 92, s: 11 },
  md: { d: 132, s: 13 },
  lg: { d: 200, s: 15 },
};

export default function ProgressRing({
  value,
  size = "md",
  tone = "accent",
  trackColor,
  progressColor,
  children,
}: {
  value: number;
  size?: Size;
  tone?: "accent" | "accent-2" | "accent-3";
  trackColor?: string;
  progressColor?: string;
  children?: ReactNode;
}) {
  const cfg = CFG[size];
  const r = (cfg.d - cfg.s) / 2;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  const gradId = useId();

  useEffect(() => {
    const t = setTimeout(() => setAnim(value), 80);
    return () => clearTimeout(t);
  }, [value]);

  const offset = circ - (Math.min(Math.max(anim, 0), 100) / 100) * circ;

  return (
    <div
      style={{
        width: cfg.d,
        height: cfg.d,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={cfg.d} height={cfg.d} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: `var(--${tone})` }} />
            <stop offset="100%" style={{ stopColor: `var(--${tone === "accent" ? "accent-2" : tone === "accent-2" ? "accent-3" : "accent"})` }} />
          </linearGradient>
        </defs>
        <circle cx={cfg.d / 2} cy={cfg.d / 2} r={r - cfg.s / 2} fill="rgba(255,255,255,0.72)" />
        <circle cx={cfg.d / 2} cy={cfg.d / 2} r={r} fill="none" stroke={trackColor ?? "var(--ring-track)"} strokeWidth={cfg.s} />
        <circle
          cx={cfg.d / 2}
          cy={cfg.d / 2}
          r={r}
          fill="none"
          stroke={progressColor ?? `url(#${gradId})`}
          strokeWidth={cfg.s}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.1,0.4,1)" }}
        />
      </svg>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>{children}</div>
    </div>
  );
}
