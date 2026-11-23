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

const row = "flex items-center gap-5 border-b border-border bg-surface px-[30px] py-[22px] last:border-b-0";

export function ListRow({ leading, title, subtitle, trailing, onClick }: ListRowProps) {
  const body = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <strong className="block text-[17px] leading-6 font-bold text-fg">{title}</strong>
        {subtitle && <span className="block text-sm leading-5 text-fg-secondary">{subtitle}</span>}
      </div>
      {(trailing || onClick) && (
        <div className="flex items-center gap-6">
          {trailing}
          {onClick && <ChevronRight size={22} strokeWidth={1.75} aria-hidden />}
        </div>
      )}
    </>
  );
  return onClick ? (
    <div className={`${row} cursor-pointer hover:bg-[#F9FBFF]`} role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === "Enter" && onClick()}>{body}</div>
  ) : (
    <div className={row}>{body}</div>
  );
}
