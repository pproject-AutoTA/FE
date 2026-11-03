import type { ReactNode } from "react";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="cl-pageheader">
      <div>
        {eyebrow && <div className="cl-eyebrow">{eyebrow}</div>}
        <h1 className="cl-title">{title}</h1>
        {description && <div className="cl-desc">{description}</div>}
      </div>
      {actions && <div className="cl-actions">{actions}</div>}
    </div>
  );
}
