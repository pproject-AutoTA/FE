import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center text-fg-tertiary">
      {icon ?? <Inbox size={40} strokeWidth={1.75} aria-hidden />}
      <h3 className="m-0 text-lg leading-[26px] font-bold text-fg">{title}</h3>
      {description && <p className="m-0 text-[15px] leading-6 text-fg-secondary">{description}</p>}
      {action}
    </div>
  );
}
