import type { ReactNode } from "react";

export type StatTone = "blue" | "green" | "purple" | "orange";
export interface StatCardProps { icon: ReactNode; label: string; value: ReactNode; sub?: string; tone?: StatTone }

const TONE: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-success-bg text-success-fg",
  purple: "bg-purple-bg text-purple-fg",
  orange: "bg-flag-bg text-flag-fg",
};

export function StatCard({ icon, label, value, sub, tone = "blue" }: StatCardProps) {
  return (
    <div className="flex items-center gap-[22px] rounded-2xl border border-border bg-surface px-[34px] py-[30px] shadow-sm">
      <div className={`grid size-16 flex-none place-items-center rounded-[18px] ${TONE[tone]}`}>{icon}</div>
      <div>
        <small className="block text-[15px] leading-5 text-fg-secondary">{label}</small>
        <div className="flex items-baseline gap-2.5">
          <strong className="text-[38px] leading-[46px] font-bold">{value}</strong>
          {sub && <span className="text-sm leading-5 text-fg-secondary">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
