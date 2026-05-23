import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export default function Card({
  children,
  style = {},
  onClick,
  ...rest
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "style" | "onClick">) {
  return (
    <div
      onClick={onClick}
      {...rest}
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid var(--border-color)",
        borderRadius: 26,
        padding: "20px",
        cursor: onClick ? "pointer" : "default",
        boxShadow: "var(--shadow-soft)",
        transition: "transform 0.18s cubic-bezier(0.34,1.3,0.4,1), box-shadow 0.18s",
        ...style,
      }}
      onMouseDown={(e) => {
        if (onClick) e.currentTarget.style.transform = "scale(0.985)";
      }}
      onMouseUp={(e) => {
        if (onClick) e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </div>
  );
}
