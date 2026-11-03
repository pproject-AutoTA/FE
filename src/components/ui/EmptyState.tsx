import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="cl-empty">
      {icon ?? <Inbox size={40} strokeWidth={1.75} aria-hidden />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
