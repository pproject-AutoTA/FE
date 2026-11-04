import type { ReactNode } from "react";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {eyebrow && <div className="mb-3 text-sm leading-[18px] font-bold tracking-[.14em] text-blue-600 uppercase">{eyebrow}</div>}
        <h1 className="m-0 text-[40px] leading-[48px] font-medium tracking-[-.02em]">{title}</h1>
        {description && <div className="mt-2.5 text-lg leading-7 text-fg-secondary">{description}</div>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
