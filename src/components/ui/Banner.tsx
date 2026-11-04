import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

/* ============ Banner ============ */
export interface BannerProps {
  type?: "info" | "warning";
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const TYPE = {
  info: "bg-info-bg text-info-text [&>svg]:text-info-fg",
  warning: "bg-flag-bg text-flag-text [&>svg]:text-flag-fg",
} as const;

export function Banner({ type = "info", title, icon, children }: BannerProps) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-[14px] px-[22px] py-[18px] text-[15px] leading-[22px] [&>svg]:flex-none ${TYPE[type]}`}
      role={type === "warning" ? "alert" : "status"}
    >
      {icon ?? <ShieldCheck size={22} strokeWidth={1.75} aria-hidden />}
      <div>{title && <strong className="block font-bold">{title}</strong>}{children}</div>
    </div>
  );
}
