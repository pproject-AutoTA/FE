/* ============ Tabs ============ */
export interface TabsProps {
  items: { value: string; label: string; count?: number }[];
  active: string;
  onChange: (v: string) => void;
  /** pill: 선택 탭이 남색 알약 / line: 파란 밑줄 */
  variant?: "pill" | "line";
}
export function Tabs({ items, active, onChange, variant = "pill" }: TabsProps) {
  const line = variant === "line";
  return (
    <div className={`flex items-center ${line ? "gap-[30px] border-b border-border" : "gap-1.5"}`} role="tablist">
      {items.map((t) => {
        const on = active === t.value;
        const tab = line
          ? `-mb-px h-[54px] bg-transparent border-x-0 border-t-0 border-b-[3px] p-0 ${on ? "border-b-blue-600 font-bold text-blue-600" : "border-b-transparent font-medium text-fg-secondary hover:text-fg"}`
          : `h-[47px] rounded-lg border-0 px-5 ${on ? "bg-navy-900 font-bold text-white" : "bg-transparent font-medium text-fg-secondary hover:text-fg"}`;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={on}
            className={`inline-flex cursor-pointer items-center gap-2 text-base leading-none ${tab}`}
            onClick={() => onChange(t.value)}
          >
            {t.label}
            {t.count !== undefined && <span className="text-sm leading-none font-medium opacity-70">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
