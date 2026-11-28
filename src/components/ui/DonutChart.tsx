export interface DonutChartProps {
  label: string;
  total: string;
  segments: readonly { label: string; percent: number; color: string }[];
}

export function DonutChart({ label, total, segments }: DonutChartProps) {
  let offset = 0;
  const arcs = segments.map((segment) => {
    const start = offset;
    offset += segment.percent;
    return { ...segment, start };
  });

  return (
    <figure aria-label={label} className="m-0 flex flex-wrap items-center gap-6">
      <svg
        viewBox="0 0 168 168"
        className="size-[168px] flex-none"
        role="img"
        aria-label={`전체 ${total}`}
      >
        <circle
          cx="84"
          cy="84"
          r="69"
          fill="none"
          stroke="var(--color-neutral-bg)"
          strokeWidth="30"
        />
        {arcs.map((segment) => (
          <circle
            key={segment.label}
            cx="84"
            cy="84"
            r="69"
            pathLength="100"
            fill="none"
            stroke={segment.color}
            strokeWidth="30"
            strokeDasharray={`${segment.percent} 100`}
            strokeDashoffset={-segment.start}
            transform="rotate(-90 84 84)"
          />
        ))}
        <text x="84" y="84" textAnchor="middle" className="fill-fg text-[22px] font-bold">
          {total}
        </text>
        <text x="84" y="104" textAnchor="middle" className="fill-fg-secondary text-[13px]">
          전체
        </text>
      </svg>
      <ul className="m-0 grid min-w-[140px] flex-1 grid-cols-2 gap-x-4 gap-y-3 p-0 text-[13px]">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <svg width="9" height="9" aria-hidden="true">
              <circle cx="4.5" cy="4.5" r="4.5" fill={segment.color} />
            </svg>
            <span>{segment.label}</span>
            <strong className="ml-auto">{segment.percent}%</strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}
