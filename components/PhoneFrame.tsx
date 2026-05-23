import type { ReactNode } from "react";

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#dfeee8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 54,
          padding: 10,
          background: "linear-gradient(180deg, #f4f4f4 0%, #d4d4d4 50%, #c0c0c0 100%)",
          boxShadow: "0 60px 140px -30px rgba(60,90,80,0.4), 0 30px 60px -30px rgba(60,90,80,0.2)",
        }}
      >
        <div
          style={{
            borderRadius: 46,
            overflow: "hidden",
            width: 390,
            height: 844,
            background: "#e7f7ef",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
