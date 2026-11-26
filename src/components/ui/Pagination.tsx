import { ChevronLeft, ChevronRight } from "lucide-react";

/* ============ Pagination (목록 아래 페이지 이동) ============ */
export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** 왼쪽에 보여줄 요약 문구 (예: "총 7개 중 1–3") */
  summary?: string;
}

const btn =
  "box-border grid size-10 cursor-pointer place-items-center rounded-lg border text-sm leading-none font-bold transition-colors focus-visible:shadow-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";
const idle = "border-border bg-surface text-fg-body hover:bg-[#F7F9FC]";
const current = "border-transparent bg-blue-600 text-white";

export function Pagination({
  page,
  pageCount,
  onChange,
  summary,
}: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav
      aria-label="페이지 이동"
      className="box-border flex items-center justify-between border-t border-border px-[30px] py-4"
    >
      <span className="text-sm leading-5 text-fg-secondary">{summary}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={`${btn} ${idle}`}
        >
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`${p}페이지`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={`${btn} ${p === page ? current : idle}`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className={`${btn} ${idle}`}
        >
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
