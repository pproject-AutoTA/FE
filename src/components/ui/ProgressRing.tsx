/* ============ ProgressRing ============ */
export function ProgressRing({ percent }: { percent: number | null }) {
  const size = 56, stroke = 4, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const p = percent ?? 0;
  return (
    <svg width={size} height={size} role="img" aria-label={percent === null ? "진행률 없음" : `진행률 ${p}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-blue-50" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-blue-600" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" className="fill-blue-600">
        {percent === null ? "-" : `${p}%`}
      </text>
    </svg>
  );
}
