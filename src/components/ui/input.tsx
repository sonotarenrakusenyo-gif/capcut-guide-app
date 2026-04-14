import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={className}
      style={{
        width: "100%",
        borderRadius: 8,
        border: "1px solid #334155",
        background: "#111827",
        color: "#e5e7eb",
        padding: "10px 12px",
      }}
    />
  );
}
