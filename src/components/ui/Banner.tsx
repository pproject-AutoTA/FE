import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

/* ============ Banner ============ */
export interface BannerProps {
  type?: "info" | "warning";
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}
export function Banner({ type = "info", title, icon, children }: BannerProps) {
  return (
    <div className={`cl-banner cl-banner--${type}`} role={type === "warning" ? "alert" : "status"}>
      {icon ?? <ShieldCheck size={22} strokeWidth={1.75} aria-hidden />}
      <div>{title && <strong>{title}</strong>}{children}</div>
    </div>
  );
}
