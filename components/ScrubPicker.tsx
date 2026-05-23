"use client";

import { useRef, useCallback, useEffect } from "react";

const PX_PER_UNIT = 14;
const FRICTION = 0.88;
const MIN_VELOCITY = 0.05;

export default function ScrubPicker({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
  flex = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  flex?: boolean;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const startX = useRef<number | null>(null);
  const startVal = useRef(value);
  const accumPx = useRef(0);
  const velocityPx = useRef(0);
  const lastX = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const liveVal = useRef(value);

  useEffect(() => { liveVal.current = value; }, [value]);

  const cancelMomentum = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const startMomentum = useCallback(() => {
    let vel = velocityPx.current;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs === null) { lastTs = ts; rafId.current = requestAnimationFrame(tick); return; }
      const dt = ts - lastTs;
      lastTs = ts;

      vel *= Math.pow(FRICTION, dt / 16);
      if (Math.abs(vel) < MIN_VELOCITY) { rafId.current = null; return; }

      liveVal.current += (vel * dt) / PX_PER_UNIT;
      const rounded = clamp(Math.round(liveVal.current));
      onChange(rounded);

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, min, max]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    cancelMomentum();
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startVal.current = value;
    accumPx.current = 0;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocityPx.current = 0;
  }, [value]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (startX.current === null) return;

    const now = performance.now();
    const dt = now - (lastTime.current ?? now);
    if (dt > 0) {
      const dx = e.clientX - (lastX.current ?? e.clientX);
      velocityPx.current = dx / dt;
    }
    lastX.current = e.clientX;
    lastTime.current = now;

    const totalDx = e.clientX - startX.current;
    const newVal = clamp(Math.round(startVal.current + totalDx / PX_PER_UNIT));
    liveVal.current = newVal;
    onChange(newVal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, min, max]);

  const onPointerUp = useCallback(() => {
    startX.current = null;
    startMomentum();
  }, [startMomentum]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        userSelect: "none",
        cursor: "ew-resize",
        touchAction: "none",
        padding: "10px 12px",
        borderRadius: 14,
        background: "var(--surface)",
        border: "1px solid var(--border-inner)",
        minWidth: 52,
        ...(flex ? { flex: 1 } : {}),
      }}
    >
      <svg width={6} height={10} viewBox="0 0 6 10" fill="none">
        <path d="M5 1L1 5L5 9" stroke="var(--ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
        <span style={{ fontSize: 10, color: "var(--ink-faint)", fontWeight: 700 }}>{label}</span>
      </div>
      <svg width={6} height={10} viewBox="0 0 6 10" fill="none">
        <path d="M1 1L5 5L1 9" stroke="var(--ink-faint)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
