import { HOME_COURSES, HOME_GRADING } from "../../mocks/professor";
import { ROUTES } from "../../routes";
import { ArrowRight, BookOpen, Check, Clock, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ProfessorLayout,
  Badge,
  Banner,
  Card,
  DataTable,
  IndexChip,
  ListRow,
  PageHeader,
  ProgressRing,
  StatCard,
} from "../../components";
import { readProfessorClasses } from "./professorClassData";
import {
  formatAssignmentDeadline,
  getAssignmentStatus,
  readProfessorAssignments,
  useAssignmentClock,
} from "./professorAssignments";
import { getReleaseTasks } from "./mockScoreRelease";
import { getPendingReviews, useProfessorMockState } from "./professorMockState";

const ICON = { size: 24, strokeWidth: 1.75 } as const;

export function ProfessorHome() {
  const navigate = useNavigate();
  const classes = readProfessorClasses();
  const assignments = readProfessorAssignments();
  const now = useAssignmentClock(assignments);
  const mockState = useProfessorMockState();
  const active = assignments.filter(
    (assignment) => getAssignmentStatus(assignment, now) === "PUBLISHED",
  );
  const pendingCount = getPendingReviews(mockState).length;
  const releaseTasks = getReleaseTasks(assignments, classes, mockState);
  const gradingTasks = HOME_GRADING.flatMap(({ id, grading }) => {
    const task = releaseTasks.find((item) => item.id === id && !item.released);
    if (!task) return [];
    const gradingCount = Math.min(grading, task.submitted);
    return [{ ...task, grading: gradingCount, graded: task.submitted - gradingCount }];
  });
  const submissionRate = (items: typeof assignments) => {
    const capacity = items.reduce((sum, item) => sum + item.total, 0);
    return capacity
      ? Math.round((items.reduce((sum, item) => sum + item.submitted, 0) / capacity) * 100)
      : 0;
  };

  return (
    <ProfessorLayout>
      <PageHeader
        responsive
        eyebrow="2025년 봄학기"
        title="안녕하세요, 박서연 교수님"
        description="수업과 과제 운영 현황을 확인하고 필요한 업무를 이어가세요."
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          wrapValue
          icon={<BookOpen {...ICON} />}
          label="진행 중인 수업"
          value={classes.filter((course) => course.open).length}
          sub={`전체 수업 ${classes.length}개`}
          aria-label="수업 관리로 이동"
          onClick={() => navigate(ROUTES.professorClasses)}
        />
        <StatCard
          wrapValue
          tone="orange"
          icon={<Flag {...ICON} />}
          label="검토 대기"
          value={pendingCount}
          sub="FLAG 확인 필요"
          aria-label="채점 검토로 이동"
          onClick={() => navigate(ROUTES.professorReview)}
        />
        <StatCard
          wrapValue
          tone="green"
          icon={<Check {...ICON} />}
          label="평균 제출률"
          value={active.length ? `${submissionRate(active)}%` : "—"}
          sub="진행 과제 기준"
          aria-label="문제 관리로 이동"
          onClick={() => navigate(ROUTES.professorProblems)}
        />
      </div>

      <Card
        padding="table"
        title="수업 현황"
        subtitle="담당 수업의 수강생과 과제 제출률을 확인하세요."
        action={
          <Button variant="link" type="button" onClick={() => navigate(ROUTES.professorClasses)}>
            전체 수업
            <ArrowRight size={24} strokeWidth={1.75} />
          </Button>
        }
      >
        {HOME_COURSES.map(({ id, tone }) => {
          const course = classes.find((item) => item.id === id);
          if (!course) return null;
          const activeProblems = active.filter((item) => item.classId === course.id);
          return (
            <ListRow
              keyboardNavigation
              preserveTrailingWidth
              key={course.id}
              leading={<IndexChip tone={tone}>{course.code.split("-")[0]}</IndexChip>}
              title={course.title}
              subtitle={course.term}
              onClick={() =>
                navigate(`${ROUTES.professorClasses}?course=${encodeURIComponent(course.id)}`)
              }
              trailing={
                <>
                  <span className="w-24">
                    <small className="block text-sm leading-5 text-fg-secondary">수강생</small>
                    <b className="text-base leading-6">{course.count}명</b>
                  </span>
                  <span className="w-28">
                    <small className="block text-sm leading-5 text-fg-secondary">
                      진행 중 과제
                    </small>
                    <b className="text-base leading-6">
                      {activeProblems.length ? `${activeProblems.length}개` : "없음"}
                    </b>
                  </span>
                  <span className="flex items-center gap-3">
                    <small className="text-sm leading-5 text-fg-secondary">제출률</small>
                    <span className="grid w-14 place-items-center">
                      {activeProblems.length ? (
                        <ProgressRing percent={submissionRate(activeProblems)} />
                      ) : (
                        "—"
                      )}
                    </span>
                  </span>
                </>
              }
            />
          );
        })}
      </Card>

      <Card
        padding="table"
        title="채점 현황"
        subtitle="점수가 공개되지 않은 과제 기준입니다."
        action={
          <div className="flex items-center gap-5">
            <Badge tone="flag">FLAG 검토 {pendingCount}건</Badge>
            <Button variant="link" type="button" onClick={() => navigate(ROUTES.professorReview)}>
              채점 검토
              <ArrowRight size={24} strokeWidth={1.75} />
            </Button>
          </div>
        }
      >
        <DataTable
          horizontalScroll
          keyboardNavigation
          rows={gradingTasks}
          rowKey={(task) => task.id}
          onRowClick={(task) =>
            navigate(
              `${ROUTES.professorReview}?${new URLSearchParams({ assignment: task.editKey ?? "" })}`,
            )
          }
          columns={[
            {
              key: "title",
              header: "과제",
              render: (task) => (
                <>
                  <strong className="block text-fg">{task.title}</strong>
                  <small className="text-sm text-fg-secondary">{task.course}</small>
                </>
              ),
            },
            {
              key: "due",
              header: "마감",
              render: (task) => (
                <Badge tone="flag">{formatAssignmentDeadline(task.deadline, now)}</Badge>
              ),
            },
            {
              key: "submitted",
              header: "제출",
              render: (task) => (
                <>
                  <strong className="text-fg">{task.submitted}</strong>
                  <span className="text-fg-secondary"> / {task.total}</span>
                </>
              ),
            },
            {
              key: "graded",
              header: "채점 완료",
              render: (task) => <strong className="text-success-fg">{task.graded}건</strong>,
            },
            {
              key: "grading",
              header: "채점 중",
              render: (task) => <Badge tone="info">{task.grading}건</Badge>,
            },
            {
              key: "flags",
              header: "FLAG",
              render: (task) => <Badge tone="flag">{task.pending}건</Badge>,
            },
          ]}
        />
        <div className="px-[30px] py-5">
          <Banner type="info" icon={<Clock size={24} strokeWidth={1.75} />}>
            점수 공개 후에는 이 현황에서 제외되며 점수 공개 화면에서 확인할 수 있습니다.
          </Banner>
        </div>
      </Card>
    </ProfessorLayout>
  );
}
