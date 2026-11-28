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
    <button
      type="button" role="radio" aria-checked={selected} onClick={onSelect}
      className={`relative flex w-full cursor-pointer flex-col items-center gap-2 rounded-[18px] border-[1.5px] px-5 pt-[30px] pb-[26px] text-center font-sans ${
        selected ? "border-blue-600 bg-blue-50" : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      {selected && (
        <span className="absolute top-3.5 right-3.5 grid size-7 place-items-center rounded-full bg-blue-600 text-white">
          <Check size={16} strokeWidth={2.5} aria-hidden />
        </span>
      )}
      <span className={`mb-1.5 grid size-14 place-items-center rounded-xl ${selected ? "bg-white text-blue-600" : "bg-neutral-bg text-fg-secondary"}`}>{icon}</span>
      <strong className="text-lg leading-6 font-bold text-fg">{title}</strong>
      {description && <small className="text-[13px] leading-[18px] text-fg-secondary">{description}</small>}
    </button>
  );
}
