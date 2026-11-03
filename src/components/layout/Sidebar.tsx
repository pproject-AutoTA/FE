import type { ReactNode } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";

export type Role = "student" | "professor" | "admin";
export const ROLE_LABEL: Record<Role, string> = { student: "학생", professor: "교수", admin: "시스템 관리자" };

/* ---------- Sidebar ---------- */
export interface MenuItem { path: string; label: string; icon?: ReactNode; badge?: number }
export interface SidebarProps {
  role: Role;
  userInitial: string;
  menuItems: MenuItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  /** 메뉴 위 그룹 라벨 (예: "학습") */
  sectionLabel?: string;
  /** 하단 도움말 카드 (SidebarHelpCard) */
  helpCard?: ReactNode;
}
export function Sidebar({ role, userInitial, menuItems, activePath, onNavigate, onLogout, sectionLabel, helpCard }: SidebarProps) {
  return (
    <aside className="cl-sidebar">
      <Logo />
      <div className="cl-role">
        <span className="cl-avatar" aria-hidden>{userInitial}</span>
        <div className="cl-role-text">
          <small>로그인 역할</small>
          <strong>{ROLE_LABEL[role]}</strong>
        </div>
        <ShieldCheck className="cl-role-icon" size={24} strokeWidth={1.75} aria-hidden />
      </div>
      {sectionLabel && <div className="cl-nav-label">{sectionLabel}</div>}
      <nav className="cl-navlist" aria-label="주 메뉴" style={sectionLabel ? undefined : { marginTop: 36 }}>
        {menuItems.map((m) => (
          <NavItem key={m.path} icon={m.icon} label={m.label} badge={m.badge} active={activePath === m.path} onClick={() => onNavigate(m.path)} />
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      {helpCard}
      <div className="cl-sidebar-foot">
        <NavItem variant="foot" icon={<LogOut size={24} strokeWidth={1.75} />} label="로그아웃" onClick={onLogout} />
      </div>
    </aside>
  );
}
