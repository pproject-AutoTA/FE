import type { ReactNode } from "react";
import { Check } from "lucide-react";

/* ============ SelectCard (로그인 역할 선택 등) ============ */
export interface SelectCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}
export function SelectCard({ icon, title, description, selected, onSelect }: SelectCardProps) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={`cl-selcard${selected ? " is-selected" : ""}`} onClick={onSelect}>
      {selected && <span className="cl-selcard-check"><Check size={16} strokeWidth={2.5} aria-hidden /></span>}
      <span className="cl-selcard-icon">{icon}</span>
      <strong>{title}</strong>
      {description && <small>{description}</small>}
    </button>
  );
}
