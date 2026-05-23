"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";

const ITEM_H = 28;
const VISIBLE = 5;
const CONTAINER_H = ITEM_H * VISIBLE;

const FRICTION   = 0.96;
const MIN_VEL    = 0.08;
const RUBBER     = 0.18;
const SPRING_K   = 0.22;
const SPRING_D   = 0.72;

export default function WheelPicker({
  label,
  value,
  onChange,
  min = 1,
  max = 50,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const maxOffset = (max - min) * ITEM_H;

  const [offset, setOffset] = useState((value - min) * ITEM_H);

  const offsetRef   = useRef((value - min) * ITEM_H);
  const velRef      = useRef(0);
  const rafRef      = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const startY      = useRef<number | null>(null);
  const startOff    = useRef(0);
  const lastY       = useRef(0);
  const lastT       = useRef(0);

  useLayoutEffect(() => { onChangeRef.current = onChange; });

  useEffect(() => {
    const target = (value - min) * ITEM_H;
    if (Math.abs(offsetRef.current - target) > ITEM_H * 0.6) {
      cancelRAF();
      offsetRef.current = target;
      setOffset(target);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min]);

  function cancelRAF() {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }

  function applyOffset(o: number) {
    offsetRef.current = o;
    setOffset(o);
    const v = min + Math.round(Math.max(0, Math.min(maxOffset, o)) / ITEM_H);
    onChangeRef.current(v);
  }

  function springSettle() {
    const target = Math.round(
      Math.max(0, Math.min(maxOffset, offsetRef.current)) / ITEM_H
    ) * ITEM_H;

    function tick() {
      const disp = offsetRef.current - target;
      velRef.current = velRef.current * SPRING_D + (-SPRING_K * disp);
      applyOffset(offsetRef.current + velRef.current);
      if (Math.abs(disp) < 0.15 && Math.abs(velRef.current) < 0.15) {
        applyOffset(target);
        velRef.current = 0;
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function startMomentum() {
    let lastTs: number | null = null;

    function tick(ts: number) {
      if (lastTs === null) { lastTs = ts; rafRef.current = requestAnimationFrame(tick); return; }
      const dt = Math.min(ts - lastTs, 32);
      lastTs = ts;

      velRef.current *= Math.pow(FRICTION, dt / 16);

      if (Math.abs(velRef.current) < MIN_VEL) {
        velRef.current = 0;
        springSettle();
        return;
      }

      const next = offsetRef.current - velRef.current * (dt / 16);
      if (next < 0 || next > maxOffset) velRef.current *= 0.5;
      applyOffset(next);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function onPointerDown(e: React.PointerEvent) {
    cancelRAF();
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current  = e.clientY;
    startOff.current = offsetRef.current;
    lastY.current   = e.clientY;
    lastT.current   = performance.now();
    velRef.current  = 0;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startY.current === null) return;
    const now = performance.now();
    const dt  = now - lastT.current;
    if (dt > 0) velRef.current = (e.clientY - lastY.current) / dt;
    lastY.current = e.clientY;
    lastT.current = now;

    let raw = startOff.current - (e.clientY - startY.current);
    if (raw < 0)           raw = raw * RUBBER;
    else if (raw > maxOffset) raw = maxOffset + (raw - maxOffset) * RUBBER;
    applyOffset(raw);
  }

  function onPointerUp() {
    startY.current = null;
    if (offsetRef.current < 0 || offsetRef.current > maxOffset) {
      velRef.current = 0;
      springSettle();
    } else {
      startMomentum();
    }
  }

  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const translateY = CONTAINER_H / 2 - ITEM_H / 2 - offset;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1,
      background: "var(--surface)",
      border: "1px solid var(--border-inner)",
      borderRadius: 16,
      padding: "8px 6px 8px",
    }}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "relative",
          height: CONTAINER_H,
          width: "100%",
          overflow: "hidden",
          cursor: "ns-resize",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: ITEM_H, transform: "translateY(-50%)",
          background: "var(--accent-soft)", borderRadius: 9,
          pointerEvents: "none", zIndex: 1,
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: ITEM_H * 2,
          background: "linear-gradient(to bottom, var(--surface), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: ITEM_H * 2,
          background: "linear-gradient(to top, var(--surface), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          transform: `translateY(${translateY}px)`,
          willChange: "transform",
        }}>
          {items.map((v) => {
            const dist    = (( v - min) * ITEM_H - offset) / ITEM_H;
            const absDist = Math.abs(dist);
            return (
              <div key={v} style={{
                height: ITEM_H,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: absDist < 0.5 ? 15 : 12,
                fontWeight: absDist < 0.5 ? 800 : 600,
                color: absDist < 0.5 ? "var(--accent-text)" : "var(--ink-soft)",
                opacity: Math.max(0.3, 1 - absDist * 0.4),
                transform: `scale(${Math.max(0.72, 1 - absDist * 0.11)})`,
                fontVariantNumeric: "tabular-nums",
              }}>
                {v}
              </div>
            );
          })}
        </div>
      </div>
      <span style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}
