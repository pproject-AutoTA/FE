import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { Button, Badge, Card, CodeBlock, EmptyState, ListRow, Pagination } from "../../components";
import type { AssignmentView } from "./professorAssignments";
import { DEFAULT_ANSWERS, getMockSubmissionMetadata, SAMPLE_ANSWERS } from "../../mocks/professor";
import { usePagination } from "./usePagination";
import { getMockClassStudent } from "./professorClassData";

function formatSubmissionDate(submittedAt: Date) {
  const day = submittedAt.getDate();
  const hour = String(submittedAt.getHours()).padStart(2, "0");
  const minute = String(submittedAt.getMinutes()).padStart(2, "0");
  return `${submittedAt.getMonth() + 1}. ${day}. ${hour}:${minute}`;
}

function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`grid flex-none place-items-center rounded-full bg-blue-50 font-bold text-blue-600 ${size === "lg" ? "size-14 text-xl" : "size-11 text-base"}`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function ClassAssignmentSubmissions({ assignment }: { assignment: AssignmentView }) {
  const [selectedId, setSelectedId] = useState<string>();
  const [copied, setCopied] = useState(false);
  const answers = assignment.editKey
    ? (SAMPLE_ANSWERS[assignment.editKey] ?? DEFAULT_ANSWERS)
    : undefined;
  const classId = assignment.classId;
  const submissions =
    answers && classId
      ? Array.from({ length: assignment.submitted }, (_, index) => ({
          ...getMockClassStudent(classId, index),
          answer: answers[index % answers.length],
          ...getMockSubmissionMetadata(index),
        }))
      : [];
  const pager = usePagination(submissions, 8, assignment.editKey, true);
  const selected = submissions.find((item) => item.studentId === selectedId);
  const ended = assignment.status === "CLOSED";

  const copyAnswer = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // 클립보드를 쓸 수 없는 환경에서는 아무 일도 하지 않는다.
    }
  };

  return (
    <Card
      padding="table"
      title="제출 현황"
      subtitle="샘플 제출 데이터입니다."
      action={
        <Badge tone="info">
          {submissions.length} / {assignment.total}명 제출
        </Badge>
      }
    >
      {submissions.length === 0 ? (
        <EmptyState title="아직 제출한 학생이 없어요" />
      ) : (
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] border-t border-border">
          <div className="border-r border-border">
            <div role="list" aria-label="제출한 학생">
              {pager.items.map((item) => (
                <ListRow
                  keyboardNavigation
                  key={item.studentId}
                  leading={<Avatar name={item.name} />}
                  title={item.name}
                  subtitle={item.studentId}
                  selected={selectedId === item.studentId}
                  onClick={() => {
                    setSelectedId(item.studentId);
                    setCopied(false);
                  }}
                  trailing={
                    ended ? <Badge tone="success">최종 {item.finalScore}점</Badge> : undefined
                  }
                />
              ))}
            </div>
            {pager.show && (
              <Pagination
                page={pager.page}
                pageCount={pager.pageCount}
                onChange={pager.setPage}
                summary={pager.summary}
              />
            )}
          </div>
          <div className="min-w-0 bg-th-bg p-[30px]">
            {selected ? (
              <div className="grid gap-5">
                <div className="flex items-center gap-4">
                  <Avatar name={selected.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="m-0 text-xl leading-7 font-bold">{selected.name}</h3>
                      <span className="text-sm leading-5 text-fg-secondary">
                        {selected.studentId}
                      </span>
                    </div>
                    <p className="m-0 text-sm leading-5 text-fg-secondary">
                      {formatSubmissionDate(selected.submittedAt)} 제출
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 divide-x divide-border rounded-[14px] border border-border bg-surface py-4 text-center">
                  {[
                    {
                      label: ended ? "최종 점수" : "자동 채점 점수",
                      value: `${selected.finalScore}점`,
                      strong: true,
                    },
                    { label: "언어", value: "Python 3" },
                    { label: "실행 시간", value: `${selected.runtimeSeconds.toFixed(2)}초` },
                    { label: "메모리", value: `${selected.memoryMegabytes}MB` },
                  ].map((m) => (
                    <div key={m.label}>
                      <small className="block text-sm leading-5 text-fg-secondary">{m.label}</small>
                      <strong
                        className={`block text-lg leading-7 font-bold${m.strong ? " text-blue-600" : ""}`}
                      >
                        {m.value}
                      </strong>
                    </div>
                  ))}
                </div>

                <section
                  aria-label="제출 코드"
                  className="overflow-hidden rounded-[14px] border border-border bg-surface"
                >
                  <header className="flex items-center gap-3 border-b border-border px-5 py-3">
                    <FileCode2
                      size={24}
                      strokeWidth={1.75}
                      className="text-fg-secondary"
                      aria-hidden
                    />
                    <strong className="text-[15px] leading-6">main.py</strong>
                    <span className="text-sm text-fg-secondary">
                      {selected.answer.split("\n").length}줄
                    </span>
                    <Button
                      variant="link"
                      type="button"
                      onClick={copyAnswer}
                      className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-secondary hover:bg-neutral-bg focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      {copied ? (
                        <Check size={24} strokeWidth={1.75} aria-hidden />
                      ) : (
                        <Copy size={24} strokeWidth={1.75} aria-hidden />
                      )}
                      {copied ? "복사됨" : "코드 복사"}
                    </Button>
                  </header>
                  <div className="p-3">
                    <CodeBlock code={selected.answer} />
                  </div>
                </section>
              </div>
            ) : (
              <EmptyState
                title="학생을 선택하세요"
                description="학생을 선택하면 제출 답안을 확인할 수 있어요."
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
