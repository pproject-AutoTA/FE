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
    <div className="grid min-h-screen min-w-[1440px] grid-cols-[384px_minmax(0,1fr)]">
      <Sidebar {...sidebar} userInitial={user.name.slice(0, 1)} />
      <div className="min-w-0">
        <Topbar user={user} hasUnread={hasUnread} onBellClick={onBellClick} bellOpen={bellOpen} popover={notifications} />
        <main className="flex flex-col gap-7 px-14 pt-14 pb-[72px]">{children}</main>
      </div>
    </div>
  );
}
