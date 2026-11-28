import type { ReactNode } from "react";

export type StatTone = "blue" | "green" | "purple" | "orange" | "red";
export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: StatTone;
  wrapValue?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

const TONE: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-success-bg text-success-fg",
  purple: "bg-purple-bg text-purple-fg",
  orange: "bg-flag-bg text-flag-fg",
  red: "bg-danger-bg text-danger-fg",
};

export function StatCard({
  icon,
  label,
  value,
  sub,
  tone = "blue",
  onClick,
  wrapValue,
  "aria-label": accessibleLabel,
}: StatCardProps) {
  const className =
    "flex items-center gap-[22px] rounded-2xl border border-border bg-surface px-[30px] py-[30px] shadow-sm";
  const content = (
    <>
      <div className={`grid size-16 flex-none place-items-center rounded-[18px] ${TONE[tone]}`}>
        {icon}
      </div>
      <div>
        <small className="block text-[15px] leading-5 text-fg-secondary">{label}</small>
        <div className={`flex items-baseline gap-2.5 ${wrapValue ? "flex-wrap gap-y-0" : ""}`}>
          <strong className="text-[38px] leading-[46px] font-bold">{value}</strong>
          {sub && (
            <span className="text-[13px] leading-5 whitespace-nowrap text-fg-secondary">{sub}</span>
          )}
        </div>
      </div>
    </>
  );
  return onClick ? (
    <button
      type="button"
      className={`${className} cursor-pointer text-left hover:border-border-strong focus-visible:shadow-ring focus-visible:outline-none`}
      aria-label={accessibleLabel}
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
