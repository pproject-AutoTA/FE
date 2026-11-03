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
  const cls = ["cl-card", padding === "table" && "cl-card--table", highlight && "cl-card--highlight"].filter(Boolean).join(" ");
  return (
    <section className={cls}>
      {(title || action) && (
        <div className={`cl-card-head${icon ? " cl-card-head--icon" : ""}`}>
          {icon && <span className="cl-card-icon">{icon}</span>}
          <div>
            {title && <h2 className="cl-card-title">{title}</h2>}
            {subtitle && <div className="cl-card-sub">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
