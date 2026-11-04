/* ============ BarChart (큐 적재량 같은 단순 막대 차트) ============ */
export interface BarChartProps {
  title: string;
  subtitle?: string;
  legend?: string;
  /** 막대 값 */
  data: number[];
  /** 아래 눈금 라벨 (data와 같은 길이) */
  labels?: string[];
}
export function BarChart({ title, subtitle, legend, data, labels }: BarChartProps) {
  const max = Math.max(...data, 1);
  return (
    <div
      className="relative rounded-2xl border border-border bg-surface p-[30px] shadow-sm"
      role="img"
      aria-label={`${title}: ${data.join(", ")}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="m-0 text-[22px] leading-[30px] font-medium">{title}</h2>
          {subtitle && <div className="mt-1.5 text-sm leading-5 text-fg-secondary">{subtitle}</div>}
        </div>
        {legend && (
          <span className="inline-flex items-center gap-2 text-[13px] leading-[18px] text-blue-600">
            <i className="size-2 rounded-full bg-blue-600" />{legend}
          </span>
        )}
      </div>
      <div className="relative mt-7 flex h-[220px] items-end gap-[2.2%] border-y border-t-divider border-b-border before:absolute before:inset-x-0 before:top-1/2 before:border-x-0 before:border-b-0 before:border-t before:border-dashed before:border-divider before:content-['']">
        {data.map((v, i) => (
          <div key={i} className="relative min-h-[2px] flex-1 rounded-t-sm bg-blue-600" style={{ height: `${(v / max) * 100}%` }} title={String(v)} />
        ))}
      </div>
      {labels && (
        <div className="mt-2.5 flex gap-[2.2%]">
          {labels.map((l, i) => <span key={i} className="flex-1 text-center text-xs leading-4 text-fg-tertiary">{l}</span>)}
        </div>
      )}
    </div>
  );
}
