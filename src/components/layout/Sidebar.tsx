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
    <aside className="sticky top-0 box-border flex h-screen flex-col bg-navy-900 px-[22px] pt-[42px] text-white">
      <Logo />
      <div className="mt-10 flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.07)] px-5 py-[18px]">
        <span className="grid size-[52px] flex-none place-items-center rounded-full bg-[#E9EDFF] text-[22px] leading-none font-bold text-navy-900" aria-hidden>{userInitial}</span>
        <div>
          <small className="block text-sm leading-[18px] text-[#B9C6E2]">로그인 역할</small>
          <strong className="block text-[21px] leading-7 font-bold">{ROLE_LABEL[role]}</strong>
        </div>
        <ShieldCheck className="ml-auto flex-none" size={24} strokeWidth={1.75} aria-hidden />
      </div>
      {sectionLabel && <div className="mx-4 mt-9 mb-3 text-sm leading-[18px] font-medium text-[#8290B4]">{sectionLabel}</div>}
      <nav className={`-mx-0.5 flex flex-col gap-1.5${sectionLabel ? "" : " mt-9"}`} aria-label="주 메뉴">
        {menuItems.map((m) => (
          <NavItem key={m.path} icon={m.icon} label={m.label} badge={m.badge} active={activePath === m.path} onClick={() => onNavigate(m.path)} />
        ))}
      </nav>
      <div className="flex-1" />
      {helpCard}
      <div className="-mx-[22px] border-t border-[rgba(255,255,255,.1)] px-[22px]">
        <NavItem variant="foot" icon={<LogOut size={24} strokeWidth={1.75} />} label="로그아웃" onClick={onLogout} />
      </div>
    </aside>
  );
}
