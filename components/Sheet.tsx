"use client";

import type { ReactNode } from "react";
import Icon from "./Icon";
import { icons } from "@/lib/icons";

export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(40,52,48,0.32)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          zIndex: 50,
          animation: "fade-in 0.22s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 51,
          background: "var(--sheet-bg)",
          borderRadius: "32px 32px 0 0",
          boxShadow: "0 -16px 40px -12px rgba(40,60,52,0.3)",
          padding: "10px 22px 26px",
          maxHeight: "84%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "sheet-up 0.36s cubic-bezier(0.34,1.1,0.4,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 14px" }}>
          <div style={{ width: 42, height: 5, borderRadius: 999, background: "var(--ink-faint)", opacity: 0.5 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span
            className="font-display"
            style={{ fontSize: 21, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-inner)",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--ink-soft)",
            }}
          >
            <Icon d={icons.x} size={16} stroke={2.6} />
          </button>
        </div>
        <div className="hide-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
