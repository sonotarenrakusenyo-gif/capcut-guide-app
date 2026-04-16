import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={className}
      style={{
        width: "100%",
        borderRadius: 8,
        border: "1px solid var(--color-border, #334155)",
        background: "var(--color-input-bg, #111827)",
        color: "var(--color-fg, #e5e7eb)",
        padding: "10px 12px",
      }}
    />
  );
}
