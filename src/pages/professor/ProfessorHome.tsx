import { ArrowRight, BookOpen, Check, Clock, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Banner, Card, DataTable, IndexChip, ListRow, PageHeader, ProgressRing, StatCard } from "../../components";
import { ProfessorLayout } from "../../components/layout/ProfessorSidebar";
import { linkButton } from "../../components/ui/classes";
import { readProfessorClasses } from "./professorClassData";
import { getAssignmentStatus, readProfessorAssignments, useAssignmentClock } from "./professorAssignments";
import { getReleaseTasks } from "./mockScoreRelease";
import { getPendingReviews, useProfessorMockState } from "./professorMockState";

const HOME_COURSES = [
  { id: "data-structures", tone: "blue" },
  { id: "algorithms", tone: "purple" },
  { id: "python", tone: "neutral" },
] as const;
const HOME_GRADING = [
  { id: 2, grading: 4 },
  { id: 6, grading: 2 },
  { id: 3, grading: 3 },
  { id: 7, grading: 3 },
];

const ICON = { size: 28, strokeWidth: 1.75 } as const;
const statAction = "relative rounded-2xl [&>div]:transition-colors hover:[&>div]:border-border-strong";
const statButton = "absolute inset-0 cursor-pointer rounded-2xl border-0 bg-transparent focus-visible:shadow-ring focus-visible:outline-none";

export function ProfessorHome() {
  const navigate = useNavigate();
  const classes = readProfessorClasses();
  const assignments = readProfessorAssignments();
  const now = useAssignmentClock(assignments);
  const mockState = useProfessorMockState();
  const active = assignments.filter((assignment) => getAssignmentStatus(assignment, now) === "공개");
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
    return capacity ? Math.round(items.reduce((sum, item) => sum + item.submitted, 0) / capacity * 100) : 0;
  };

  return (
    <ProfessorLayout>
      <PageHeader
        eyebrow="2025년 봄학기" title="안녕하세요, 박서연 교수님"
        description="수업과 과제 운영 현황을 확인하고 필요한 업무를 이어가세요."
      />

      <div className="grid grid-cols-3 gap-4">
        <div className={statAction}>
          <StatCard icon={<BookOpen {...ICON} />} label="진행 중인 수업" value={classes.filter((course) => course.open).length} sub={`전체 수업 ${classes.length}개`} />
          <button type="button" className={statButton} aria-label="수업 관리로 이동" onClick={() => navigate("/professor/classes")} />
        </div>
        <div className={statAction}>
          <StatCard tone="orange" icon={<Flag {...ICON} />} label="검토 대기" value={pendingCount} sub="FLAG 확인 필요" />
          <button type="button" className={statButton} aria-label="채점 검토로 이동" onClick={() => navigate("/professor/review")} />
        </div>
        <div className={statAction}>
          <StatCard tone="green" icon={<Check {...ICON} />} label="평균 제출률" value={active.length ? `${submissionRate(active)}%` : "—"} sub="진행 과제 기준" />
          <button type="button" className={statButton} aria-label="문제 관리로 이동" onClick={() => navigate("/professor/problems")} />
        </div>
      </div>

      <Card
        padding="table" title="수업 현황" subtitle="담당 수업의 수강생과 과제 제출률을 확인하세요."
        action={<button type="button" className={linkButton} onClick={() => navigate("/professor/classes")}>전체 수업<ArrowRight size={18} strokeWidth={1.75} /></button>}
      >
        {HOME_COURSES.map(({ id, tone }) => {
          const course = classes.find((item) => item.id === id);
          if (!course) return null;
          const activeProblems = active.filter((item) => item.classId === course.id);
          return (
            <ListRow
              preserveTrailingWidth
              key={course.id}
              leading={<IndexChip tone={tone}>{course.code.split("-")[0]}</IndexChip>}
              title={course.title} subtitle={course.term}
              onClick={() => navigate(`/professor/classes?course=${encodeURIComponent(course.id)}`)}
              trailing={
                <>
                  <span className="w-24"><small className="block text-sm leading-5 text-fg-secondary">수강생</small><b className="text-base leading-6">{course.count}명</b></span>
                  <span className="w-28"><small className="block text-sm leading-5 text-fg-secondary">진행 중 과제</small><b className="text-base leading-6">{activeProblems.length ? `${activeProblems.length}개` : "없음"}</b></span>
                  <span className="flex items-center gap-3"><small className="text-sm leading-5 text-fg-secondary">제출률</small><span className="grid w-14 place-items-center">{activeProblems.length ? <ProgressRing percent={submissionRate(activeProblems)} /> : "—"}</span></span>
                </>
              }
            />
          );
        })}
      </Card>

      <Card
        padding="table" title="채점 현황" subtitle="점수가 공개되지 않은 과제 기준입니다."
        action={
          <div className="flex items-center gap-5">
            <Badge tone="flag">FLAG 검토 {pendingCount}건</Badge>
            <button type="button" className={linkButton} onClick={() => navigate("/professor/review")}>채점 검토<ArrowRight size={18} strokeWidth={1.75} /></button>
          </div>
        }
      >
        <DataTable
          rows={gradingTasks} rowKey={(task) => task.id} onRowClick={(task) => navigate(`/professor/review?${new URLSearchParams({ assignment: task.editKey ?? "" })}`)}
          columns={[
            { key: "title", header: "과제", render: (task) => <><strong className="block text-fg">{task.title}</strong><small className="text-sm text-fg-secondary">{task.course}</small></> },
            { key: "due", header: "마감", render: (task) => <Badge tone="flag">{task.due}</Badge> },
            { key: "submitted", header: "제출", render: (task) => <><strong className="text-fg">{task.submitted}</strong><span className="text-fg-secondary"> / {task.total}</span></> },
            { key: "graded", header: "채점 완료", render: (task) => <strong className="text-success-fg">{task.graded}건</strong> },
            { key: "grading", header: "채점 중", render: (task) => <Badge tone="info">{task.grading}건</Badge> },
            { key: "flags", header: "FLAG", render: (task) => <Badge tone="flag">{task.pending}건</Badge> },
          ]}
        />
        <div className="px-[30px] py-5"><Banner type="info" icon={<Clock size={22} strokeWidth={1.75} />}>점수 공개 후에는 이 현황에서 제외되며 점수 공개 화면에서 확인할 수 있습니다.</Banner></div>
      </Card>
    </ProfessorLayout>
  );
}
