import { ASSIGNMENT_STATUS_LABEL } from "./professorAssignments";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, EmptyState, PageHeader } from "../../components";
import { readEditableProblem, type AssignmentView } from "./professorAssignments";
import { ClassAssignmentSubmissions } from "./ClassAssignmentSubmissions";

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
}: {
  assignment?: AssignmentView;
  listPath: string;
}) {
  const navigate = useNavigate();
  let problem;
  try {
    problem = assignment?.editKey ? readEditableProblem(assignment.editKey)?.problem : undefined;
  } catch {
    problem = undefined;
  }

  return (
    <>
      <PageHeader
        responsive
        eyebrow="과제 상세"
        title={problem?.title ?? "과제를 찾을 수 없어요"}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft size={24} strokeWidth={1.75} aria-hidden />}
            onClick={() => navigate(listPath)}
          >
            과제 목록
          </Button>
        }
      />
      {problem && assignment ? (
        <>
          <Card title="문제 설명">
            <p className="m-0 mb-5 text-base leading-[26px] whitespace-pre-wrap text-fg-body [overflow-wrap:anywhere]">
              {problem.description || "등록된 설명이 없어요."}
            </p>
            <dl className="m-0 grid grid-cols-2 gap-4">
              <TextBlock label="입력 형식" value={problem.inputFormat} />
              <TextBlock label="출력 형식" value={problem.outputFormat} />
            </dl>
          </Card>
          <Card title="실행 조건 및 제출 정책">
            <dl className="m-0 grid grid-cols-3 gap-6">
              <Fact
                label="시간 제한"
                value={problem.timeLimit ? `${problem.timeLimit}초` : "미설정"}
              />
              <Fact
                label="메모리 제한"
                value={problem.memoryLimit ? `${problem.memoryLimit} MB` : "미설정"}
              />
              <Fact label="제출 마감" value={formatDate(problem.deadline)} />
              <Fact label="재제출" value={problem.resubmission ? "허용" : "허용 안 함"} />
              <Fact label="화면 이탈 기록" value={problem.trackLeave ? "사용" : "사용 안 함"} />
              <Fact label="문제 상태" value={ASSIGNMENT_STATUS_LABEL[assignment.status]} />
              {problem.status === "DRAFT" ? (
                <Fact label="공개 설정" value="초안 저장됨" />
              ) : problem.publishAt ? (
                <Fact label="설정된 공개 일시" value={formatDate(problem.publishAt)} />
              ) : null}
            </dl>
          </Card>
          <Card
            title="테스트케이스"
            action={<Badge tone="info">{problem.testCases?.length ?? 0}개</Badge>}
          >
            {problem.testCases?.length ? (
              <ul className="m-0 grid list-none gap-4 p-0">
                {problem.testCases.map((testCase, index) => (
                  <li key={testCase.id} className="rounded-xl border border-border p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <strong className="text-base leading-6">케이스 {index + 1}</strong>
                      <Badge tone={testCase.visibility === "public" ? "success" : "neutral"}>
                        {testCase.visibility === "public" ? "공개" : "비공개"}
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
          {assignment.status !== "SCHEDULED" && (
            <ClassAssignmentSubmissions key={assignment.editKey} assignment={assignment} />
          )}
        </>
      ) : (
        <Card>
          <EmptyState
            title="과제를 찾을 수 없어요"
            description="목록으로 돌아가 다시 선택해 주세요."
          />
        </Card>
      )}
    </>
  );
}
