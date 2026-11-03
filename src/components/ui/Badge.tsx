import type { ReactNode } from "react";

/* ============ Badge ============ */
export type Tone = "success" | "danger" | "flag" | "amber" | "neutral" | "info" | "purple";
export interface BadgeProps {
  tone?: Tone;
  large?: boolean;
  /** 목록 왼쪽의 둥근 사각형 칩 (예: AC / WA) */
  square?: boolean;
  icon?: ReactNode;
  /** 앞에 작은 점 (예: 실시간 갱신 중) */
  dot?: boolean;
  children: ReactNode;
}
export function Badge({ tone = "neutral", large, square, icon, dot, children }: BadgeProps) {
  const cls = `cl-badge cl-badge--${tone}${large ? " cl-badge--lg" : ""}${square ? " cl-badge--square" : ""}`;
  return (
    <span className={cls}>
      {dot && <i className="cl-badge-dot" aria-hidden />}
      {icon}
      {children}
    </span>
  );
}
