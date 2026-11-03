import type { ReactNode } from "react";

/* ============ TagChip (읽기 전용 태그: 금지/허용 요소) ============ */
export function TagChip({ tone = "neutral", children }: { tone?: "deny" | "allow" | "neutral"; children: ReactNode }) {
  return <span className={`cl-tagchip${tone === "neutral" ? "" : ` cl-tagchip--${tone}`}`}>{children}</span>;
}
