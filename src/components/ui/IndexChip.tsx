import type { ReactNode } from "react";

/* ============ IndexChip (문제 번호 칩) ============ */
const TONE = {
  neutral: "bg-neutral-bg text-fg-secondary",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-bg text-purple-fg",
  orange: "bg-flag-bg text-flag-fg",
} as const;

export function IndexChip({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof TONE }) {
  return (
    <span className={`grid size-11 flex-none place-items-center rounded-lg text-[15px] leading-none font-bold ${TONE[tone]}`}>
      {children}
    </span>
  );
}
