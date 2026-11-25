import { useState } from "react";
import { ArrowRight, ChevronRight, Clock, History } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AllowedScopeCard,
  Badge,
  Banner,
  Button,
  Card,
  CodeEditor,
  ConfirmModal,
  EmptyState,
  MetaStats,
  SampleIO,
  SubmissionStatusBadge,
  Tabs,
  useToast,
} from "../../components";
import {
  findProblem,
  getProblemDetail,
  type Problem,
  type ProblemDetail,
} from "./mockProblems";

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

/** 주소의 ?problem=번호 로 문제를 찾는다. 번호가 없으면 2번 문제 */
export function StudentSubmit() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = Number(params.get("problem") ?? 2);
  const problem = findProblem(id);

  if (!problem) {
    return (
      <EmptyState
        title="문제를 찾을 수 없어요"
        description="목록에서 문제를 다시 선택해 주세요."
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
  // key: 문제가 바뀌면 편집기·탭 상태를 새로 시작한다
  return (
    <SubmitView
      key={problem.id}
      problem={problem}
      detail={getProblemDetail(problem)}
    />
  );
}

function SubmitView({
  problem,
  detail,
}: {
  problem: Problem;
  detail: ProblemDetail;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("problem");
  const [code, setCode] = useState(detail.initialCode);
  const [saved, setSaved] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pending = problem.status === "QUEUED" || problem.status === "RUNNING";
  /** 마감 전이고, 아직 안 냈거나(NONE) 재제출이 되는 문제면 코드를 수정·제출할 수 있다 */
  const editable =
    !problem.closed && (problem.status === "NONE" || problem.canResubmit);
  /** 이미 낸 적이 있는데 다시 내는 경우 */
  const isResubmit = editable && problem.status !== "NONE";

  /** 제출 상태에 따라 맨 위에 보이는 안내 */
  const banner = (() => {
    if (problem.status === "QUEUED")
      return {
        type: "info" as const,
        title: "채점 대기 중",
        text: problem.canResubmit
          ? "제출한 코드가 채점 순서를 기다리고 있어요. 코드를 수정해 다시 제출할 수도 있어요."
          : "제출한 코드가 채점 순서를 기다리고 있어요. 곧 채점이 시작돼요.",
      };
    if (problem.status === "RUNNING")
      return {
        type: "info" as const,
        title: "채점 중",
        text: problem.canResubmit
          ? "테스트케이스를 실행하고 있어요. 코드를 수정해 다시 제출할 수도 있어요."
          : "테스트케이스를 실행하고 있어요. 채점이 끝나면 결과를 확인할 수 있어요.",
      };
    if (problem.closed)
      return {
        type: "warning" as const,
        title: "마감된 문제",
        text:
          problem.status === "NONE"
            ? "제출 기간이 끝나 더 이상 제출할 수 없어요."
            : "제출 기간이 끝났어요. 제출한 코드는 확인만 할 수 있어요.",
      };
    if (problem.status === "DONE") {
      const result = problem.released
        ? `채점 완료 · ${problem.score}점`
        : "채점 완료 · 점수 공개 전";
      return {
        type: "info" as const,
        title: result,
        text: problem.canResubmit
          ? "마감 전까지 다시 제출할 수 있으며, 마지막 제출이 성적에 반영돼요."
          : "이 문제는 한 번만 제출할 수 있어서 다시 제출할 수 없어요.",
      };
    }
    return {
      type: "info" as const,
      title: problem.canResubmit ? "재제출 가능" : "한 번만 제출",
      text: problem.canResubmit
        ? "마감 전까지 다시 제출할 수 있으며, 마지막 제출이 성적에 반영돼요."
        : "이 문제는 한 번만 제출할 수 있어요. 제출 전에 코드를 꼭 확인하세요.",
    };
  })();

  /** 제출 현황 목록: 채점 중이면 맨 위에 진행 중인 제출을 붙인다 */
  const nextNo = Math.max(0, ...detail.history.map((h) => h.no)) + 1;

  const save = () => {
    // TODO: 임시 저장 API 연결 (code 전달)
    setSaved(true);
    toast("success", "임시 저장했어요.");
  };

  const openConfirm = () => {
    if (!code.trim()) return toast("error", "코드를 입력해 주세요.");
    setConfirmOpen(true);
  };

  const submit = () => {
    // TODO: 코드 제출 API 연결 (code 전달)
    setConfirmOpen(false);
    toast("success", "코드를 제출했어요. 채점이 시작됩니다.");
    navigate("/student/results");
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
              {problem.status !== "NONE" && (
                <SubmissionStatusBadge status={problem.status} />
              )}
            </div>
            <div className="text-[15px] leading-6 text-fg-secondary">
              {problem.course} · Python
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 text-sm leading-5 text-fg-secondary">
            <Clock size={20} strokeWidth={1.75} aria-hidden />
            마감 <strong className="font-bold text-fg">{problem.due}</strong>
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
                {detail.description.split("\n\n").map((para, i) => (
                  <p key={i} className={`${body} ${i > 0 ? "mt-3" : ""}`}>
                    <Rich text={para} />
                  </p>
                ))}
              </section>

              <section>
                <h3 className={heading}>입력 형식</h3>
                <p className={`${body} ${detail.constraints ? "mb-3" : ""}`}>
                  <Rich text={detail.inputFormat} />
                </p>
                {detail.constraints && (
                  <div className="rounded-lg bg-[#F6F7FA] px-[18px] py-3.5 font-mono text-sm leading-5 text-fg-secondary">
                    {detail.constraints}
                  </div>
                )}
              </section>

              <section>
                <h3 className={heading}>출력 형식</h3>
                <p className={`${body} mb-5`}>
                  <Rich text={detail.outputFormat} />
                </p>
                <SampleIO
                  input={detail.sample.input}
                  output={detail.sample.output}
                />
              </section>

              <MetaStats items={detail.meta} />

              <AllowedScopeCard
                description={detail.scope.description}
                deniedTags={detail.scope.deniedTags}
              />
            </div>
          ) : detail.history.length === 0 && !pending ? (
            <EmptyState
              title="아직 제출한 기록이 없어요"
              description="코드를 제출하면 여기에 결과가 쌓여요."
            />
          ) : (
            <div className="pt-4">
              {pending && (
                <div className="flex items-center justify-between border-b border-border py-5">
                  <div>
                    <strong className="text-base">#{nextNo}</strong>
                    <span className="ml-3 text-[15px] text-fg-secondary">
                      {problem.status === "RUNNING"
                        ? "채점 중…"
                        : "채점 대기 중…"}
                    </span>
                  </div>
                  <SubmissionStatusBadge status={problem.status} />
                </div>
              )}
              {detail.history.map((h) => (
                <div
                  key={h.no}
                  className="flex items-center justify-between border-b border-border py-5 last:border-b-0"
                >
                  <div className={h.isFinal ? "" : "text-fg-secondary"}>
                    <strong className="text-base">#{h.no}</strong>
                    <span className="ml-3 text-[15px]">
                      {h.passed} / {h.total} 통과
                    </span>
                  </div>
                  {h.isFinal && <Badge tone="info">최종 반영</Badge>}
                </div>
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
          problem.canResubmit
            ? "마감 전까지 다시 제출할 수 있고, 마지막으로 제출한 코드가 성적에 반영돼요."
            : "이 문제는 한 번만 제출할 수 있어요. 제출한 뒤에는 수정할 수 없습니다."
        }
        confirmLabel="제출하기"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submit}
      />
    </>
  );
}
