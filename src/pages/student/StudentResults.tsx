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
  Tabs,
  VerdictBadge,
} from "../../components";
import { wrapControl } from "../../components/ui/classes";
import { SUBMISSIONS, type Submission } from "./mockSubmissions";

type Filter = "all" | "released" | "unreleased" | "grading";

/** 탭별로 어떤 제출을 보여줄지 */
const FILTERS: Record<Filter, (s: Submission) => boolean> = {
  all: () => true,
  released: (s) => s.released,
  unreleased: (s) => !s.released && s.stage !== "GRADING",
  grading: (s) => s.stage === "GRADING",
};

/** 한 페이지에 보여줄 제출 수 */
const PAGE_SIZE = 5;

const pad = (n: number) => String(n).padStart(2, "0");

/** 교수 평가 칸 */
function ReviewBadge({ s }: { s: Submission }) {
  if (s.stage === "GRADING") return <Badge tone="info">채점 중</Badge>;
  if (s.stage === "REVIEWING") return <Badge tone="flag">교수 검토 중</Badge>;
  return s.released ? (
    <Badge tone="success">평가 완료</Badge>
  ) : (
    <Badge tone="flag">평가 완료 · 공개 전</Badge>
  );
}

export function StudentResults() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const tabs = [
    { value: "all", label: "전체" },
    { value: "released", label: "점수 공개" },
    { value: "unreleased", label: "점수 공개 전" },
    { value: "grading", label: "채점 중" },
  ].map((t) => ({
    ...t,
    count: SUBMISSIONS.filter(FILTERS[t.value as Filter]).length,
  }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SUBMISSIONS.filter(FILTERS[filter]).filter(
      (s) =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q),
    );
  }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · SUBMISSIONS"
        title="제출 및 채점 결과"
        description="문제별 자동 채점 결과와 교수 평가를 확인하세요."
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
        <div className="min-h-[494px]">
          <DataTable<Submission>
            rows={pageRows}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/student/results/${r.id}`)}
            empty={
              <EmptyState
                title="조건에 맞는 제출이 없어요"
                description="다른 탭을 선택하거나 검색어를 바꿔 보세요."
              />
            }
            columns={[
              {
                key: "title",
                header: "문제",
                width: "22%",
                render: (r) => (
                  <div className="flex items-center gap-4">
                    <IndexChip>{pad(r.no)}</IndexChip>
                    <strong className="text-[15px] font-bold text-fg">
                      {r.title}
                    </strong>
                  </div>
                ),
              },
              {
                key: "course",
                header: "과목",
                width: "12%",
                render: (r) => <span className="text-[15px]">{r.course}</span>,
              },
              {
                key: "submittedAt",
                header: "제출 시각",
                width: "14%",
                render: (r) => (
                  <span className="text-[15px]">{r.submittedAt}</span>
                ),
              },
              {
                key: "verdict",
                header: "자동 판정",
                width: "10%",
                render: (r) =>
                  r.verdict ? (
                    <VerdictBadge verdict={r.verdict} />
                  ) : (
                    <span className="text-fg-tertiary">—</span>
                  ),
              },
              {
                key: "tests",
                header: "테스트 결과",
                width: "11%",
                render: (r) =>
                  r.passed === null ? (
                    <span className="text-fg-tertiary">—</span>
                  ) : (
                    <strong className="text-[15px] font-bold">
                      {r.passed} / {r.total}
                    </strong>
                  ),
              },
              {
                key: "score",
                header: "공개 점수",
                width: "14%",
                render: (r) => (
                  <ScoreDisplay score={r.score} released={r.released} />
                ),
              },
              {
                key: "review",
                header: "교수 평가",
                render: (r) => <ReviewBadge s={r} />,
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
