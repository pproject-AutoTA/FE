import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../auth/storage";
import { FEATURES } from "../../features";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IndexChip,
  ListRow,
  PageHeader,
  ProgressRing,
  Skeleton,
  StatCard,
  VerdictBadge,
} from "../../components";
import { linkButtonBase } from "../../components/ui/classes";
import {
  errorMessage,
  useStudentCourseData,
  type Problem,
  type Submission,
} from "./courseData";
import { parseKst } from "./format";

const TONES = ["blue", "purple", "orange"] as const;
const DAY = 24 * 3600_000;
const pad = (n: number) => String(n).padStart(2, "0");

/** 이 문제를 낸 정도: 채점이 끝났으면 100, 아직 안 냈으면 0, 채점 중이면 표시하지 않는다 */
const progressOf = (p: Problem) =>
  p.status === "DONE" ? 100 : p.status === "NONE" ? 0 : null;

function HomeView({
  problems,
  submissions,
  courses,
}: {
  problems: Problem[];
  submissions: Submission[];
  courses: { semester: string; assignmentCount: number }[];
}) {
  const navigate = useNavigate();
  const user = getUser();
  const now = Date.now();

  const open = problems
    .filter((p) => !p.closed)
    .sort(
      (a, b) => parseKst(a.dueAt).getTime() - parseKst(b.dueAt).getTime(),
    );
  const dueThisWeek = open.filter(
    (p) => parseKst(p.dueAt).getTime() - now <= 7 * DAY,
  ).length;
  const done = problems.filter((p) => p.status === "DONE").length;
  const waiting = problems.filter(
    (p) => p.status === "QUEUED" || p.status === "RUNNING",
  ).length;
  const assignmentTotal = courses.reduce((n, c) => n + c.assignmentCount, 0);
  const active = open.slice(0, 3);
  const recent = submissions.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={courses[0]?.semester ?? "내 수업"}
        title={`안녕하세요, ${user?.name ?? "학생"}님`}
        description="마감이 가까운 과제를 확인하고 학습을 이어가세요."
      />

      <div className="grid grid-cols-4 gap-[22px]">
        <StatCard
          tone="blue"
          icon={<BookOpen size={28} strokeWidth={1.75} />}
          label="진행 중 문제"
          value={open.length}
          sub={`이번 주 마감 ${dueThisWeek}개`}
        />
        <StatCard
          tone="green"
          icon={<CheckCircle2 size={28} strokeWidth={1.75} />}
          label="채점 완료한 문제"
          value={done}
          sub={`전체 ${problems.length}개 중`}
        />
        <StatCard
          tone="purple"
          icon={<FileText size={28} strokeWidth={1.75} />}
          label="참여 중인 수업"
          value={courses.length}
          sub={`과제 ${assignmentTotal}개`}
        />
        <StatCard
          tone="orange"
          icon={<Clock3 size={28} strokeWidth={1.75} />}
          label="채점 대기·진행"
          value={waiting}
          sub={waiting ? "끝나면 결과 화면에서 확인" : "대기 중인 제출 없음"}
        />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-7">
        <Card
          padding="table"
          title="진행 중 과제"
          subtitle="마감일이 가까운 순서로 표시됩니다."
          action={
            <button
              type="button"
              className={`${linkButtonBase} inline-flex items-center gap-2 text-sm`}
              onClick={() => navigate("/student/problems")}
            >
              전체 보기
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
          }
        >
          <div className="border-t border-border">
            {active.length === 0 && (
              <EmptyState
                title="진행 중인 문제가 없어요"
                description="수업에 참여하면 과제가 여기에 보여요."
              />
            )}
            {active.map((p, i) => (
              <ListRow
                key={p.id}
                leading={
                  <IndexChip tone={TONES[i % TONES.length]}>
                    {pad(p.id)}
                  </IndexChip>
                }
                title={p.title}
                subtitle={`${p.course} · ${p.assignmentTitle}`}
                trailing={
                  <div className="flex items-center gap-10">
                    <div className="w-24">
                      <small className="block text-sm leading-5 text-fg-secondary">
                        마감
                      </small>
                      <strong
                        className={`block text-base leading-6 font-bold ${parseKst(p.dueAt).getTime() - now <= 3 * DAY ? "text-danger-fg" : "text-fg"}`}
                      >
                        {p.due}
                      </strong>
                    </div>
                    <ProgressRing percent={progressOf(p)} />
                  </div>
                }
                onClick={() => navigate(`/student/submit?problem=${p.id}`)}
              />
            ))}
          </div>
        </Card>

        <Card title="최근 제출" subtitle="내 채점 현황">
          <ul className="m-0 mb-6 list-none p-0">
            {recent.length === 0 && (
              <li className="py-4 text-sm leading-5 text-fg-secondary">
                아직 제출한 문제가 없어요.
              </li>
            )}
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
              >
                {r.verdict ? (
                  <VerdictBadge verdict={r.verdict} chip />
                ) : (
                  <Badge tone={r.stage === "FAILED" ? "danger" : "info"} square>
                    {r.stage === "FAILED" ? "실패" : "채점 중"}
                  </Badge>
                )}
                <div>
                  <strong className="block text-base leading-6 font-bold">
                    {r.title}
                  </strong>
                  <span className="block text-sm leading-5 text-fg-secondary">
                    {r.submittedAt}
                    {r.passed !== null && ` · ${r.passed} / ${r.total} 통과`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="[&>button]:w-full">
            <Button
              variant="secondary"
              onClick={() => navigate("/student/results")}
            >
              제출 이력 확인
            </Button>
          </div>
        </Card>
      </div>

      {FEATURES.notices && (
        <>
        {/* 공지 */}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-border bg-surface px-[30px] py-6 text-left shadow-sm hover:bg-[#F9FBFF]"
          onClick={() => navigate("/student/notices")}
        >
          <span className="grid size-14 flex-none place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Bell size={24} strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <Badge tone="info">공지</Badge>
              <strong className="text-[17px] leading-6 font-bold">
                중간고사 대체 과제 채점 기준 안내
              </strong>
            </div>
            <span className="mt-2 block text-sm leading-5 text-fg-secondary">
              부분 점수 및 허용 요소 검사 기준이 업데이트되었습니다.
            </span>
          </div>
          <span className="text-sm leading-5 text-fg-secondary">2시간 전</span>
          <ChevronRight
            size={22}
            strokeWidth={1.75}
            className="flex-none text-fg-body"
            aria-hidden
          />
        </button>
        </>
      )}
    </>
  );
}

export function StudentHome() {
  const navigate = useNavigate();
  const { data, error } = useStudentCourseData();
  if (error)
    return (
      <EmptyState
        title="홈 정보를 불러오지 못했어요"
        description={errorMessage(error)}
        action={
          <Button variant="secondary" onClick={() => navigate(0)}>
            다시 시도
          </Button>
        }
      />
    );
  if (!data)
    return (
      <div className="grid gap-5" aria-busy>
        <Skeleton width="40%" height={48} />
        <Skeleton height={120} />
        <Skeleton height={420} />
      </div>
    );
  return (
    <HomeView
      problems={data.problems}
      submissions={data.submissions}
      courses={data.courses}
    />
  );
}
