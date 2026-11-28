import { ASSIGNMENT_STATUS_LABEL } from "./professorAssignments";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { Badge, Button, Card, EmptyState, ErrorMessage, PageHeader, Select } from "../../components";
import { DEMO_COURSE_ASSIGNMENTS } from "../../mocks/professor";
import { readEditableProblem, type AssignmentView } from "./professorAssignments";
import { ClassAssignmentSubmissions } from "./ClassAssignmentSubmissions";
import {
  fetchProfessorProblemDetails,
  type ProfessorProblemDetails,
} from "./professorProblemDetailsApi";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value?: string) {
  const time = Date.parse(value ?? "");
  return Number.isFinite(time) ? dateFormatter.format(time) : "미설정";
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm leading-5 text-fg-secondary">{label}</dt>
      <dd className="m-0 mt-1 text-base leading-6 font-bold text-fg">{value}</dd>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-bg p-5">
      <dt className="text-sm leading-5 font-bold text-fg-secondary">{label}</dt>
      <dd className="m-0 mt-1.5 text-base leading-[26px] whitespace-pre-wrap text-fg-body [overflow-wrap:anywhere]">
        {value || "미입력"}
      </dd>
    </div>
  );
}

export function ClassAssignmentDetails({
  assignment,
  listPath,
  problems,
  initialProblemId,
  problemRegistrationPath,
  reviewPath,
}: {
  assignment?: AssignmentView;
  listPath: string;
  problems?: { id: number; title: string }[];
  initialProblemId?: number;
  problemRegistrationPath?: string;
  reviewPath?: string;
}) {
  const navigate = useNavigate();
  let local;
  try {
    local = assignment?.editKey ? readEditableProblem(assignment.editKey) : undefined;
  } catch {
    local = undefined;
  }

  const sample = local?.problem.sampleId;
  const demoProblems =
    sample === undefined
      ? []
      : [...DEMO_COURSE_ASSIGNMENTS.values()]
          .flatMap((response) => response.data)
          .find((item) => item.id === sample)?.problems ?? [];
  const options = problems ?? demoProblems;
  const [selectedProblemId, setSelectedProblemId] = useState(initialProblemId);
  const selectedProblem = options.find((item) => item.id === selectedProblemId) ?? options[0];
  const canFetchDetails = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_BASE_URL?.trim());
  const problemId =
    canFetchDetails && (local?.index === undefined || selectedProblem?.id !== options[0]?.id)
      ? selectedProblem?.id
      : undefined;
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<{
    problemId: number;
    attempt: number;
    result: { data: ProfessorProblemDetails } | { error: string };
  }>();

  useEffect(() => {
    if (problemId === undefined) return;
    const controller = new AbortController();
    void fetchProfessorProblemDetails(problemId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResponse({ problemId, attempt, result: { data } });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = errorMessage(error, "문제 상세를 불러오지 못했어요.");
        setResponse({ problemId, attempt, result: { error: message } });
      });
    return () => controller.abort();
  }, [problemId, attempt]);

  const result =
    response?.problemId === problemId && response?.attempt === attempt ? response.result : undefined;
  const loading = problemId !== undefined && !result;
  const error = result && "error" in result ? result.error : undefined;
  const details = result && "data" in result ? result.data : undefined;
  const localProblem = local?.problem;
  const problem = details
    ? {
        ...details,
        timeLimit: `${details.timeLimitMs} ms`,
        memoryLimit: `${details.memoryLimitMb} MB`,
        deadline: details.dueAt,
        resubmission: details.resubmitAllowed,
        testCases: details.testcases,
      }
    : localProblem && {
        ...localProblem,
        timeLimit: localProblem.timeLimit ? `${localProblem.timeLimit}초` : "미설정",
        memoryLimit: localProblem.memoryLimit ? `${localProblem.memoryLimit} MB` : "미설정",
        testCases: localProblem.testCases.map((testCase, index) => ({
          ...testCase,
          no: index + 1,
          isPublic: testCase.visibility === "public",
        })),
      };

  return (
    <>
      <PageHeader
        responsive
        eyebrow="과제 상세"
        title={assignment?.title ?? "과제를 찾을 수 없어요"}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeft size={24} strokeWidth={1.75} aria-hidden />}
              onClick={() => navigate(listPath)}
            >
              과제 목록
            </Button>
            {problemRegistrationPath && (
              <Button size="sm" onClick={() => navigate(problemRegistrationPath)}>
                문제 등록
              </Button>
            )}
            {reviewPath && (
              <Button variant="secondary" size="sm" onClick={() => navigate(reviewPath)}>
                채점 검토
              </Button>
            )}
          </>
        }
      />
      {assignment && problemRegistrationPath && (
        <Card title="과제 일정">
          <dl className="m-0 grid gap-4 min-[1000px]:grid-cols-3">
            <Fact label="상태" value={ASSIGNMENT_STATUS_LABEL[assignment.status]} />
            <Fact label="공개 시각" value={formatDate(assignment.publishAt)} />
            <Fact label="마감 시각" value={formatDate(assignment.deadline)} />
          </dl>
        </Card>
      )}
      {canFetchDetails && selectedProblem && options.length > 1 && (
        <Select
          label="문제 선택"
          value={String(selectedProblem.id)}
          options={options.map(({ id, title }) => ({ value: String(id), label: title }))}
          onChange={(value) => setSelectedProblemId(Number(value))}
        />
      )}
      {loading ? (
        <Card>
          <p role="status" className="text-sm text-fg-secondary">
            문제 상세를 불러오는 중이에요.
          </p>
        </Card>
      ) : error ? (
        <Card>
          <div className="flex flex-col items-start gap-3">
            <ErrorMessage>{error}</ErrorMessage>
            <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
              다시 시도
            </Button>
          </div>
        </Card>
      ) : problem && assignment ? (
        <>
          <Card title={problem.title} subtitle="문제 설명">
            <p className="m-0 mb-5 text-base leading-[26px] whitespace-pre-wrap text-fg-body [overflow-wrap:anywhere]">
              {problem.description || "등록된 설명이 없어요."}
            </p>
            <dl className="m-0 grid grid-cols-2 gap-4">
              <TextBlock label="입력 형식" value={problem.inputFormat} />
              <TextBlock label="출력 형식" value={problem.outputFormat} />
            </dl>
          </Card>
          {details?.demoInspectionPolicy && (
            <Card title="검사 정책">
              <dl className="m-0 grid gap-4 min-[1000px]:grid-cols-2">
                <Fact
                  label={details.demoInspectionPolicy.mode === "deny" ? "금지 목록" : "허용 목록"}
                  value={(details.demoInspectionPolicy.mode === "deny"
                    ? details.demoInspectionPolicy.deniedTags
                    : details.demoInspectionPolicy.allowedTags
                  ).join(", ") || "없음"}
                />
                <Fact label="필수 목록" value={details.demoInspectionPolicy.requiredTags.join(", ") || "없음"} />
              </dl>
            </Card>
          )}
          <Card title="실행 조건 및 제출 정책">
            <dl className="m-0 grid grid-cols-3 gap-6">
              <Fact label="시간 제한" value={problem.timeLimit} />
              <Fact label="메모리 제한" value={problem.memoryLimit} />
              <Fact label="제출 마감" value={formatDate(problem.deadline)} />
              <Fact label="재제출" value={problem.resubmission ? "허용" : "허용 안 함"} />
              {localProblem && (
                <Fact label="화면 이탈 기록" value={localProblem.trackLeave ? "사용" : "사용 안 함"} />
              )}
              <Fact label="문제 상태" value={ASSIGNMENT_STATUS_LABEL[assignment.status]} />
              {localProblem?.status === "DRAFT" ? (
                <Fact label="공개 설정" value="초안 저장됨" />
              ) : localProblem?.publishAt ? (
                <Fact label="설정된 공개 일시" value={formatDate(localProblem.publishAt)} />
              ) : null}
            </dl>
          </Card>
          <Card
            title="테스트케이스"
            action={<Badge tone="info">{problem.testCases?.length ?? 0}개</Badge>}
          >
            {problem.testCases?.length ? (
              <ul className="m-0 grid list-none gap-4 p-0">
                {problem.testCases.map((testCase) => (
                  <li key={testCase.no} className="rounded-xl border border-border p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <strong className="text-base leading-6">케이스 {testCase.no}</strong>
                      <Badge tone={testCase.isPublic ? "success" : "neutral"}>
                        {testCase.isPublic ? "공개" : "비공개"}
                      </Badge>
                    </div>
                    <dl className="m-0 grid min-w-0 grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <dt className="text-sm leading-5 text-fg-secondary">입력값</dt>
                        <dd className="m-0 mt-1.5 overflow-auto rounded-lg bg-bg p-3 font-mono text-[15px] leading-6 whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {testCase.input || "—"}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-sm leading-5 text-fg-secondary">기대 출력값</dt>
                        <dd className="m-0 mt-1.5 overflow-auto rounded-lg bg-bg p-3 font-mono text-[15px] leading-6 whitespace-pre-wrap [overflow-wrap:anywhere]">
                          {testCase.expectedOutput || "—"}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="등록된 테스트케이스가 없어요" />
            )}
          </Card>
          {assignment.editKey && assignment.status !== "SCHEDULED" && (
            <ClassAssignmentSubmissions key={assignment.editKey} assignment={assignment} />
          )}
        </>
      ) : (
        <Card>
          {assignment && problemRegistrationPath ? (
            <EmptyState title="등록된 문제가 없어요" description="문제 등록 버튼으로 추가해주세요." />
          ) : (
            <EmptyState
              title="과제를 찾을 수 없어요"
              description="목록으로 돌아가 다시 선택해 주세요."
            />
          )}
        </Card>
      )}
    </>
  );
}
