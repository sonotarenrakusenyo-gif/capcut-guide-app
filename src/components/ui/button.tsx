import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
};

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const variantStyle =
    variant === "outline"
      ? "background: transparent; border: 1px solid #334155; color: #e2e8f0;"
      : variant === "ghost"
      ? "background: transparent; border: 1px solid transparent; color: #e2e8f0;"
      : "background: #2563eb; border: 1px solid #2563eb; color: white;";
  const sizeStyle = size === "sm" ? "padding: 6px 10px;" : size === "lg" ? "padding: 12px 18px;" : "padding: 8px 14px;";

  return (
    <button
      {...props}
      className={className}
      style={{
        borderRadius: 8,
        cursor: "pointer",
        ...Object.fromEntries(
          (variantStyle + sizeStyle)
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((rule) => {
              const [k, v] = rule.split(":").map((x) => x.trim());
              return [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v];
            })
        ),
      } as React.CSSProperties}
    />
  );
}
