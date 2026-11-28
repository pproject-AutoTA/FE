import { useState } from "react";
import { Check, Code2, Eye, EyeOff, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  VerdictBadge,
  type Verdict,
} from "../../components";
import { findProblem } from "./mockProblems";
import {
  findSubmission,
  getSubmissionDetail,
  type Submission,
  type SubmissionDetail,
} from "./mockSubmissions";

/** 자동 판정 큰 원의 색 */
const CIRCLE: Record<Verdict, string> = {
  AC: "bg-success-bg text-success-fg",
  WA: "bg-danger-bg text-danger-fg",
  TLE: "bg-amber-bg text-amber-fg",
  MLE: "bg-amber-bg text-amber-fg",
  RE: "bg-neutral-bg text-neutral-fg",
  FLAG: "bg-flag-bg text-flag-fg",
};

const label = "text-sm leading-5 text-fg-secondary";

/** 주소의 /student/results/:submissionId 로 제출을 찾는다 */
export function StudentResultDetail() {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const submission = findSubmission(Number(submissionId));

  if (!submission) {
    return (
      <EmptyState
        title="제출 기록을 찾을 수 없어요"
        description="목록에서 제출을 다시 선택해 주세요."
        action={
          <Button
            variant="secondary"
            onClick={() => navigate("/student/results")}
          >
            목록으로 돌아가기
          </Button>
        }
      />
    );
  }
  return (
    <DetailView
      key={submission.id}
      s={submission}
      detail={getSubmissionDetail(submission)}
    />
  );
}

function DetailView({
  s,
  detail,
}: {
  s: Submission;
  detail: SubmissionDetail;
}) {
  const navigate = useNavigate();
  const grading = s.stage === "GRADING";
  const problem = findProblem(s.problemId);
  const canResubmit = !!problem && !problem.closed && problem.canResubmit;

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · SUBMISSION DETAIL"
        title="채점 결과 상세"
        description="자동 채점 결과와 교수 평가 내용을 확인하세요."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate("/student/results")}
          >
            목록으로 돌아가기
          </Button>
        }
      />

      <Summary s={s} grading={grading} />
      <Review s={s} detail={detail} />

      <div className="grid grid-cols-[2fr_1fr] items-start gap-7">
        <Testcases detail={detail} grading={grading} />

        <div className="grid gap-7">
          <FlagBox detail={detail} grading={grading} />

          <Card title="채점 정보">
            <dl className="m-0">
              {[
                ["실행 시간", `${detail.info.runtimeMs} ms`],
                ["메모리", `${detail.info.memoryMb} MB`],
                ["언어", detail.info.language],
                ["코드 길이", `${detail.info.codeBytes} B`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-border py-3.5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className={label}>{k}</dt>
                  <dd className="m-0 text-sm leading-5 font-bold">
                    {grading ? "—" : v}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="제출 이력" subtitle="마지막 제출이 성적에 반영됩니다.">
            {detail.attempts.length === 0 ? (
              <p className="m-0 text-sm leading-5 text-fg-secondary">
                채점이 끝나면 제출 이력이 보여요.
              </p>
            ) : (
              detail.attempts.map((a) => (
                <div
                  key={a.no}
                  className="flex items-center justify-between gap-3 border-b border-border py-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <strong className="text-sm">#{a.no}</strong>
                    <div className="text-xs leading-5 text-fg-secondary">
                      {a.at}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {a.isFinal ? (
                      <Badge tone="info">최종 반영</Badge>
                    ) : (
                      <span className="text-xs text-fg-secondary">
                        이전 제출
                      </span>
                    )}
                    <strong className="w-10 text-right text-sm">
                      {a.verdict}
                    </strong>
                  </div>
                </div>
              ))
            )}
          </Card>

          {canResubmit && (
            <div className="[&>button]:w-full">
              <Button
                onClick={() =>
                  navigate(`/student/submit?problem=${s.problemId}`)
                }
              >
                <Code2 size={20} strokeWidth={1.75} />
                수정해서 다시 제출
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** 맨 위 요약: 자동 판정 · 문제 · 테스트 결과 · 공개 점수 */
function Summary({ s, grading }: { s: Submission; grading: boolean }) {
  const circle = s.verdict ? CIRCLE[s.verdict] : "bg-info-bg text-info-fg";
  return (
    <section className="flex items-center justify-between gap-6 rounded-2xl border border-border bg-surface px-[30px] py-[30px] shadow-sm">
      <div className="flex items-center gap-6">
        <span
          className={`grid size-[84px] flex-none place-items-center rounded-full text-2xl font-medium ${circle}`}
        >
          {s.verdict ?? "…"}
        </span>
        <div>
          <Badge tone={grading ? "info" : "success"}>
            {grading ? "채점 중" : "채점 완료"}
          </Badge>
          <h2 className="m-0 mt-2 text-[30px] leading-10 font-medium">
            {s.title}
          </h2>
          <div className="mt-1 text-sm leading-5 text-fg-secondary">
            제출 #{getSubmissionDetailCode(s)} · {s.submittedAt}
          </div>
        </div>
      </div>

      <div className="flex items-stretch gap-8">
        <div className="self-center text-right">
          <div className={label}>테스트 결과</div>
          <div className="mt-2 text-[28px] leading-9 font-bold">
            {s.passed === null ? "—" : `${s.passed} / ${s.total} 통과`}
          </div>
        </div>
        <div className="w-px bg-border" aria-hidden />
        <div className="min-w-[230px] text-right">
          <div className={label}>공개 점수</div>
          {s.released && s.score !== null ? (
            <>
              <div className="mt-1.5 text-[34px] leading-[44px] font-bold text-success-fg">
                {s.score} / 100 공개
              </div>
              <div className="mt-1 flex items-center justify-end gap-2 text-sm leading-5 text-fg-secondary">
                <Check size={16} strokeWidth={2} aria-hidden />
                교수가 과제 점수를 공개했어요
              </div>
            </>
          ) : (
            <>
              <div className="mt-1.5 text-[34px] leading-[44px] font-bold text-flag-fg">
                {grading ? "—" : "공개 전"}
              </div>
              <div className="mt-1 text-sm leading-5 text-fg-secondary">
                {grading
                  ? "채점이 끝나면 확인할 수 있어요"
                  : "교수 검토 후 공개돼요"}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** 목록 데이터에는 제출 번호가 없어서 상세 데이터에서 꺼낸다 */
const getSubmissionDetailCode = (s: Submission) => getSubmissionDetail(s).code;

/** 교수 평가 */
function Review({ s, detail }: { s: Submission; detail: SubmissionDetail }) {
  const reviewed = s.stage === "REVIEWED";
  const tone = !reviewed
    ? s.stage === "REVIEWING"
      ? "border-flag-border bg-[#FFFAF4]"
      : "border-border bg-surface"
    : s.released
      ? "border-[#BFE5D6] bg-[#F6FCF9]"
      : "border-flag-border bg-[#FFFAF4]";

  const badge =
    s.stage === "GRADING" ? (
      <Badge tone="info">채점 중</Badge>
    ) : s.stage === "REVIEWING" ? (
      <Badge tone="flag">교수 검토 중</Badge>
    ) : s.released ? (
      <Badge tone="success">평가 완료</Badge>
    ) : (
      <Badge tone="flag">평가 완료 · 공개 전</Badge>
    );

  const sub =
    reviewed && detail.review
      ? `${detail.review.by} · ${detail.review.at}`
      : s.stage === "REVIEWING"
        ? "교수가 제출 내용을 검토하고 있어요"
        : "자동 채점이 끝나면 교수 평가가 시작돼요";

  return (
    <section className={`overflow-hidden rounded-2xl border shadow-sm ${tone}`}>
      <div className="flex items-center justify-between gap-4 px-7 py-5">
        <div className="flex items-center gap-4">
          <span className="grid size-[52px] flex-none place-items-center rounded-xl bg-white/70 text-success-fg">
            <FileText size={26} strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h2 className="m-0 text-lg leading-7 font-medium">교수 평가</h2>
            <div className="text-xs leading-5 text-fg-secondary">{sub}</div>
          </div>
        </div>
        {badge}
      </div>

      {reviewed && detail.review && (
        <div className="border-t border-border/70 px-7 py-5">
          {s.released ? (
            <div className="rounded-lg border-l-4 border-success-fg bg-[#F1F5F4] px-5 py-4">
              <strong className="text-xs">평가 의견</strong>
              <p className="m-0 mt-2 text-sm leading-6 text-fg-body">
                {detail.review.opinion}
              </p>
            </div>
          ) : (
            <p className="m-0 text-sm leading-6 text-fg-secondary">
              점수가 공개되면 평가 의견도 함께 볼 수 있어요.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/** 테스트케이스 결과 (그룹별) */
function Testcases({
  detail,
  grading,
}: {
  detail: SubmissionDetail;
  grading: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const all = detail.groups.flatMap((g) => g.cases);
  const passed = all.filter((c) => c.verdict === "AC").length;

  return (
    <Card
      title="테스트케이스 결과"
      subtitle="그룹별 실행 결과를 확인하세요."
      action={
        !grading && (
          <span className="inline-flex h-8 items-center rounded-full bg-info-bg px-3.5 text-sm font-bold text-info-fg">
            {passed} / {all.length} 통과
          </span>
        )
      }
    >
      {grading ? (
        <EmptyState
          title="채점 중이에요"
          description="채점이 끝나면 그룹별 결과가 여기에 보여요."
        />
      ) : (
        <div className="grid gap-5">
          {detail.groups.map((g) => {
            const gp = g.cases.filter((c) => c.verdict === "AC").length;
            return (
              <div
                key={g.name}
                className="overflow-hidden rounded-2xl border border-border"
              >
                <div className="flex items-center justify-between bg-th-bg px-[18px] py-3.5">
                  <div className="flex items-center gap-2.5">
                    <strong className="text-sm">{g.name}</strong>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs text-fg-secondary">
                      {g.cases.length}건
                    </span>
                  </div>
                  <strong className="text-xs text-blue-600">
                    {gp} / {g.cases.length} 통과
                  </strong>
                </div>
                {g.cases.map((c) => (
                  <div key={c.no} className="border-t border-border">
                    <div className="flex items-center gap-5 px-[18px] py-3">
                      <span className="w-8 text-xs text-fg-secondary">
                        #{c.no}
                      </span>
                      <VerdictBadge verdict={c.verdict} />
                      <span className="text-xs text-fg-secondary">
                        {c.timeSec.toFixed(2)}s
                      </span>
                      <span className="ml-auto">
                        {c.isPublic ? (
                          <button
                            type="button"
                            aria-expanded={open === c.no}
                            onClick={() => setOpen(open === c.no ? null : c.no)}
                            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-medium text-fg-body hover:bg-blue-25"
                          >
                            {open === c.no ? (
                              <EyeOff
                                size={16}
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            ) : (
                              <Eye size={16} strokeWidth={1.75} aria-hidden />
                            )}
                            {open === c.no ? "입출력 닫기" : "입출력 보기"}
                          </button>
                        ) : (
                          <span className="pr-8 text-xs text-fg-tertiary">
                            비공개
                          </span>
                        )}
                      </span>
                    </div>
                    {/* 비공개 케이스는 입출력을 절대 그리지 않는다 */}
                    {c.isPublic && open === c.no && (
                      <div className="grid grid-cols-2 gap-3 px-[18px] pb-4">
                        {[
                          ["입력", c.input],
                          ["기대 출력", c.expected],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div className="mb-1.5 text-xs font-bold">{k}</div>
                            <pre className="m-0 rounded-lg bg-[#F6F7FA] px-4 py-3 font-mono text-sm leading-6 whitespace-pre-wrap">
                              {v}
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/** 허용 요소 검사 */
function FlagBox({
  detail,
  grading,
}: {
  detail: SubmissionDetail;
  grading: boolean;
}) {
  const flagged = detail.flags.length > 0;
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
              ? "점수에는 반영되지 않아요."
              : grading
                ? "채점이 끝나면 검사 결과가 보여요."
                : "허용 범위를 벗어난 코드가 없어요."}
          </div>
        </div>
        {flagged ? (
          <VerdictBadge verdict="FLAG" />
        ) : (
          !grading && <Badge tone="success">위반 없음</Badge>
        )}
      </div>

      {flagged && (
        <div className="mt-5 rounded-xl border border-flag-border bg-flag-bg px-5 py-4">
          {detail.flags.map((f) => (
            <div key={`${f.tag}-${f.line}`}>
              {[
                ["줄 번호", <strong key="l">{f.line}번째 줄</strong>],
                [
                  "위반 태그",
                  <code
                    key="t"
                    className="rounded-md bg-[#FFE9CF] px-2.5 py-1 font-mono text-xs font-bold text-flag-text"
                  >
                    {f.tag}
                  </code>,
                ],
                [
                  "해당 코드",
                  <code
                    key="c"
                    className="rounded-md bg-[#FFE9CF] px-2.5 py-1 font-mono text-xs font-bold text-flag-text"
                  >
                    {f.code}
                  </code>,
                ],
              ].map(([k, v], i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-flag-border py-3 text-xs first:pt-0"
                >
                  <span className="w-16 flex-none text-fg-secondary">{k}</span>
                  {v}
                </div>
              ))}
            </div>
          ))}
          <p className="m-0 pt-3 text-xs leading-5 text-flag-text">
            교수 검토 후 최종 점수가 확정됩니다.
          </p>
        </div>
      )}
    </section>
  );
}
