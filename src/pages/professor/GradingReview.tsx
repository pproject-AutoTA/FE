import { ROUTES } from "../../routes";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ProfessorLayout,
  Badge,
  Banner,
  Button,
  Card,
  CodeBlock,
  ConfirmModal,
  EmptyState,
  FlagCard,
  FormField,
  ListRow,
  MetaStats,
  Modal,
  PageHeader,
  Pagination,
  ScoreBreakdown,
  IndexChip,
  useToast,
} from "../../components";
import { type ReviewItem } from "../../mocks/professor";
import { usePagination } from "./usePagination";
import { getPendingReviews, setReviewStatus, useProfessorMockState } from "./professorMockState";
import { readEditableProblem, readProfessorAssignments } from "./professorAssignments";

function formatAway(seconds: number) {
  return seconds >= 60 ? `${Math.floor(seconds / 60)}분 ${seconds % 60}초` : `${seconds}초`;
}

function formatDeparture({ leftAt, returnedAt, seconds }: ReviewItem["departures"][number]) {
  return `${leftAt} 이탈 · ${returnedAt} 복귀 · ${seconds}초`;
}

export function GradingReview() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const assignmentKey = searchParams.get("assignment");
  const courseId = searchParams.get("course");
  const fromReviewList = searchParams.get("from") === "review";
  const selectedId = Number(searchParams.get("submission"));
  const [assignments] = useState(readProfessorAssignments);
  const assignment = assignments.find((item) => item.editKey === assignmentKey);
  const assignmentListPath =
    assignment?.classId && courseId === assignment.classId
      ? `${ROUTES.professorClasses}?course=${encodeURIComponent(assignment.classId)}`
      : ROUTES.professorProblems;

  const [query, setQuery] = useState("");
  useEffect(() => setQuery(""), [assignmentKey]);
  const [adjustments, setAdjustments] = useState<Record<number, number>>({});
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const allPendingReviews = getPendingReviews(useProfessorMockState());
  const [showCode, setShowCode] = useState(false);
  const [confirmationId, setConfirmationId] = useState<number>();
  const [showReasonError, setShowReasonError] = useState(false);
  const pendingReviews = allPendingReviews.filter(
    (item) => !assignmentKey || item.assignmentKey === assignment?.editKey,
  );
  const assignmentTitles = new Map(assignments.map((item) => [item.editKey, item.title]));
  const visibleReviews = pendingReviews.filter((item) =>
    `${item.name} ${item.studentId} ${assignmentTitles.get(item.assignmentKey) ?? item.problem}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const reviewPager = usePagination(visibleReviews, 6, `${assignmentKey}${query}`, true);
  const reviewGroups = new Map<string, ReviewItem[]>();
  for (const item of reviewPager.items) {
    const group = reviewGroups.get(item.assignmentKey);
    if (group) group.push(item);
    else reviewGroups.set(item.assignmentKey, [item]);
  }
  const current = assignment
    ? (pendingReviews.find((item) => item.id === selectedId) ?? pendingReviews[0])
    : undefined;
  const reviewProblem = (() => {
    try {
      return assignment?.editKey ? readEditableProblem(assignment.editKey)?.problem : undefined;
    } catch {
      return undefined;
    }
  })();
  const adjustment = current ? (adjustments[current.id] ?? 0) : 0;
  const reason = current ? (reasons[current.id] ?? "") : "";
  const reasonError =
    (showReasonError || adjustment !== 0) && adjustment !== 0 && !reason.trim()
      ? "점수를 조정한 경우 조정 사유를 입력해주세요"
      : undefined;

  const selectSubmission = (item: ReviewItem) => {
    setShowReasonError(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("assignment", item.assignmentKey);
    nextParams.set("submission", String(item.id));
    if (!assignmentKey) nextParams.set("from", "review");
    setSearchParams(nextParams);
  };
  const resolveReview = (action: "held" | "confirmed") => {
    if (!current) return;
    if (action === "confirmed" && adjustment !== 0 && !reason.trim()) {
      setShowReasonError(true);
      toast("error", "점수를 조정한 경우 조정 사유를 입력해주세요.");
      return;
    }
    setShowReasonError(false);
    setReviewStatus(current.id, action);
    const next = pendingReviews.find((item) => item.id !== current.id);
    const nextParams = new URLSearchParams(searchParams);
    if (next) nextParams.set("submission", String(next.id));
    else nextParams.delete("submission");
    setSearchParams(nextParams, { replace: true });
    toast(
      "success",
      action === "confirmed"
        ? `${current.name} 학생의 점수를 확정했어요.`
        : `${current.name} 학생 제출을 보류했어요.`,
    );
  };
  const updateAdjustment = (value: number) => {
    if (!current) return;
    const clamped = Math.max(
      -current.score,
      Math.min(100 - current.score, Number.isFinite(value) ? value : 0),
    );
    setAdjustments((items) => ({ ...items, [current.id]: clamped }));
  };

  const backTo = fromReviewList ? ROUTES.professorReview : assignmentListPath;
  const flagLine = current
    ? current.fullCode.split("\n").findIndex((line) => line.includes(current.code.trim())) + 1
    : 0;

  return (
    <ProfessorLayout>
      <PageHeader
        responsive
        eyebrow="PROFESSOR · GRADING REVIEW"
        title="채점 검토"
        description={
          !assignmentKey
            ? "FLAG나 수동 조정이 필요한 제출만 선택적으로 검토하세요."
            : assignment
              ? undefined
              : "과제를 찾을 수 없어요."
        }
        actions={
          assignmentKey ? (
            <Button
              variant="secondary"
              icon={<ArrowLeft size={24} strokeWidth={1.75} />}
              onClick={() => navigate(backTo)}
            >
              {fromReviewList ? "전체 답안 목록으로" : "과제 목록으로"}
            </Button>
          ) : undefined
        }
      />

      {assignment && (
        <>
          <Card
            title={assignment.title}
            subtitle="문제 정보"
            action={
              assignmentKey && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const params = new URLSearchParams({ assignment: assignmentKey });
                    if (courseId && courseId === assignment.classId) params.set("course", courseId);
                    const path = params.has("course")
                      ? ROUTES.professorClasses
                      : ROUTES.professorProblems;
                    navigate(`${path}?${params}`);
                  }}
                >
                  문제 상세
                </Button>
              )
            }
          >
            <p className="m-0 mb-5 text-base leading-[26px] whitespace-pre-wrap text-fg-body [overflow-wrap:anywhere]">
              {reviewProblem?.description || "등록된 문제 설명이 없어요."}
            </p>
            {reviewProblem && (
              <MetaStats
                items={[
                  { label: "입력 형식", value: reviewProblem.inputFormat || "미설정" },
                  { label: "출력 형식", value: reviewProblem.outputFormat || "미설정" },
                  {
                    label: "시간 제한",
                    value: reviewProblem.timeLimit ? `${reviewProblem.timeLimit}초` : "미설정",
                  },
                  {
                    label: "메모리 제한",
                    value: reviewProblem.memoryLimit ? `${reviewProblem.memoryLimit} MB` : "미설정",
                  },
                ]}
              />
            )}
          </Card>
          <Banner
            type="info"
            icon={<ShieldCheck size={24} strokeWidth={1.75} />}
            title="선택 검토 작업"
          >
            이 화면에서는 조정이 필요한 제출만 처리해요. 나머지 제출은 점수 공개 시점에 자동 채점
            점수로 일괄 확정됩니다.
          </Banner>
        </>
      )}

      <div
        className={current ? "grid grid-cols-[400px_minmax(0,1fr)] items-start gap-7" : undefined}
      >
        <Card
          title={assignment ? "같은 과제의 답안" : "과제별 학생 답안"}
          subtitle="학생을 선택해 제출 답안을 확인하세요."
          action={
            <Badge tone="flag" large>
              검토 대기 {pendingReviews.length}건
            </Badge>
          }
        >
          <div className="mb-4">
            <FormField
              label="학생 또는 문제 검색"
              placeholder="이름, 학번, 과제명"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {visibleReviews.length === 0 ? (
            <EmptyState title={query.trim() ? "검색 결과가 없습니다" : "검토할 제출이 없습니다"} />
          ) : (
            <div className="grid gap-5">
              {Array.from(reviewGroups, ([key, items]) => (
                <section key={key} aria-labelledby={`review-group-${key}`}>
                  <h3
                    id={`review-group-${key}`}
                    className="m-0 mb-2 flex items-center justify-between gap-2 text-sm leading-5 font-bold text-fg-secondary"
                  >
                    {assignmentTitles.get(key) ?? items[0].problem}
                    <span className="font-medium">{items.length}건</span>
                  </h3>
                  <div className="grid gap-1">
                    {items.map((item) => (
                      <Button
                        variant="link"
                        key={item.id}
                        type="button"
                        aria-pressed={current?.id === item.id}
                        onClick={() => selectSubmission(item)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 px-4 py-3.5 text-left hover:bg-blue-25 focus-visible:outline-2 focus-visible:outline-blue-600 ${current?.id === item.id ? "bg-blue-50 shadow-[inset_4px_0_0_var(--color-blue-600)]" : "bg-surface"}`}
                      >
                        <IndexChip tone="blue">{item.name.slice(0, 1)}</IndexChip>
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-[17px] leading-6 font-bold text-fg">
                            {item.name}
                          </strong>
                          <span className="block text-sm leading-5 whitespace-nowrap text-fg-secondary">
                            {item.studentId} · 자동 {item.score}점
                          </span>
                        </span>
                        <Badge tone="flag">FLAG {item.flagCount}</Badge>
                      </Button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
          <div className="-mx-[30px] -mb-[30px] mt-5 empty:hidden">
            {reviewPager.show && (
              <Pagination
                page={reviewPager.page}
                pageCount={reviewPager.pageCount}
                onChange={reviewPager.setPage}
                summary={reviewPager.summary}
              />
            )}
          </div>
        </Card>

        {current && (
          <div className="flex min-w-0 flex-col gap-7">
            <Card
              title={`${current.name} · ${current.studentId}`}
              subtitle={`제출 #SUB-20250522-${String(current.id).padStart(4, "0")} · Python 3.12`}
              action={
                <Badge tone="info" large>
                  자동 점수 {current.score} / 100
                </Badge>
              }
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm leading-5 text-fg-secondary">
                  과제 · {assignment?.title ?? current.problem}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={24} strokeWidth={1.75} />}
                  onClick={() => setShowCode(true)}
                >
                  전체 코드 보기
                </Button>
              </div>
              <div className="max-h-[320px] overflow-auto rounded-[14px]">
                <CodeBlock code={current.fullCode} flagLines={flagLine > 0 ? [flagLine] : []} />
              </div>
            </Card>

            <div className="grid grid-cols-2 items-start gap-7">
              <FlagCard flags={[{ tag: current.tag, line: current.line, code: current.code }]} />
              <Card title="화면 이탈 기록" subtitle="참고용이며 점수에는 반영되지 않아요.">
                <MetaStats
                  items={[
                    { label: "이탈 횟수", value: `${current.departures.length}회` },
                    {
                      label: "총 이탈 시간",
                      value: formatAway(
                        current.departures.reduce(
                          (total, departure) => total + departure.seconds,
                          0,
                        ),
                      ),
                    },
                  ]}
                />
                <ul className="m-0 mt-3 grid list-none gap-2 p-0 text-sm leading-5 text-fg-body">
                  {current.departures.map((departure) => (
                    <li key={departure.leftAt}>{formatDeparture(departure)}</li>
                  ))}
                  {current.departures.length === 0 && (
                    <li className="text-fg-secondary">화면 이탈 기록이 없습니다.</li>
                  )}
                </ul>
              </Card>
            </div>

            <Card title="그룹별 점수" padding="table">
              <ListRow
                keyboardNavigation
                leading={<IndexChip tone="neutral">A</IndexChip>}
                title="그룹 A"
                subtitle={`기본 케이스 · ${current.groupATotal === current.groupA ? "3/3" : "2/3"} 통과`}
                trailing={
                  <strong>
                    {current.groupA} / {current.groupATotal}
                  </strong>
                }
              />
              <ListRow
                keyboardNavigation
                leading={<IndexChip tone="neutral">B</IndexChip>}
                title="그룹 B"
                subtitle={`대용량 입력 · ${current.groupBTotal === current.groupB ? "7/7" : "5/7"} 통과`}
                trailing={
                  <strong>
                    {current.groupB} / {current.groupBTotal}
                  </strong>
                }
              />
            </Card>

            <ScoreBreakdown
              groupScore={current.score}
              latePenalty={0}
              adjustment={adjustment}
              onAdjustmentChange={updateAdjustment}
              reason={reason}
              onReasonChange={(value) => setReasons((items) => ({ ...items, [current.id]: value }))}
              reasonError={reasonError}
            />
            <Banner type="info" icon={<Eye size={24} strokeWidth={1.75} />}>
              확정 전까지 학생에게 보이지 않아요.
            </Banner>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => resolveReview("held")}>
                보류
              </Button>
              <Button onClick={() => setConfirmationId(current.id)}>점수 확정</Button>
            </div>
          </div>
        )}
      </div>

      {current && (
        <ConfirmModal
          role="dialog"
          open={confirmationId === current.id}
          title="점수를 확정할까요?"
          description={`${current.name} 학생의 제출 점수를 확정합니다.`}
          confirmLabel="점수 확정"
          onCancel={() => setConfirmationId(undefined)}
          onConfirm={() => {
            setConfirmationId(undefined);
            resolveReview("confirmed");
          }}
        />
      )}
      {current && (
        <Modal
          open={showCode}
          size="lg"
          title="제출 코드"
          description={`${current.name} · ${assignment?.title ?? current.problem}`}
          onClose={() => setShowCode(false)}
          footer={
            <Button variant="secondary" onClick={() => setShowCode(false)}>
              닫기
            </Button>
          }
        >
          <div className="max-h-[480px] overflow-auto rounded-[14px]">
            <CodeBlock code={current.fullCode} flagLines={flagLine > 0 ? [flagLine] : []} />
          </div>
        </Modal>
      )}
    </ProfessorLayout>
  );
}
