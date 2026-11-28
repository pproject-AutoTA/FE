import { useEffect, useState } from "react";
import { Code2, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Skeleton,
  VerdictBadge,
} from "../../components";
import { ApiError, errorMessage } from "../../api/client";
import { getProblem, listMySubmissions } from "../../api/problems";
import { getMySubmission } from "../../api/submissions";
import type {
  ApiVerdict,
  ProblemDetailData,
  SubmissionApiStatus,
  SubmissionDetailData,
  SubmissionSummary,
  TestcaseResult,
} from "../../api/types";
import { useLoad } from "../../api/useLoad";
import { formatDateTime, isClosed, parseKst } from "./format";

/** 채점이 끝날 때까지 서버에 다시 물어보는 간격 (RES-02: 2초) */
const POLL_MS = 2000;
/** 연결이 끊겼을 때 다시 시도하는 간격 */
const RETRY_MS = 4000;

const inProgress = (s: SubmissionApiStatus) =>
  s === "PENDING" || s === "RUNNING";

/** 자동 판정 큰 원의 색 */
const CIRCLE: Record<ApiVerdict, string> = {
  AC: "bg-success-bg text-success-fg",
  WA: "bg-danger-bg text-danger-fg",
  TLE: "bg-amber-bg text-amber-fg",
  MLE: "bg-amber-bg text-amber-fg",
  RE: "bg-neutral-bg text-neutral-fg",
  SKIPPED: "bg-neutral-bg text-neutral-fg",
};

const label = "text-sm leading-5 text-fg-secondary";

/**
 * 제출 상세를 불러오고, PENDING·RUNNING이면 2초마다 다시 불러온다.
 * DONE·FAILED가 되면 멈추고, 화면을 벗어나도 멈춘다.
 * 이미 받은 데이터가 있으면 연결이 끊겨도 화면을 유지하고 조용히 다시 시도한다.
 */
function useSubmissionPolling(id: number) {
  const [state, setState] = useState<{
    data: SubmissionDetailData | null;
    error: unknown;
    reconnecting: boolean;
  }>({ data: null, error: null, reconnecting: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    let hasData = false;
    let timer: number | undefined;
    setState((s) => ({ ...s, error: null }));

    const tick = async () => {
      try {
        const data = await getMySubmission(id);
        if (!alive) return;
        hasData = true;
        setState({ data, error: null, reconnecting: false });
        if (inProgress(data.status)) timer = window.setTimeout(tick, POLL_MS);
      } catch (error) {
        if (!alive) return;
        if (hasData) {
          setState((s) => ({ ...s, reconnecting: true }));
          timer = window.setTimeout(tick, RETRY_MS);
        } else {
          setState({ data: null, error, reconnecting: false });
        }
      }
    };
    tick();

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}

/** 주소의 /student/results/:submissionId 로 제출 결과를 불러온다 */
export function StudentResultDetail() {
  const { submissionId } = useParams();
  const id = Number(submissionId);
  if (!Number.isInteger(id) || id <= 0)
    return <LoadFailed description="목록에서 제출을 다시 선택해 주세요." />;
  // key: 다른 제출로 바뀌면 조회와 화면 상태를 새로 시작한다
  return <ResultLoader key={id} id={id} />;
}

function LoadFailed({
  description,
  onRetry,
}: {
  description: string;
  onRetry?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="제출 결과를 불러오지 못했어요"
      description={description}
      action={
        <div className="flex items-center gap-3">
          {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
          <Button
            variant="secondary"
            onClick={() => navigate("/student/results")}
          >
            목록으로 돌아가기
          </Button>
        </div>
      }
    />
  );
}

function ResultLoader({ id }: { id: number }) {
  const { data, error, reconnecting, retry } = useSubmissionPolling(id);

  if (error) {
    // 서버 오류·연결 문제는 다시 시도할 수 있고, 없는 제출·남의 제출은 목록으로만 보낸다
    const retryable =
      error instanceof ApiError &&
      (error.code === "NETWORK" || error.status >= 500);
    return (
      <LoadFailed
        description={errorMessage(error)}
        onRetry={retryable ? retry : undefined}
      />
    );
  }
  if (!data)
    return (
      <div className="grid gap-5" aria-busy>
        <Skeleton width="40%" height={48} />
        <Skeleton height={140} />
        <Skeleton height={360} />
      </div>
    );
  return <ResultView detail={data} reconnecting={reconnecting} />;
}

function ResultView({
  detail,
  reconnecting,
}: {
  detail: SubmissionDetailData;
  reconnecting: boolean;
}) {
  const navigate = useNavigate();

  // 문제 제목·마감·재제출 정보와 제출 이력. 채점 상태가 바뀔 때 이력도 다시 불러온다.
  // 못 불러와도 채점 결과는 그대로 보여 준다.
  const { data: extra, error: extraError } = useLoad(
    () =>
      Promise.all([getProblem(detail.problemId), listMySubmissions(detail.problemId)]),
    [detail.problemId, detail.status],
  );
  const problem: ProblemDetailData | null = extra?.[0] ?? null;
  const history: SubmissionSummary[] | null = extra?.[1] ?? null;

  const failed = detail.status === "FAILED";
  const inProgressNow = inProgress(detail.status);
  /** 제출한 지 1분이 넘었는데 아직 채점 중이면 지연 안내만 보여 준다 (실패로 바꾸지 않는다) */
  const waitedLong =
    Date.now() - parseKst(detail.submittedAt).getTime() > 60_000;
  const latestFailed = history?.[0]?.status === "FAILED";
  const canResubmit =
    !!problem &&
    !isClosed(problem.dueAt) &&
    (problem.resubmitAllowed || latestFailed);

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · SUBMISSION DETAIL"
        title="채점 결과 상세"
        description="자동 채점 결과를 확인하세요."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate("/student/results")}
          >
            목록으로 돌아가기
          </Button>
        }
      />

      {reconnecting && (
        <p role="status" className="m-0 text-sm leading-5 text-fg-secondary">
          연결이 불안정해요. 잠시 후 다시 시도하는 중이에요…
        </p>
      )}

      {inProgressNow && waitedLong && (
        <p role="status" className="m-0 text-sm leading-5 text-fg-secondary">
          채점이 평소보다 오래 걸리고 있어요. 계속 확인하는 중이니 이 화면을 열어 두거나 나중에 다시 확인해 주세요.
        </p>
      )}

      {failed && (
        <div
          role="alert"
          className="rounded-2xl border border-flag-border bg-flag-bg px-6 py-4 text-sm leading-6 text-flag-text"
        >
          <strong>채점에 실패했어요.</strong>{" "}
          {canResubmit
            ? "채점 시스템 문제라서 제출 횟수에 포함되지 않아요. 다시 제출해 주세요."
            : "채점 시스템 문제로 결과를 만들지 못했어요."}
        </div>
      )}

      <Summary detail={detail} title={problem?.title ?? null} />

      <div className="grid grid-cols-[2fr_1fr] items-start gap-7">
        <Testcases detail={detail} />

        <div className="grid gap-7">
          <FlagBox detail={detail} />
          <GradingInfo detail={detail} />
          <HistoryCard
            currentId={detail.id}
            history={history}
            failed={!!extraError}
            onOpen={(id) => navigate(`/student/results/${id}`)}
          />

          {canResubmit && (
            <div className="[&>button]:w-full">
              <Button
                onClick={() =>
                  navigate(`/student/submit?problem=${detail.problemId}`)
                }
              >
                <Code2 size={20} strokeWidth={1.75} />
                {failed ? "다시 제출" : "수정해서 다시 제출"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** 통과한 케이스 수. 마감 전에는 비공개 케이스를 개수로만 받는다 */
function countPassed(d: SubmissionDetailData) {
  return {
    passed:
      d.testcases.filter((c) => c.verdict === "AC").length +
      (d.hiddenPassed ?? 0),
    total: d.testcases.length + (d.hiddenTotal ?? 0),
  };
}

const STATUS_BADGE: Record<
  SubmissionApiStatus,
  { tone: "info" | "success" | "danger"; text: string }
> = {
  PENDING: { tone: "info", text: "채점 대기 중" },
  RUNNING: { tone: "info", text: "채점 중" },
  DONE: { tone: "success", text: "채점 완료" },
  FAILED: { tone: "danger", text: "채점 실패" },
};

/** 맨 위 요약: 자동 판정 · 문제 · 테스트 결과 */
function Summary({
  detail,
  title,
}: {
  detail: SubmissionDetailData;
  title: string | null;
}) {
  const badge = STATUS_BADGE[detail.status];
  const circle = detail.verdict
    ? CIRCLE[detail.verdict]
    : detail.status === "FAILED"
      ? "bg-flag-bg text-flag-fg"
      : "bg-info-bg text-info-fg";
  const done = detail.status === "DONE";
  const { passed, total } = countPassed(detail);

  return (
    <section className="flex items-center justify-between gap-6 rounded-2xl border border-border bg-surface px-[30px] py-[30px] shadow-sm">
      <div className="flex items-center gap-6">
        <span
          className={`grid size-[84px] flex-none place-items-center rounded-full text-2xl font-medium ${circle}`}
        >
          {detail.verdict ?? (detail.status === "FAILED" ? "!" : "…")}
        </span>
        <div>
          <Badge tone={badge.tone}>{badge.text}</Badge>
          <h2 className="m-0 mt-2 text-[30px] leading-10 font-medium">
            {title ?? `문제 #${detail.problemId}`}
          </h2>
          <div className="mt-1 text-sm leading-5 text-fg-secondary">
            제출 #{detail.id} · {formatDateTime(detail.submittedAt)}
          </div>
        </div>
      </div>

      <div className="self-center text-right">
        <div className={label}>테스트 결과</div>
        <div className="mt-2 text-[28px] leading-9 font-bold">
          {done ? `${passed} / ${total} 통과` : "—"}
        </div>
      </div>
    </section>
  );
}

/** 테스트케이스 결과: 공개 케이스 / 비공개 케이스 */
function Testcases({ detail }: { detail: SubmissionDetailData }) {
  const [open, setOpen] = useState<number | null>(null);
  const done = detail.status === "DONE";
  const publicCases = detail.testcases.filter((c) => c.isPublic);
  const hiddenCases = detail.testcases.filter((c) => !c.isPublic);
  const { passed, total } = countPassed(detail);
  const hasHiddenCount = detail.hiddenTotal !== null;

  return (
    <Card
      title="테스트케이스 결과"
      subtitle="공개 케이스는 입출력을 볼 수 있고, 비공개 케이스는 마감 후에 입출력까지 볼 수 있어요."
      action={
        done && (
          <span className="inline-flex h-8 items-center rounded-full bg-info-bg px-3.5 text-sm font-bold text-info-fg">
            {passed} / {total} 통과
          </span>
        )
      }
    >
      {!done ? (
        <EmptyState
          title={
            detail.status === "FAILED"
              ? "채점 결과가 없어요"
              : detail.status === "RUNNING"
                ? "채점 중이에요"
                : "채점 순서를 기다리고 있어요"
          }
          description={
            detail.status === "FAILED"
              ? "채점 시스템 문제로 케이스별 결과를 만들지 못했어요."
              : "채점이 끝나면 케이스별 결과가 자동으로 보여요."
          }
        />
      ) : (
        <div className="grid gap-5">
          {publicCases.length > 0 && (
            <CaseGroup
              name="공개 케이스"
              cases={publicCases}
              open={open}
              onToggle={(no) => setOpen(open === no ? null : no)}
            />
          )}

          {hiddenCases.length > 0 && (
            <CaseGroup
              name="비공개 케이스"
              cases={hiddenCases}
              open={open}
              // 마감 후에는 서버가 비공개 케이스의 입출력도 내려 준다 (마감 전에는 개수만)
              reveal={!hasHiddenCount}
              onToggle={(no) => setOpen(open === no ? null : no)}
            />
          )}

          {/* 마감 전에는 비공개 케이스를 개수로만 알려 준다 */}
          {hasHiddenCount && (
            <div className="flex items-center justify-between rounded-2xl border border-border bg-th-bg px-[18px] py-3.5">
              <div className="flex items-center gap-2.5">
                <strong className="text-sm">비공개 케이스</strong>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-fg-secondary">
                  {detail.hiddenTotal}건
                </span>
              </div>
              <div className="text-right">
                <strong className="text-xs text-blue-600">
                  {detail.hiddenPassed ?? 0} / {detail.hiddenTotal} 통과
                </strong>
                <div className="text-xs leading-5 text-fg-secondary">
                  마감 후에 케이스별 결과가 공개돼요.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function CaseGroup({
  name,
  cases,
  open,
  reveal = false,
  onToggle,
}: {
  name: string;
  cases: TestcaseResult[];
  open: number | null;
  /** true면 비공개 케이스도 입출력을 펼쳐 볼 수 있다 (마감 후) */
  reveal?: boolean;
  onToggle: (no: number) => void;
}) {
  const passed = cases.filter((c) => c.verdict === "AC").length;
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between bg-th-bg px-[18px] py-3.5">
        <div className="flex items-center gap-2.5">
          <strong className="text-sm">{name}</strong>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-fg-secondary">
            {cases.length}건
          </span>
        </div>
        <strong className="text-xs text-blue-600">
          {passed} / {cases.length} 통과
        </strong>
      </div>
      {cases.map((c) => (
        <div key={c.no} className="border-t border-border">
          <div className="flex items-center gap-5 px-[18px] py-3">
            <span className="w-8 text-xs text-fg-secondary">#{c.no}</span>
            <VerdictBadge verdict={c.verdict} />
            <span className="text-xs text-fg-secondary">{c.timeMs == null ? "-" : `${c.timeMs} ms`}</span>
            <span className="ml-auto">
              {c.isPublic || reveal ? (
                <button
                  type="button"
                  aria-expanded={open === c.no}
                  onClick={() => onToggle(c.no)}
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-medium text-fg-body hover:bg-blue-25"
                >
                  {open === c.no ? (
                    <EyeOff size={16} strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Eye size={16} strokeWidth={1.75} aria-hidden />
                  )}
                  {open === c.no ? "입출력 닫기" : "입출력 보기"}
                </button>
              ) : (
                <span className="pr-8 text-xs text-fg-tertiary">비공개</span>
              )}
            </span>
          </div>
          {/* 비공개 케이스는 서버가 입출력을 내려 준 마감 후에만 그린다 */}
          {(c.isPublic || reveal) && open === c.no && (
            <div className="grid grid-cols-3 gap-3 px-[18px] pb-4">
              {[
                ["입력", c.input],
                ["기대 출력", c.expectedOutput],
                ["실제 출력", c.actualOutput],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="mb-1.5 text-xs font-bold">{k}</div>
                  <pre className="m-0 rounded-lg bg-[#F6F7FA] px-4 py-3 font-mono text-sm leading-6 break-all whitespace-pre-wrap">
                    {v}
                  </pre>
                  {k === "실제 출력" && (v?.length ?? 0) >= 1000 && (
                    <p className="m-0 mt-1 text-xs text-fg-secondary">
                      실제 출력은 앞부분 1KB까지만 보여요.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** 허용 요소 검사. 서버는 여부(flagged)만 알려 주고, 자세한 내용은 교수만 볼 수 있다 */
function FlagBox({ detail }: { detail: SubmissionDetailData }) {
  const done = detail.status === "DONE";
  const flagged = detail.flagged;
  return (
    <section
      className={`rounded-2xl border bg-surface p-[30px] shadow-sm ${flagged ? "border-flag-border" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[22px] leading-[30px] font-medium">
            허용 요소 검사
          </h2>
          <div className="mt-1.5 text-sm leading-5 text-fg-secondary">
            {flagged
              ? "허용 범위를 벗어난 요소가 있어요. 점수에는 자동 반영되지 않고, 자세한 내용은 교수만 볼 수 있어요."
              : done
                ? "허용 범위를 벗어난 코드가 없어요."
                : "채점이 끝나면 검사 결과가 보여요."}
          </div>
        </div>
        {flagged ? (
          <VerdictBadge verdict="FLAG" />
        ) : (
          done && <Badge tone="success">위반 없음</Badge>
        )}
      </div>
    </section>
  );
}

function GradingInfo({ detail }: { detail: SubmissionDetailData }) {
  const done = detail.status === "DONE";
  const rows: [string, string][] = [
    [
      "실행 시간",
      done && detail.executionTimeMs !== null
        ? `${detail.executionTimeMs} ms`
        : "—",
    ],
    [
      "메모리",
      done && detail.memoryKb !== null
        ? `${(detail.memoryKb / 1024).toFixed(1)} MB`
        : "—",
    ],
    ["언어", "Python"],
    ["코드 길이", `${new TextEncoder().encode(detail.code).length} B`],
  ];
  return (
    <Card title="채점 정보">
      <dl className="m-0">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between border-b border-border py-3.5 first:pt-0 last:border-b-0 last:pb-0"
          >
            <dt className={label}>{k}</dt>
            <dd className="m-0 text-sm leading-5 font-bold">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/** 같은 문제의 제출 이력(최신순). 누르면 그 제출의 결과로 이동한다 */
function HistoryCard({
  currentId,
  history,
  failed,
  onOpen,
}: {
  currentId: number;
  history: SubmissionSummary[] | null;
  failed: boolean;
  onOpen: (id: number) => void;
}) {
  return (
    <Card title="제출 이력" subtitle="마지막 제출이 성적에 반영됩니다.">
      {history === null ? (
        <p className="m-0 text-sm leading-5 text-fg-secondary">
          {failed
            ? "제출 이력을 불러오지 못했어요."
            : "제출 이력을 불러오는 중이에요."}
        </p>
      ) : history.length === 0 ? (
        <p className="m-0 text-sm leading-5 text-fg-secondary">
          제출 이력이 없어요.
        </p>
      ) : (
        history.map((h, i) => (
          <button
            key={h.id}
            type="button"
            aria-current={h.id === currentId ? "true" : undefined}
            onClick={() => h.id !== currentId && onOpen(h.id)}
            className={`flex w-full items-center justify-between gap-3 border-0 border-b border-border bg-transparent py-4 text-left last:border-b-0 last:pb-0 ${h.id === currentId ? "cursor-default" : "cursor-pointer hover:bg-blue-25"}`}
          >
            <div>
              <strong className="text-sm">
                #{history.length - i}
                {h.id === currentId && (
                  <span className="ml-2 text-xs font-normal text-fg-secondary">
                    보고 있는 제출
                  </span>
                )}
              </strong>
              <div className="text-xs leading-5 text-fg-secondary">
                {formatDateTime(h.submittedAt)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {h.isLatest ? (
                <Badge tone="info">최종 반영</Badge>
              ) : (
                <span className="text-xs text-fg-secondary">이전 제출</span>
              )}
              <strong className="w-12 text-right text-sm">
                {h.verdict ??
                  (h.status === "FAILED"
                    ? "실패"
                    : h.status === "RUNNING"
                      ? "채점 중"
                      : "대기")}
              </strong>
            </div>
          </button>
        ))
      )}
    </Card>
  );
}
