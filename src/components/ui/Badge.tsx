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

const TONE: Record<Tone, string> = {
  success: "bg-success-bg text-success-fg",
  danger: "bg-danger-bg text-danger-fg",
  flag: "bg-flag-bg text-flag-fg",
  amber: "bg-amber-bg text-amber-fg",
  neutral: "bg-neutral-bg text-neutral-fg",
  info: "bg-info-bg text-info-fg",
  purple: "bg-purple-bg text-purple-fg",
};

export function Badge({ tone = "neutral", large, square, icon, dot, children }: BadgeProps) {
  const size = square
    ? "h-11 min-w-[60px] rounded-[14px] px-3.5 text-[15px]"
    : large
      ? "h-10 rounded-full px-[18px] text-[15px]"
      : "h-8 rounded-full px-3.5 text-sm";
  return (
    <span className={`inline-flex items-center justify-center gap-1.5 leading-none font-bold whitespace-nowrap ${size} ${TONE[tone]}`}>
      {dot && <i className="size-2 flex-none rounded-full bg-current" aria-hidden />}
      {icon}
      {children}
    </span>
  );
}
