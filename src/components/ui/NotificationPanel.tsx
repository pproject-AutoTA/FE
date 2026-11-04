import type { ReactNode } from "react";
import { ArrowRight, Bell } from "lucide-react";
import { Badge } from "./Badge";
import { linkButton, linkButtonBase } from "./classes";

/* ============ NotificationPanel (종 아이콘 패널) ============ */
export interface NotificationItem {
  id: string | number;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  icon?: ReactNode;
}
export interface NotificationPanelProps {
  title: string;
  items: NotificationItem[];
  onReadAll?: () => void;
  onViewAll?: () => void;
  viewAllLabel?: string;
}
export function NotificationPanel({ title, items, onReadAll, onViewAll, viewAllLabel = "전체 공지 보기" }: NotificationPanelProps) {
  const unread = items.filter((i) => i.unread).length;
  return (
    <div className="w-[523px] max-w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg" role="dialog" aria-label={title}>
      <div className="flex items-center gap-3 border-b border-border px-[26px] py-[22px]">
        <h3 className="m-0 text-xl leading-7 font-bold">{title}</h3>
        {unread > 0 && <Badge tone="info">새 알림 {unread}</Badge>}
        <button type="button" className={`${linkButtonBase} ml-auto text-sm`} onClick={onReadAll}>모두 읽음</button>
      </div>
      {items.map((n) => (
        <div key={n.id} className="flex gap-[18px] border-b border-border px-[26px] py-[22px]">
          <span className={`grid size-12 flex-none place-items-center rounded-[14px] ${n.unread ? "bg-blue-50 text-blue-600" : "bg-neutral-bg text-fg-secondary"}`}>
            {n.icon ?? <Bell size={22} strokeWidth={1.75} aria-hidden />}
          </span>
          <div>
            <strong className="block text-base leading-[22px] font-bold">{n.title}</strong>
            <p className="mx-0 mt-0.5 mb-1 text-sm leading-5 text-fg-secondary">{n.body}</p>
            <small className="text-xs leading-4 text-fg-tertiary">{n.time}</small>
          </div>
        </div>
      ))}
      <div className="flex justify-center p-[18px]">
        <button type="button" className={linkButton} onClick={onViewAll}>{viewAllLabel}<ArrowRight size={18} strokeWidth={1.75} aria-hidden /></button>
      </div>
    </div>
  );
}
