import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  IndexChip,
  PageHeader,
  Pagination,
  ScoreDisplay,
  SubmissionStatusBadge,
  Tabs,
} from "../../components";
import { wrapControl } from "../../components/ui/classes";
import { PROBLEMS, type Problem } from "./mockProblems";

type Filter = "all" | "open" | "result" | "closed";

/** 탭별로 어떤 문제를 보여줄지 */
const FILTERS: Record<Filter, (p: Problem) => boolean> = {
  all: () => true,
  open: (p) => !p.closed,
  result: (p) => p.status === "DONE" || p.status === "RUNNING",
  closed: (p) => p.closed,
};

/** 한 페이지에 보여줄 문제 수 */
const PAGE_SIZE = 6;

const pad = (n: number) => String(n).padStart(2, "0");

export function StudentProblems() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabs = [
    { value: "all", label: "전체" },
    { value: "open", label: "마감 전" },
    { value: "result", label: "결과 확인" },
    { value: "closed", label: "마감" },
  ].map((t) => ({
    ...t,
    count: PROBLEMS.filter(FILTERS[t.value as Filter]).length,
  }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROBLEMS.filter(FILTERS[filter]).filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.course.toLowerCase().includes(q),
    );
  }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · PROBLEMS"
        title="문제 목록"
        description="수강 중인 강의의 과제를 확인하고 제출하세요."
      />

      <div className="flex items-center justify-between gap-4">
        <Tabs
          active={filter}
          onChange={(v) => {
            setFilter(v as Filter);
            setPage(1);
          }}
          items={tabs}
        />
        <label className="box-border flex h-[52px] w-[313px] items-center gap-3 rounded-[14px] border border-border bg-surface px-[18px] text-fg-tertiary transition-[border-color,box-shadow] duration-100 focus-within:border-blue-600 focus-within:shadow-ring">
          <Search size={20} strokeWidth={1.75} aria-hidden />
          <input
            className={wrapControl}
            aria-label="문제 검색"
            placeholder="문제 검색"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      <Card padding="table">
        <div className="min-h-[582px]">
          <DataTable<Problem>
            rows={pageRows}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/student/submit?problem=${r.id}`)}
            empty={
              <EmptyState
                title="조건에 맞는 문제가 없어요"
                description="다른 탭을 선택하거나 검색어를 바꿔 보세요."
              />
            }
            columns={[
              {
                key: "title",
                header: "문제",
                width: "27%",
                render: (r) => (
                  <div className="flex items-center gap-4">
                    <IndexChip>{pad(r.id)}</IndexChip>
                    <strong className="text-[15px] font-bold text-fg">
                      {r.title}
                    </strong>
                  </div>
                ),
              },
              {
                key: "course",
                header: "과목",
                width: "14%",
                render: (r) => <span className="text-[15px]">{r.course}</span>,
              },
              {
                key: "due",
                header: "마감",
                width: "15%",
                render: (r) =>
                  r.closed ? (
                    <strong className="text-[15px] font-bold text-danger-fg">
                      {r.due} · 마감
                    </strong>
                  ) : (
                    <span className="text-[15px]">{r.due}</span>
                  ),
              },
              {
                key: "status",
                header: "제출 상태",
                width: "14%",
                render: (r) => <SubmissionStatusBadge status={r.status} />,
              },
              {
                key: "score",
                header: "점수",
                width: "15%",
                render: (r) => (
                  <ScoreDisplay
                    score={r.score}
                    released={r.released}
                    submitted={r.status !== "NONE"}
                  />
                ),
              },
              {
                key: "resubmit",
                header: "재제출 가능 여부",
                render: (r) =>
                  r.canResubmit ? (
                    <strong className="text-sm font-bold text-success-fg">
                      재제출 가능
                    </strong>
                  ) : (
                    <Badge tone="flag">한 번만 제출</Badge>
                  ),
              },
            ]}
          />
        </div>
        {rows.length > 0 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={setPage}
            summary={`총 ${rows.length}개 중 ${start + 1}–${start + pageRows.length}`}
          />
        )}
      </Card>
    </>
  );
}
