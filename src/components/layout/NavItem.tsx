import type { ReactNode } from "react";

/* ---------- NavItem ---------- */
export interface NavItemProps {
  icon?: ReactNode;
  label: string;
  /** 오른쪽 주황 숫자 배지 (예: 채점 검토 7) */
  badge?: number;
  active?: boolean;
  /** foot: 사이드바 맨 아래(로그아웃) */
  variant?: "default" | "foot";
  onClick?: () => void;
}
export function NavItem({ icon, label, badge, active, variant = "default", onClick }: NavItemProps) {
  const foot = variant === "foot";
  const size = foot ? "h-[84px] rounded-none px-4" : "h-[62px] rounded-lg px-5";
  const color = active
    ? "bg-blue-600 font-medium text-white"
    : `bg-transparent ${foot ? "text-[#99A6C7]" : "text-[#B9C2DB]"} hover:bg-[rgba(255,255,255,.06)] hover:text-white`;
  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center gap-[18px] border-0 text-left text-[19px] leading-6 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-white ${size} ${color}`}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      <span className="inline-flex size-6">{icon}</span>
      {label}
      {badge ? (
        <span className="ml-auto box-border grid h-8 min-w-8 place-items-center rounded-full bg-flag-fg px-2 text-sm leading-none font-bold text-white">{badge}</span>
      ) : null}
    </button>
  );
}
