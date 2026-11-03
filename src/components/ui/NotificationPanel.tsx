import type { ReactNode } from "react";
import { ArrowRight, Bell } from "lucide-react";
import { Badge } from "./Badge";

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
    <div className="cl-notif" role="dialog" aria-label={title}>
      <div className="cl-notif-head">
        <h3>{title}</h3>
        {unread > 0 && <Badge tone="info">새 알림 {unread}</Badge>}
        <button type="button" className="cl-link" onClick={onReadAll}>모두 읽음</button>
      </div>
      {items.map((n) => (
        <div key={n.id} className={`cl-notif-item${n.unread ? " is-unread" : ""}`}>
          <span className="cl-notif-icon">{n.icon ?? <Bell size={22} strokeWidth={1.75} aria-hidden />}</span>
          <div>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            <small>{n.time}</small>
          </div>
        </div>
      ))}
      <div className="cl-notif-foot">
        <button type="button" className="cl-link" onClick={onViewAll}>{viewAllLabel}<ArrowRight size={18} strokeWidth={1.75} aria-hidden /></button>
      </div>
    </div>
  );
}
