import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
};

export function Button({ className = "", variant = "default", size = "default", style, ...props }: ButtonProps) {
  const sizeStyle: React.CSSProperties =
    size === "sm"
      ? { padding: "6px 10px", fontSize: 13 }
      : size === "lg"
      ? { padding: "12px 18px", fontSize: 16 }
      : { padding: "8px 14px", fontSize: 14 };

  const variantStyle: React.CSSProperties =
    variant === "outline"
      ? {
          background: "transparent",
          border: "1px solid var(--color-border, #334155)",
          color: "var(--color-fg, #e2e8f0)",
        }
      : variant === "ghost"
      ? {
          background: "transparent",
          border: "1px solid transparent",
          color: "var(--color-fg, #e2e8f0)",
        }
      : {
          background: "#2563eb",
          border: "1px solid #2563eb",
          color: "white",
        };

  return (
    <button
      {...props}
      className={className}
      style={{
        borderRadius: 8,
        cursor: "pointer",
        ...sizeStyle,
        ...variantStyle,
        ...style,
      }}
    />
  );
}
