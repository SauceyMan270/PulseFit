"use client";

import { useEffect, useState } from "react";

export default function PopEffect({ msg, onDone }: { msg: string; onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exit = setTimeout(() => setExiting(true), 1800);
    const done = setTimeout(onDone, 2300);
    return () => { clearTimeout(exit); clearTimeout(done); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 118,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "13px 22px",
        background: "var(--accent)",
        borderRadius: 999,
        color: "#fff",
        fontSize: 14.5,
        fontWeight: 700,
        fontFamily: '"Quicksand", sans-serif',
        zIndex: 60,
        whiteSpace: "nowrap",
        boxShadow: "0 14px 30px -10px var(--accent)",
        animation: exiting
          ? "toast-out 0.45s cubic-bezier(0.4,0,0.8,0.6) forwards"
          : "toast-in 0.42s cubic-bezier(0.34,1.4,0.5,1) both",
      }}
    >
      {msg}
    </div>
  );
}
