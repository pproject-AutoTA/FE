import { ASSIGNMENT_STATUS_LABEL } from "./professorAssignments";
import { ROUTES } from "../../routes";
import { useState } from "react";
import { ArrowLeft, Code2, Flag, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ProfessorLayout,
  Badge,
  Banner,
  Button,
  Card,
  ClassCodeBox,
  ConfirmModal,
  DataTable,
  EmptyState,
  FormField,
  Modal,
  PageHeader,
  Pagination,
  Select,
  Tabs,
  Toggle,
  useToast,
} from "../../components";
import { ClassAssignmentDetails } from "./ClassAssignmentDetails";
import {
  ASSIGNMENT_SORT_OPTIONS,
  getAssignmentStatus,
  readProfessorAssignments,
  sortAssignments,
  useAssignmentClock,
  type AssignmentState,
} from "./professorAssignments";
import { usePagination } from "./usePagination";
import {
  getMockClassStudent,
  readProfessorClasses,
  saveProfessorClasses,
  type ClassInfo,
} from "./professorClassData";

const TERMS = [
  { value: "2026년 2학기", label: "2026년 2학기" },
  { value: "2026년 겨울학기", label: "2026년 겨울학기" },
];
const STATUS_TONE = {
  PUBLISHED: "success",
  SCHEDULED: "info",
  CLOSED: "neutral",
} as const satisfies Record<AssignmentState, "success" | "info" | "neutral">;

const randomPart = (length: number) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .toUpperCase();

export function ProfessorClasses() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState(readProfessorClasses);
  const courseId = searchParams.get("course");
  const legacyIndex = Number(searchParams.get("class") ?? -1);
  const selected = courseId ? classes.findIndex((course) => course.id === courseId) : legacyIndex;
  const detailTab = searchParams.get("tab") === "students" ? "students" : "assignments";
  const [query, setQuery] = useState("");
  const [assignmentSort, setAssignmentSort] = useState(ASSIGNMENT_SORT_OPTIONS[0].value);
  const [showNew, setShowNew] = useState(false);
  const [showReissue, setShowReissue] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNameError, setNewNameError] = useState("");
  const [newTerm, setNewTerm] = useState(TERMS[0].value);
  const current = classes[selected];
  const [allAssignments] = useState(readProfessorAssignments);
  const now = useAssignmentClock(allAssignments);
  const assignments = allAssignments
    .filter((item) => item.classId === current?.id)
    .map((item) => ({ ...item, status: getAssignmentStatus(item, now) }));
  const assignmentKey = searchParams.get("assignment");

  const updateClasses = (nextClasses: ClassInfo[]) => {
    try {
      saveProfessorClasses(nextClasses);
    } catch {
      toast("error", "수업을 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.");
      return false;
    }
    setClasses(nextClasses);
    return true;
  };
  const toggleOpen = () => {
    if (current)
      updateClasses(
        classes.map((item, i) => (i === selected ? { ...item, open: !item.open } : item)),
      );
  };
  const reissue = () => {
    if (!current) return;
    const code = `${current.code.slice(0, 2)}-${randomPart(4)}-${randomPart(2)}`;
    if (updateClasses(classes.map((item, i) => (i === selected ? { ...item, code } : item))))
      toast("success", "새 참여 코드를 발급했어요.");
    setShowReissue(false);
  };
  const closeNew = () => {
    setShowNew(false);
    setNewName("");
    setNewNameError("");
    setNewTerm(TERMS[0].value);
  };
  const createClass = () => {
    const title = newName.trim();
    if (!title) {
      setNewNameError("수업명을 입력해주세요");
      return;
    }
    const next: ClassInfo = {
      id: `local-${classes.length}`,
      title,
      term: newTerm,
      count: 0,
      code: `CL-${randomPart(4)}-${randomPart(2)}`,
      open: true,
    };
    if (!updateClasses([...classes, next])) return;
    closeNew();
    toast("success", "새 수업을 만들었어요.");
  };
  const keyword = query.trim().toLowerCase();
  const filteredClasses = classes.filter(
    (item) =>
      item.title.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword),
  );
  const students = current
    ? Array.from({ length: current.count }, (_, index) => ({
        no: index + 1,
        ...getMockClassStudent(current.id, index),
      }))
    : [];
  const classPager = usePagination(filteredClasses, 5, keyword, true);
  const assignmentPager = usePagination(
    sortAssignments(assignments, assignmentSort),
    5,
    JSON.stringify([current?.id, assignmentSort]),
    true,
  );
  const studentPager = usePagination(students, 10, current?.id, true);

  return (
    <ProfessorLayout onSearch={setQuery} searchPlaceholder="수업 이름 또는 코드 검색">
      {current && assignmentKey ? (
        <ClassAssignmentDetails
          assignment={assignments.find((item) => item.editKey === assignmentKey)}
          listPath={`${ROUTES.professorClasses}?course=${encodeURIComponent(current.id)}`}
        />
      ) : (
        <>
          <PageHeader
            responsive
            eyebrow="PROFESSOR · CLASSES"
            title={current ? current.title : "수업 관리"}
            description={
              current
                ? `${current.term} 수업 정보와 과제·수강생을 확인하세요.`
                : "내 수업을 선택해 상세 정보와 수강생을 확인하세요."
            }
            actions={
              current ? (
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={24} strokeWidth={1.75} />}
                  onClick={() => navigate(ROUTES.professorClasses)}
                >
                  내 수업 목록
                </Button>
              ) : (
                <Button
                  icon={<Plus size={24} strokeWidth={1.75} />}
                  onClick={() => setShowNew(true)}
                >
                  새 수업 만들기
                </Button>
              )
            }
          />

          {!current ? (
            <Card
              padding="table"
              title="내 수업"
              subtitle="관리할 수업을 선택하면 상세 정보로 이동해요."
              action={<Badge tone="info">{classes.length}개</Badge>}
            >
              <DataTable<ClassInfo>
                horizontalScroll
                keyboardNavigation
                rows={classPager.items}
                rowKey={(item) => item.id}
                onRowClick={(item) => setSearchParams({ course: item.id })}
                empty={
                  <EmptyState
                    title="검색 결과가 없어요"
                    description="다른 수업 이름이나 코드로 검색해 보세요."
                  />
                }
                columns={[
                  {
                    key: "title",
                    header: "수업",
                    render: (item) => <strong className="text-fg">{item.title}</strong>,
                  },
                  { key: "term", header: "학기" },
                  {
                    key: "count",
                    header: "수강생",
                    render: (item) => <strong className="text-fg">{item.count}명</strong>,
                  },
                  {
                    key: "code",
                    header: "수업 코드",
                    render: (item) => (
                      <span className="font-mono tracking-[.04em]">{item.code}</span>
                    ),
                  },
                  {
                    key: "open",
                    header: "신규 참여",
                    render: (item) => (
                      <Badge tone={item.open ? "success" : "neutral"}>
                        {item.open ? "열림" : "닫힘"}
                      </Badge>
                    ),
                  },
                ]}
              />
              {classPager.show && (
                <Pagination
                  page={classPager.page}
                  pageCount={classPager.pageCount}
                  onChange={classPager.setPage}
                  summary={classPager.summary}
                />
              )}
            </Card>
          ) : (
            <>
              <Card
                icon={<Code2 size={24} strokeWidth={1.75} />}
                title="수업 상세 정보"
                subtitle={`${current.term} · ${current.count}명 참여 중`}
                action={
                  <Badge tone={current.open ? "info" : "neutral"} large>
                    {current.open ? "참여 열림" : "참여 닫힘"}
                  </Badge>
                }
              >
                <div className="grid grid-cols-[1fr_1fr] gap-8">
                  <div>
                    <p className="m-0 mb-3 text-[15px] leading-5 font-bold">학생 참여 코드</p>
                    <ClassCodeBox
                      code={current.code}
                      onCopy={() => toast("success", "수업 코드를 복사했어요.")}
                      onReissue={() => setShowReissue(true)}
                    />
                    <p className="m-0 mt-3.5 text-sm leading-5 text-fg-secondary">
                      학생에게 이 코드를 전달해 수업에 참여하도록 안내하세요.
                    </p>
                  </div>
                  <div className="grid content-start gap-5">
                    <div className="[&>label]:flex-row-reverse">
                      <Toggle checked={current.open} onChange={toggleOpen} label="신규 참여 허용" />
                      <p className="m-0 mt-2 text-sm leading-5 text-fg-secondary">
                        {current.open
                          ? "새로운 학생은 코드로 참여할 수 있어요."
                          : "현재 신규 학생의 참여가 닫혀 있어요."}
                      </p>
                    </div>
                    <Banner type="warning" icon={<Flag size={24} strokeWidth={1.75} />}>
                      재발급하면 이전 코드는 참여할 수 없어요. 이미 참여한 학생은 그대로 유지돼요.
                    </Banner>
                  </div>
                </div>
              </Card>

              <Tabs
                variant="line"
                active={detailTab}
                onChange={(tab) => setSearchParams({ course: current.id, tab }, { replace: true })}
                items={[
                  { value: "assignments", label: "과제", count: assignments.length },
                  { value: "students", label: "수강생", count: current.count },
                ]}
              />

              {detailTab === "assignments" && (
                <div className="self-end w-52">
                  <Select
                    label="과제 정렬"
                    value={assignmentSort}
                    onChange={setAssignmentSort}
                    options={ASSIGNMENT_SORT_OPTIONS}
                  />
                </div>
              )}
              {detailTab === "assignments" ? (
                <Card
                  padding="table"
                  title="과제 목록"
                  subtitle="과제를 선택하면 상세 정보와 제출 현황을 볼 수 있어요."
                  action={
                    <Button
                      size="sm"
                      icon={<Plus size={24} strokeWidth={1.75} />}
                      onClick={() =>
                        navigate(
                          `${ROUTES.professorProblemNew}?course=${encodeURIComponent(current.id)}`,
                        )
                      }
                    >
                      과제 등록
                    </Button>
                  }
                >
                  <DataTable
                    horizontalScroll
                    keyboardNavigation
                    rows={assignmentPager.items}
                    rowKey={(item) => item.id}
                    empty={
                      <EmptyState
                        title="등록된 과제가 없어요"
                        description="과제 등록 버튼으로 첫 과제를 만들어 보세요."
                      />
                    }
                    onRowClick={(assignment) => {
                      if (!assignment.editKey) return;
                      const params = { course: current.id, assignment: assignment.editKey };
                      if (assignment.status === "PUBLISHED")
                        navigate(`${ROUTES.professorReview}?${new URLSearchParams(params)}`);
                      else setSearchParams(params);
                    }}
                    columns={[
                      {
                        key: "title",
                        header: "과제",
                        render: (item) => <strong className="text-fg">{item.title}</strong>,
                      },
                      { key: "due", header: "마감" },
                      {
                        key: "submitted",
                        header: "제출 수",
                        render: (item) => (
                          <>
                            {item.submitted} / {item.total}
                          </>
                        ),
                      },
                      {
                        key: "status",
                        header: "상태",
                        render: (item) => (
                          <Badge tone={STATUS_TONE[item.status]}>
                            {ASSIGNMENT_STATUS_LABEL[item.status]}
                          </Badge>
                        ),
                      },
                    ]}
                  />
                  {assignmentPager.show && (
                    <Pagination
                      page={assignmentPager.page}
                      pageCount={assignmentPager.pageCount}
                      onChange={assignmentPager.setPage}
                      summary={assignmentPager.summary}
                    />
                  )}
                </Card>
              ) : (
                <Card
                  padding="table"
                  title="수강생 목록"
                  subtitle="현재 이 수업에 참여하고 있는 학생입니다."
                  action={<Badge tone="info">총 {current.count}명</Badge>}
                >
                  <DataTable
                    horizontalScroll
                    keyboardNavigation
                    rows={studentPager.items}
                    rowKey={(student) => student.studentId}
                    empty={
                      <EmptyState
                        title="등록된 수강생이 없어요"
                        description="학생이 수업 코드로 참여하면 이곳에 표시돼요."
                      />
                    }
                    columns={[
                      { key: "no", header: "번호" },
                      { key: "department", header: "학과" },
                      { key: "studentId", header: "학번" },
                      {
                        key: "name",
                        header: "이름",
                        render: (student) => <strong className="text-fg">{student.name}</strong>,
                      },
                    ]}
                  />
                  {studentPager.show && (
                    <Pagination
                      page={studentPager.page}
                      pageCount={studentPager.pageCount}
                      onChange={studentPager.setPage}
                      summary={studentPager.summary}
                    />
                  )}
                </Card>
              )}
            </>
          )}
        </>
      )}

      <Modal
        open={showNew}
        onClose={closeNew}
        title="새 수업 만들기"
        description="수업 기본 정보를 입력하세요."
        footer={
          <>
            <Button variant="secondary" onClick={closeNew}>
              취소
            </Button>
            <Button onClick={createClass}>수업 만들기</Button>
          </>
        }
      >
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            createClass();
          }}
        >
          <FormField
            label="수업명"
            placeholder="예: 자료구조"
            autoFocus
            value={newName}
            error={newNameError}
            onChange={(e) => {
              setNewName(e.target.value);
              setNewNameError("");
            }}
          />
          <Select label="학기" value={newTerm} onChange={setNewTerm} options={TERMS} />
        </form>
      </Modal>
      <ConfirmModal
        role="dialog"
        open={showReissue}
        title="수업 코드를 재발급할까요?"
        description={
          "재발급하면 이전 코드는 참여할 수 없어요.\n이미 참여한 학생은 그대로 유지돼요."
        }
        confirmLabel="코드 재발급"
        onCancel={() => setShowReissue(false)}
        onConfirm={reissue}
      />
    </ProfessorLayout>
  );
}
