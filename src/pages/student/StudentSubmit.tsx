import { useState } from "react";
import { ArrowRight, ChevronRight, Clock, History } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Badge,
  Banner,
  Button,
  Card,
  CodeEditor,
  ConfirmModal,
  EmptyState,
  MetaStats,
  SampleIO,
  Skeleton,
  SubmissionStatusBadge,
  Tabs,
  useToast,
} from "../../components";
import { errorMessage } from "../../api/client";
import { getProblem, listMySubmissions } from "../../api/problems";
import { getMySubmission, submitCode } from "../../api/submissions";
import type { ProblemDetailData, SubmissionSummary } from "../../api/types";
import { useLoad } from "../../api/useLoad";
import {
  formatDateTime,
  isClosed,
  submissionLabel,
  toUiStatus,
} from "./format";

/** 문장 안에 끼워 넣는 작은 코드 표시 */
const Code = ({ children }: { children: string }) => (
  <code className="mx-0.5 rounded-md bg-blue-50 px-2 py-0.5 font-mono text-sm text-blue-600">
    {children}
  </code>
);

/** 백틱(`)으로 감싼 부분을 작은 코드 표시로 바꿔서 보여준다 */
const Rich = ({ text }: { text: string }) => (
  <>
    {text
      .split(/`([^`]+)`/)
      .map((part, i) => (i % 2 ? <Code key={i}>{part}</Code> : part))}
  </>
);

const heading = "m-0 mb-3 text-lg leading-7 font-medium";
const body = "m-0 text-[15px] leading-7 text-fg-secondary";

const TEMPLATE = "# 여기에 코드를 작성하세요\n";

/** 임시 저장은 서버 API가 없어서 이 브라우저에만 저장한다 */
const draftKey = (problemId: number) => `autota.draft.${problemId}`;
const readDraft = (problemId: number) => {
  try {
    return localStorage.getItem(draftKey(problemId));
  } catch {
    return null;
  }
};
const writeDraft = (problemId: number, code: string) => {
  try {
    localStorage.setItem(draftKey(problemId), code);
  } catch {
    /* 저장이 막힌 브라우저에서는 건너뛴다 */
  }
};
const clearDraft = (problemId: number) => {
  try {
    localStorage.removeItem(draftKey(problemId));
  } catch {
    /* noop */
  }
};

/** 주소의 ?problem=문제ID 로 문제를 불러온다 */
export function StudentSubmit() {
  const [params] = useSearchParams();
  const id = Number(params.get("problem"));
  if (!Number.isInteger(id) || id <= 0)
    return <LoadFailed description="목록에서 문제를 다시 선택해 주세요." />;
  // key: 문제가 바뀌면 편집기·탭 상태를 새로 시작한다
  return <SubmitLoader key={id} id={id} />;
}

function LoadFailed({ description }: { description: string }) {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="문제를 불러오지 못했어요"
      description={description}
      action={
        <Button
          variant="secondary"
          onClick={() => navigate("/student/problems")}
        >
          문제 목록으로
        </Button>
      }
    />
  );
}

function SubmitLoader({ id }: { id: number }) {
  const { data, error } = useLoad(async () => {
    const [problem, history] = await Promise.all([
      getProblem(id),
      listMySubmissions(id),
    ]);
    // 마지막으로 낸 코드는 제출 상세에만 들어 있어서 따로 불러온다. 못 불러와도 화면은 연다
    let lastCode: string | null = null;
    if (history[0]) {
      try {
        lastCode = (await getMySubmission(history[0].id)).code;
      } catch {
        lastCode = null;
      }
    }
    return { problem, history, lastCode };
  }, [id]);

  if (error) return <LoadFailed description={errorMessage(error)} />;
  if (!data)
    return (
      <div className="grid gap-5" aria-busy>
        <Skeleton width="40%" height={48} />
        <Skeleton height={84} />
        <Skeleton height={520} />
      </div>
    );
  return (
    <SubmitView
      problem={data.problem}
      history={data.history}
      lastCode={data.lastCode}
    />
  );
}

function SubmitView({
  problem,
  history,
  lastCode,
}: {
  problem: ProblemDetailData;
  history: SubmissionSummary[];
  lastCode: string | null;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("problem");
  const [saved, setSaved] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // history는 최신순이라 첫 항목이 가장 최근 제출이다
  const latest = history[0];
  const status = latest ? toUiStatus(latest.status) : "NONE";
  const closed = isClosed(problem.dueAt);
  const pending = status === "QUEUED" || status === "RUNNING";
  const failed = status === "FAILED";
  /**
   * 마감 전이고, 아직 안 냈거나 재제출이 되는 문제면 코드를 수정·제출할 수 있다.
   * 재제출이 막힌 문제도 직전 제출이 FAILED(채점 시스템 실패)면 다시 낼 수 있다.
   */
  const editable =
    !closed && (!latest || problem.resubmitAllowed || failed);
  /** 이미 낸 적이 있는데 다시 내는 경우 */
  const isResubmit = editable && !!latest;

  const [code, setCode] = useState(() =>
    editable ? (readDraft(problem.id) ?? lastCode ?? TEMPLATE) : (lastCode ?? "# 제출한 코드가 없어요\n"),
  );

  /** 제목 옆 상태 배지 (채점 실패는 아래 안내로 알린다) */
  const badgeStatus = status === "NONE" || status === "FAILED" ? null : status;

  /** 제출 상태에 따라 맨 위에 보이는 안내 */
  const banner = (() => {
    if (status === "QUEUED")
      return {
        type: "info" as const,
        title: "채점 대기 중",
        text: problem.resubmitAllowed
          ? "제출한 코드가 채점 순서를 기다리고 있어요. 코드를 수정해 다시 제출할 수도 있어요."
          : "제출한 코드가 채점 순서를 기다리고 있어요. 곧 채점이 시작돼요.",
      };
    if (status === "RUNNING")
      return {
        type: "info" as const,
        title: "채점 중",
        text: problem.resubmitAllowed
          ? "테스트케이스를 실행하고 있어요. 코드를 수정해 다시 제출할 수도 있어요."
          : "테스트케이스를 실행하고 있어요. 채점이 끝나면 결과를 확인할 수 있어요.",
      };
    if (closed)
      return {
        type: "warning" as const,
        title: "마감된 문제",
        text: !latest
          ? "제출 기간이 끝나 더 이상 제출할 수 없어요."
          : "제출 기간이 끝났어요. 제출한 코드는 확인만 할 수 있어요.",
      };
    if (failed)
      return {
        type: "warning" as const,
        title: "채점 실패",
        text: "채점 시스템 문제로 채점하지 못했어요. 학생 잘못이 아니니 다시 제출해 주세요. 제출 횟수에는 세지 않아요.",
      };
    if (status === "DONE")
      return {
        type: "info" as const,
        title: `채점 완료 · ${latest?.passedCount ?? 0} / ${latest?.totalCount ?? 0} 통과`,
        text: problem.resubmitAllowed
          ? "마감 전까지 다시 제출할 수 있으며, 마지막 제출이 성적에 반영돼요."
          : "이 문제는 한 번만 제출할 수 있어서 다시 제출할 수 없어요.",
      };
    return {
      type: "info" as const,
      title: problem.resubmitAllowed ? "재제출 가능" : "한 번만 제출",
      text: problem.resubmitAllowed
        ? "마감 전까지 다시 제출할 수 있으며, 마지막 제출이 성적에 반영돼요."
        : "이 문제는 한 번만 제출할 수 있어요. 제출 전에 코드를 꼭 확인하세요.",
    };
  })();

  const save = () => {
    // 임시 저장 API는 없어서 이 브라우저에만 저장한다
    writeDraft(problem.id, code);
    setSaved(true);
    toast("success", "임시 저장했어요. 이 브라우저에만 저장돼요.");
  };

  const openConfirm = () => {
    if (!code.trim()) return toast("error", "코드를 입력해 주세요.");
    setConfirmOpen(true);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await submitCode(problem.id, code);
      clearDraft(problem.id);
      setConfirmOpen(false);
      toast("success", "코드를 제출했어요. 채점이 시작됩니다.");
      // 방금 낸 제출의 결과 화면에서 채점이 끝날 때까지 자동으로 새로고침한다
      navigate(`/student/results/${res.id}`);
    } catch (err) {
      setConfirmOpen(false);
      toast("error", errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 경로 */}
      <nav
        aria-label="현재 위치"
        className="-mb-2 flex items-center gap-3.5 text-sm leading-5"
      >
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-blue-600 hover:underline"
          onClick={() => navigate("/student/problems")}
        >
          문제 목록
        </button>
        <ChevronRight
          size={16}
          strokeWidth={1.75}
          className="text-fg-tertiary"
          aria-hidden
        />
        <span className="text-fg-secondary">{problem.title}</span>
      </nav>

      {/* 제목 줄 */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <span className="grid h-[58px] w-[60px] flex-none place-items-center rounded-xl bg-navy-900 text-base font-bold text-white">
            {String(problem.id).padStart(2, "0")}
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="m-0 text-[34px] leading-[44px] font-medium tracking-[-.02em]">
                {problem.title}
              </h1>
              {badgeStatus && <SubmissionStatusBadge status={badgeStatus} />}
            </div>
            <div className="text-[15px] leading-6 text-fg-secondary">
              Python
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 text-sm leading-5 text-fg-secondary">
            <Clock size={20} strokeWidth={1.75} aria-hidden />
            마감{" "}
            <strong className="font-bold text-fg">
              {formatDateTime(problem.dueAt)}
            </strong>
          </div>
          <Button variant="secondary" onClick={save} disabled={!editable}>
            임시 저장
          </Button>
          <Button onClick={openConfirm} disabled={!editable}>
            {isResubmit ? "다시 제출" : "코드 제출"}
            <ArrowRight size={20} strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      {/* 재제출 안내 */}
      <Banner
        type={banner.type}
        title={banner.title}
        icon={<History size={26} strokeWidth={1.75} aria-hidden />}
      >
        {banner.text}
      </Banner>

      <div className="grid grid-cols-[5fr_7fr] items-start gap-[22px]">
        {/* 문제 / 제출 현황 */}
        <Card>
          <Tabs
            variant="line"
            active={tab}
            onChange={setTab}
            items={[
              { value: "problem", label: "문제" },
              { value: "history", label: "제출 현황" },
            ]}
          />

          {tab === "problem" ? (
            <div className="grid gap-7 pt-7">
              <section>
                <h3 className={heading}>문제 설명</h3>
                {problem.description.split("\n\n").map((para, i) => (
                  <p key={i} className={`${body} ${i > 0 ? "mt-3" : ""}`}>
                    <Rich text={para} />
                  </p>
                ))}
              </section>

              <section>
                <h3 className={heading}>입력 형식</h3>
                <p className={body}>
                  <Rich text={problem.inputFormat} />
                </p>
              </section>

              <section>
                <h3 className={heading}>출력 형식</h3>
                <p className={`${body} ${problem.testcases.length ? "mb-5" : ""}`}>
                  <Rich text={problem.outputFormat} />
                </p>
                <div className="grid gap-4">
                  {problem.testcases.map((t) => (
                    <SampleIO
                      key={t.no}
                      input={t.input}
                      output={t.expectedOutput}
                    />
                  ))}
                </div>
              </section>

              <MetaStats
                items={[
                  { label: "시간 제한", value: `${problem.timeLimitMs / 1000}초` },
                  { label: "메모리 제한", value: `${problem.memoryLimitMb} MB` },
                  {
                    label: "테스트케이스",
                    value: `${problem.totalTestcaseCount}개`,
                  },
                ]}
              />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              title="아직 제출한 기록이 없어요"
              description="코드를 제출하면 여기에 결과가 쌓여요."
            />
          ) : (
            <div className="pt-4">
              {history.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => navigate(`/student/results/${h.id}`)}
                  className="flex w-full cursor-pointer items-center justify-between border-0 border-b border-border bg-transparent py-5 text-left last:border-b-0 hover:bg-blue-25"
                >
                  <div className={h.isLatest ? "" : "text-fg-secondary"}>
                    {/* 가장 오래된 제출이 #1 */}
                    <strong className="text-base">#{history.length - i}</strong>
                    <span className="ml-3 text-[15px]">
                      {submissionLabel(h)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-secondary">
                      {formatDateTime(h.submittedAt)}
                    </span>
                    {h.status === "DONE" || h.status === "FAILED" ? (
                      h.isLatest && <Badge tone="info">최종 반영</Badge>
                    ) : (
                      <SubmissionStatusBadge status={toUiStatus(h.status) as "QUEUED" | "RUNNING"} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* 코드 편집기 */}
        <CodeEditor
          value={code}
          readOnly={!editable}
          onChange={(v) => {
            setCode(v);
            setSaved(false);
          }}
          footer={
            <>
              <span className="flex items-center gap-2">
                <i
                  className={`size-2 rounded-full ${!editable ? "bg-[#8A94AD]" : saved ? "bg-[#4BBB77]" : "bg-[#E7B84F]"}`}
                  aria-hidden
                />
                {!editable
                  ? "제출한 코드 · 읽기 전용"
                  : saved
                    ? "저장됨"
                    : "수정됨"}
              </span>
              <span>Spaces: 4 · UTF-8</span>
            </>
          }
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="코드를 제출할까요?"
        description={
          problem.resubmitAllowed
            ? "마감 전까지 다시 제출할 수 있고, 마지막으로 제출한 코드가 성적에 반영돼요."
            : "이 문제는 한 번만 제출할 수 있어요. 제출한 뒤에는 수정할 수 없습니다."
        }
        confirmLabel="제출하기"
        loading={submitting}
        onCancel={() => !submitting && setConfirmOpen(false)}
        onConfirm={submit}
      />
    </>
  );
}
