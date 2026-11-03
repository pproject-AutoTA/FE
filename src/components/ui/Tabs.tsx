/* ============ Tabs ============ */
export interface TabsProps {
  items: { value: string; label: string; count?: number }[];
  active: string;
  onChange: (v: string) => void;
  /** pill: 선택 탭이 남색 알약 / line: 파란 밑줄 */
  variant?: "pill" | "line";
}
export function Tabs({ items, active, onChange, variant = "pill" }: TabsProps) {
  return (
    <div className={`cl-tabs${variant === "line" ? " cl-tabs--line" : ""}`} role="tablist">
      {items.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={active === t.value}
          className={`cl-tab${active === t.value ? " is-active" : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {t.count !== undefined && <span className="cl-tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
