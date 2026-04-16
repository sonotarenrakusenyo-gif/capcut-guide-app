import React from "react";

export function Card({ className = "", style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={className}
      style={{
        background: "var(--color-card, #0f172a)",
        border: "1px solid var(--color-border, #334155)",
        borderRadius: 12,
        color: "var(--color-fg, #e5e7eb)",
        ...style,
      }}
    />
  );
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className} style={{ padding: 16 }} />;
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={className} style={{ margin: 0, fontSize: 18 }} />;
}

export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={className} style={{ margin: "8px 0 0", opacity: 0.8 }} />;
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className} style={{ padding: 16 }} />;
}
