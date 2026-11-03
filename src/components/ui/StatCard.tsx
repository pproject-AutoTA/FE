import type { ReactNode } from "react";

export type StatTone = "blue" | "green" | "purple" | "orange";
export interface StatCardProps { icon: ReactNode; label: string; value: ReactNode; sub?: string; tone?: StatTone }
export function StatCard({ icon, label, value, sub, tone = "blue" }: StatCardProps) {
  return (
    <div className="cl-card cl-stat">
      <div className={`cl-stat-icon cl-stat-icon--${tone}`}>{icon}</div>
      <div>
        <small>{label}</small>
        <div className="cl-stat-line">
          <strong>{value}</strong>
          {sub && <span className="cl-stat-sub">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
