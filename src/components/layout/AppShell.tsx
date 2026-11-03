import type { ReactNode } from "react";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { Topbar } from "./Topbar";

/* ---------- AppShell ---------- */
export interface AppShellProps extends Omit<SidebarProps, "userInitial"> {
  user: { name: string; sub: string };
  hasUnread?: boolean;
  onBellClick?: () => void;
  bellOpen?: boolean;
  /** 알림 패널 (NotificationPanel) */
  notifications?: ReactNode;
  children: ReactNode;
}
export function AppShell({ user, hasUnread, onBellClick, bellOpen, notifications, children, ...sidebar }: AppShellProps) {
  return (
    <div className="cl-shell">
      <Sidebar {...sidebar} userInitial={user.name.slice(0, 1)} />
      <div>
        <Topbar user={user} hasUnread={hasUnread} onBellClick={onBellClick} bellOpen={bellOpen} popover={notifications} />
        <main className="cl-main">{children}</main>
      </div>
    </div>
  );
}
