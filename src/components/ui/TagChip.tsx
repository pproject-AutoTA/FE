import type { ReactNode } from "react";

/* ============ TagChip (읽기 전용 태그: 금지/허용 요소) ============ */
const TONE = {
  neutral: "border-border",
  deny: "border-flag-border text-flag-fg",
  allow: "border-info-border text-info-fg",
} as const;

export function TagChip({ tone = "neutral", children }: { tone?: keyof typeof TONE; children: ReactNode }) {
  return (
    <span className={`box-border inline-flex h-9 items-center rounded-md border bg-white px-3.5 font-mono text-sm leading-none font-medium ${tone === "neutral" ? "text-fg-body" : ""} ${TONE[tone]}`}>
      {children}
    </span>
  );
}
