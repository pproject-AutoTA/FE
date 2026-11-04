import type { ReactNode } from "react";

/* ============ Card ============ */
export interface CardProps {
  title?: string;
  subtitle?: string;
  /** 오른쪽 위 액션 (예: "전체 보기 →" 링크) */
  action?: ReactNode;
  /** 제목 왼쪽 아이콘 (예: 수업 상세 카드) */
  icon?: ReactNode;
  padding?: "default" | "table";
  highlight?: boolean;
  children: ReactNode;
}
export function Card({ title, subtitle, action, icon, padding = "default", highlight, children }: CardProps) {
  const table = padding === "table";
  const box = [
    "rounded-2xl border shadow-sm",
    highlight ? "border-info-border bg-blue-25" : "border-border bg-surface",
    table ? "overflow-hidden p-0" : "p-[30px]",
  ].join(" ");
  const head = [
    "mb-[22px] flex gap-4",
    icon ? "items-center justify-start" : "items-start justify-between",
    table ? "px-[30px] pt-[30px]" : "",
  ].join(" ");
  return (
    <section className={box}>
      {(title || action) && (
        <div className={head}>
          {icon && (
            <span className="grid size-14 flex-none place-items-center rounded-xl bg-blue-50 text-blue-600">{icon}</span>
          )}
          <div className={icon ? "flex-1" : undefined}>
            {title && <h2 className="m-0 text-[22px] leading-[30px] font-medium">{title}</h2>}
            {subtitle && <div className="mt-1.5 text-sm leading-5 text-fg-secondary">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
