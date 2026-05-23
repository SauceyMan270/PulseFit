"use client";

import { useState, useEffect } from "react";

export default function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={focused ? draft : String(value)}
      onFocus={() => { setFocused(true); setDraft(""); }}
      onChange={(e) => { if (/^\d*$/.test(e.target.value)) setDraft(e.target.value); }}
      onBlur={() => {
        setFocused(false);
        const v = draft === "" ? 0 : parseInt(draft, 10);
        onChange(isNaN(v) ? 0 : v);
      }}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        outline: "none",
        textAlign: "center",
        fontSize: 22,
        fontWeight: 700,
        color: "var(--ink)",
        fontFamily: "inherit",
        padding: 0,
      }}
    />
  );
}
