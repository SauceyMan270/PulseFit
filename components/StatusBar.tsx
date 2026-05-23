export default function StatusBar() {
  return (
    <div
      style={{
        height: 52,
        padding: "10px 24px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>9:41</span>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          width: 118,
          height: 32,
          borderRadius: 999,
          background: "#1a1a1a",
        }}
      />
      <div />
    </div>
  );
}
