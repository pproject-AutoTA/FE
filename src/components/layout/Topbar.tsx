import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

/* ---------- Topbar ---------- */
export interface TopbarProps {
  responsive?: boolean;
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
  user,
  responsive,
  hasUnread,
  searchPlaceholder = "문제, 학생 또는 제출 ID 검색",
  onSearch,
  onBellClick,
  bellOpen,
  popover,
}: TopbarProps) {
  return (
    <header
      onKeyDown={
        responsive
          ? (event) => {
              if (event.key === "Escape" && bellOpen) onBellClick?.();
            }
          : undefined
      }
      className={`relative box-border flex h-[105px] items-center justify-between border-b border-border bg-surface pr-12 pl-[54px] ${responsive ? "max-[1000px]:px-4" : ""}`}
    >
      <label
        className={`flex flex-1 items-center gap-3.5 text-lg leading-6 text-fg-tertiary ${responsive ? "min-w-0 max-[1000px]:gap-2 max-[1000px]:text-sm" : ""}`}
      >
        <Search size={24} strokeWidth={1.75} aria-hidden />
        <input
          className={`w-[460px] max-w-full border-0 bg-transparent text-fg outline-none [font:inherit] placeholder:text-fg-tertiary ${responsive ? "min-w-0" : ""}`}
          aria-label="검색"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </label>
      <div className={`flex items-center gap-[26px] ${responsive ? "max-[1000px]:gap-2" : ""}`}>
        <button
          type="button"
          className="relative inline-flex cursor-pointer rounded-full border-0 bg-transparent p-1.5 text-fg-body hover:bg-neutral-bg"
          aria-label={hasUnread ? "읽지 않은 알림 있음" : "알림"}
          aria-expanded={!!bellOpen}
          onClick={onBellClick}
        >
          <Bell size={24} strokeWidth={1.75} />
          {hasUnread && (
            <i className="absolute top-1 right-[5px] box-border size-2.5 rounded-full border-2 border-white bg-unread-dot" />
          )}
        </button>
        <div
          className={`border-l border-border pl-[26px] ${responsive ? "max-[1000px]:pl-2" : ""}`}
        >
          <strong className="block text-lg leading-6 font-bold">{user.name}</strong>
          <span className="block text-sm leading-5 text-fg-secondary">{user.sub}</span>
        </div>
      </div>
      {bellOpen && popover && (
        <div
          className={`absolute top-[92px] right-12 z-40 ${responsive ? "max-[1000px]:right-4 max-[1000px]:left-4" : ""}`}
        >
          {popover}
        </div>
      )}
    </header>
  );
}
