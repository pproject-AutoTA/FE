import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

/* ---------- Topbar ---------- */
export interface TopbarProps {
  user: { name: string; sub: string };
  hasUnread?: boolean;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  onBellClick?: () => void;
  /** 알림 패널이 열려 있는지 */
  bellOpen?: boolean;
  /** 종 아이콘 아래에 뜨는 패널 (NotificationPanel) */
  popover?: ReactNode;
}
export function Topbar({
  user, hasUnread, searchPlaceholder = "문제, 학생 또는 제출 ID 검색", onSearch, onBellClick, bellOpen, popover,
}: TopbarProps) {
  return (
    <header className="cl-topbar">
      <label className="cl-search">
        <Search size={24} strokeWidth={1.75} aria-hidden />
        <input aria-label="검색" placeholder={searchPlaceholder} onChange={(e) => onSearch?.(e.target.value)} />
      </label>
      <div className="cl-topbar-right">
        <button type="button" className="cl-bell" aria-label={hasUnread ? "읽지 않은 알림 있음" : "알림"} aria-expanded={!!bellOpen} onClick={onBellClick}>
          <Bell size={24} strokeWidth={1.75} />
          {hasUnread && <i />}
        </button>
        <div className="cl-user">
          <strong>{user.name}</strong>
          <span>{user.sub}</span>
        </div>
      </div>
      {bellOpen && popover && <div className="cl-popover">{popover}</div>}
    </header>
  );
}
