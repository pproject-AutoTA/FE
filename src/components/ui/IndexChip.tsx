import type { ReactNode } from "react";

/* ============ IndexChip (문제 번호 칩) ============ */
export function IndexChip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "blue" | "purple" | "orange" }) {
  return <span className={`cl-idx${tone === "neutral" ? "" : ` cl-idx--${tone}`}`}>{children}</span>;
}
