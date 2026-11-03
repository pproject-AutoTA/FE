import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/* ============ ListRow (진행 중 과제, 최근 제출 같은 카드 안 목록) ============ */
export interface ListRowProps {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}
export function ListRow({ leading, title, subtitle, trailing, onClick }: ListRowProps) {
  const body = (
    <>
      {leading}
      <div className="cl-listrow-main">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {(trailing || onClick) && (
        <div className="cl-listrow-trail">
          {trailing}
          {onClick && <ChevronRight size={22} strokeWidth={1.75} aria-hidden />}
        </div>
      )}
    </>
  );
  return onClick ? (
    <div className="cl-listrow is-click" role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === "Enter" && onClick()}>{body}</div>
  ) : (
    <div className="cl-listrow">{body}</div>
  );
}
