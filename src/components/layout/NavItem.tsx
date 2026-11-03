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
  const cls = `cl-nav${active ? " is-active" : ""}${variant === "foot" ? " cl-nav--foot" : ""}`;
  return (
    <button type="button" className={cls} onClick={onClick} aria-current={active ? "page" : undefined}>
      <span style={{ display: "inline-flex", width: 24, height: 24 }}>{icon}</span>
      {label}
      {badge ? <span className="cl-nav-badge">{badge}</span> : null}
    </button>
  );
}
