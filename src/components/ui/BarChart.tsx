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
    <div className="cl-card cl-bars" role="img" aria-label={`${title}: ${data.join(", ")}`}>
      <div className="cl-bars-head">
        <div>
          <h2 className="cl-card-title">{title}</h2>
          {subtitle && <div className="cl-card-sub">{subtitle}</div>}
        </div>
        {legend && <span className="cl-bars-legend"><i />{legend}</span>}
      </div>
      <div className="cl-bars-plot">
        {data.map((v, i) => <div key={i} className="cl-bar" style={{ height: `${(v / max) * 100}%` }} title={String(v)} />)}
      </div>
      {labels && <div className="cl-bars-x">{labels.map((l, i) => <span key={i}>{l}</span>)}</div>}
    </div>
  );
}
