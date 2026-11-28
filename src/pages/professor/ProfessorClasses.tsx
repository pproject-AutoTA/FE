import { ASSIGNMENT_STATUS_LABEL } from "./professorAssignments";
import { ROUTES } from "../../routes";
import { ApiError, errorMessage } from "../../api/client";
import { useEffect, useRef, useState } from "react";
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
  DateTimePicker,
  EmptyState,
  ErrorMessage,
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
  formatAssignmentDeadline,
  getAssignmentStatus,
  mergeCourseAssignments,
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
  toProfessorClass,
  toProfessorClasses,
  type ClassInfo,
} from "./professorClassData";
import { COURSE_SEMESTER_PATTERN, createProfessorCourse, fetchMyCourses } from "./professorCoursesApi";
import { DEMO_COURSE_IDS } from "../../mocks/professor";
import {
  createProfessorAssignment,
  fetchCourseAssignments,
  type CourseAssignment,
} from "./professorCourseAssignmentsApi";

const STATUS_TONE = {
  PUBLISHED: "success",
  SCHEDULED: "info",
  CLOSED: "neutral",
} as const satisfies Record<AssignmentState, "success" | "info" | "neutral">;
const useCourseApi = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_BASE_URL?.trim());

const randomPart = (length: number) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .toUpperCase();

export function ProfessorClasses() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState<ClassInfo[]>(() =>
    useCourseApi ? [] : readProfessorClasses(),
  );
  const [loadState, setLoadState] = useState<
    { status: "loading" | "ready" } | { status: "error"; message: string }
  >({ status: useCourseApi ? "loading" : "ready" });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!useCourseApi) return;

    const controller = new AbortController();
    void fetchMyCourses(controller.signal)
      .then((courses) => {
        if (controller.signal.aborted) return;
        setClasses(toProfessorClasses(courses));
        setLoadState({ status: "ready" });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadState({
          status: "error",
          message: errorMessage(error, "수업 목록을 불러오지 못했어요."),
        });
      });
    return () => controller.abort();
  }, [loadAttempt]);
  const courseId = searchParams.get("course");
  const legacyIndex = Number(searchParams.get("class") ?? -1);
  const selected = courseId ? classes.findIndex((course) => course.id === courseId) : legacyIndex;
  const detailTab = searchParams.get("tab") === "students" ? "students" : "assignments";
  const [query, setQuery] = useState("");
  const [assignmentSort, setAssignmentSort] = useState(ASSIGNMENT_SORT_OPTIONS[0].value);
  const [showNew, setShowNew] = useState(false);
  const [showReissue, setShowReissue] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [courseErrors, setCourseErrors] = useState<{ name?: string; semester?: string; form?: string }>({});
  const [creatingCourse, setCreatingCourse] = useState(false);
  const creatingCourseRef = useRef(false);
  const current = classes[selected];
  const [allAssignments] = useState(readProfessorAssignments);
  const numericCourseId = useCourseApi && current
    ? (/^\d+$/.test(current.id)
      ? Number(current.id)
      : [...DEMO_COURSE_IDS].find(([, demoId]) => demoId === current.id)?.[0])
    : undefined;
  const [assignmentAttempt, setAssignmentAttempt] = useState(0);
  const [showAssignmentCreation, setShowAssignmentCreation] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDueAt, setAssignmentDueAt] = useState("");
  const [assignmentCreationError, setAssignmentCreationError] = useState("");
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<
    | { courseId: number; attempt: number; data: CourseAssignment[] }
    | { courseId: number; attempt: number; error: string }
  >();

  useEffect(() => {
    if (numericCourseId === undefined) return;

    const controller = new AbortController();
    const request = { courseId: numericCourseId, attempt: assignmentAttempt };
    void fetchCourseAssignments(numericCourseId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAssignmentResult({ ...request, data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setAssignmentResult({
          ...request,
          error: errorMessage(error, "과제 목록을 불러오지 못했어요."),
        });
      });
    return () => controller.abort();
  }, [numericCourseId, assignmentAttempt]);

  const result =
    assignmentResult?.courseId === numericCourseId &&
    assignmentResult?.attempt === assignmentAttempt
      ? assignmentResult
      : undefined;
  const assignmentsLoading = numericCourseId !== undefined && !result;
  const assignmentsError = result && "error" in result ? result.error : undefined;
  const apiAssignments = result && "data" in result ? result.data : [];
  const courseAssignments =
    numericCourseId === undefined
      ? allAssignments.filter((item) => item.classId === current?.id)
      : current && result && "data" in result
        ? mergeCourseAssignments(current.id, result.data, allAssignments)
        : [];
  const now = useAssignmentClock(courseAssignments);
  const assignments = courseAssignments.map((item) => ({
    ...item,
    status: getAssignmentStatus(item, now),
  }));
  const assignmentKey = searchParams.get("assignment");
  const detailAssignmentId = searchParams.get("assignmentId");
  const requestedProblemId = searchParams.get("problem");
  const detailAssignment = assignments.find((item) =>
    detailAssignmentId
      ? String(item.id) === detailAssignmentId
      : assignmentKey && item.editKey === assignmentKey,
  );

  const createAssignment = async () => {
    if (numericCourseId === undefined || creatingAssignment) return;
    const dueAt = Date.parse(assignmentDueAt);
    if (!assignmentTitle.trim() || !(dueAt > Date.now())) {
      setAssignmentCreationError("과제명을 입력하고 마감 시각을 현재 시각 이후로 설정해주세요.");
      return;
    }
    setCreatingAssignment(true);
    try {
      const assignment = await createProfessorAssignment(numericCourseId, {
        title: assignmentTitle.trim(),
        dueAt: new Date(dueAt).toISOString(),
      });
      setShowAssignmentCreation(false);
      setAssignmentAttempt((attempt) => attempt + 1);
      if (current) setSearchParams({ course: current.id, assignmentId: String(assignment.id) });
      toast("success", "과제를 만들었어요.");
    } catch (error) {
      const reasons = error instanceof ApiError ? error.errors?.map(({ reason }) => reason) : [];
      setAssignmentCreationError(reasons?.length ? reasons.join(" ") : errorMessage(error));
    } finally {
      setCreatingAssignment(false);
    }
  };

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
    setCourseErrors({});
    setNewTerm("");
  };
  const createClass = async () => {
    if (creatingCourseRef.current) return;
    const name = newName.trim();
    const semester = newTerm.trim();
    const nameError = name.length < 1 || name.length > 50 ? "수업명은 1~50자로 입력해주세요." : undefined;
    const semesterError = COURSE_SEMESTER_PATTERN.test(semester)
      ? undefined
      : "학기를 YYYY-N 형식으로 입력해주세요.";
    if (nameError || semesterError) {
      setCourseErrors({ name: nameError, semester: semesterError });
      return;
    }
    setCourseErrors({});
    creatingCourseRef.current = true;
    setCreatingCourse(true);
    try {
      const course = toProfessorClass(await createProfessorCourse({ name, semester }), []);
      setClasses((previous) => [...previous.filter((item) => item.id !== course.id), course]);
      closeNew();
      setSearchParams({ course: course.id });
      toast("success", "새 수업을 만들었어요.");
    } catch (error) {
      const fields = error instanceof ApiError ? error.errors : null;
      const name = fields?.find((field) => field.field === "name")?.reason;
      const semester = fields?.find((field) => field.field === "semester")?.reason;
      setCourseErrors({ name, semester, form: name || semester ? undefined : errorMessage(error) });
    } finally {
      creatingCourseRef.current = false;
      setCreatingCourse(false);
    }
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
      {current && (assignmentKey || detailAssignmentId) && !assignmentsLoading && !assignmentsError ? (
        <ClassAssignmentDetails
          key={JSON.stringify([current.id, assignmentKey, detailAssignmentId, requestedProblemId])}
          assignment={detailAssignment}
          initialProblemId={requestedProblemId ? Number(requestedProblemId) : undefined}
          problems={apiAssignments.find((item) => item.id === detailAssignment?.id)?.problems}
          reviewPath={
            detailAssignment?.editKey && detailAssignment.status === "PUBLISHED"
              ? `${ROUTES.professorReview}?${new URLSearchParams({
                  course: current.id,
                  assignment: detailAssignment.editKey,
                })}`
              : undefined
          }
          problemRegistrationPath={
            detailAssignment && apiAssignments.some((item) => item.id === detailAssignment.id)
              ? `${ROUTES.professorProblemNew}?${new URLSearchParams({
                  course: current.id,
                  assignmentId: String(detailAssignment.id),
                })}`
              : undefined
          }
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
                  disabled={!useCourseApi || loadState.status !== "ready"}
                  onClick={() => setShowNew(true)}
                >
                  새 수업 만들기
                </Button>
              )
            }
          />

          {loadState.status === "loading" ? (
            <Card>
              <p role="status" className="text-sm text-fg-secondary">
                수업 목록을 불러오는 중이에요.
              </p>
            </Card>
          ) : loadState.status === "error" ? (
            <Card>
              <div className="flex flex-col items-start gap-3">
                <ErrorMessage>{loadState.message}</ErrorMessage>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setLoadState({ status: "loading" });
                    setLoadAttempt((attempt) => attempt + 1);
                  }}
                >
                  다시 시도
                </Button>
              </div>
            </Card>
          ) : !current ? (
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
                    title={keyword ? "검색 결과가 없어요" : "등록된 수업이 없어요"}
                    description={
                      keyword ? "다른 수업 이름이나 코드로 검색해 보세요." : undefined
                    }
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
                  {
                    value: "assignments",
                    label: "과제",
                    count: assignmentsLoading || assignmentsError ? undefined : assignments.length,
                  },
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
                      disabled={numericCourseId === undefined}
                      onClick={() => {
                        setAssignmentTitle("");
                        setAssignmentDueAt("");
                        setAssignmentCreationError("");
                        setShowAssignmentCreation(true);
                      }}
                    >
                      과제 등록
                    </Button>
                  }
                >
                  {assignmentsLoading ? (
                    <p role="status" className="px-5 py-4 text-sm text-fg-secondary">
                      과제 목록을 불러오는 중이에요.
                    </p>
                  ) : assignmentsError ? (
                    <div className="flex flex-col items-start gap-3 px-5 py-4">
                      <ErrorMessage>{assignmentsError}</ErrorMessage>
                      <Button
                        variant="secondary"
                        onClick={() => setAssignmentAttempt((attempt) => attempt + 1)}
                      >
                        다시 시도
                      </Button>
                    </div>
                  ) : (
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
                          if (apiAssignments.some((item) => item.id === assignment.id)) {
                            setSearchParams({ course: current.id, assignmentId: String(assignment.id) });
                            return;
                          }
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
                        {
                          key: "deadline",
                          header: "마감",
                          render: (item) => formatAssignmentDeadline(item.deadline, now),
                        },
                        {
                          key: "submitted",
                          header: "제출 수",
                          render: (item) => {
                            const api = apiAssignments.find((record) => record.id === item.id);
                            if (!api) return `${item.submitted} / ${item.total}`;
                            if (!api.problems.length) return "집계 없음";
                            return api.problems.map((problem) => (
                              <div key={problem.id}>
                                {api.problems.length > 1 && <span>{problem.title} · </span>}
                                {problem.submittedStudentCount ?? "–"} / {api.studentCount ?? "–"}
                              </div>
                            ));
                          },
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
                  )}
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
        onClose={() => {
          if (!creatingCourseRef.current) closeNew();
        }}
        title="새 수업 만들기"
        description="수업 기본 정보를 입력하세요."
        footer={
          <>
            <Button variant="secondary" disabled={creatingCourse} onClick={closeNew}>
              취소
            </Button>
            <Button loading={creatingCourse} onClick={() => void createClass()}>
              수업 만들기
            </Button>
          </>
        }
      >
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            void createClass();
          }}
        >
          <FormField
            label="수업명"
            placeholder="예: 자료구조"
            autoFocus
            value={newName}
            error={courseErrors.name}
            disabled={creatingCourse}
            onChange={(e) => {
              setNewName(e.target.value);
              setCourseErrors((errors) => ({ ...errors, name: undefined, form: undefined }));
            }}
          />
          <FormField
            label="학기"
            placeholder="예: 2026-2"
            value={newTerm}
            error={courseErrors.semester}
            disabled={creatingCourse}
            onChange={(e) => {
              setNewTerm(e.target.value);
              setCourseErrors((errors) => ({ ...errors, semester: undefined, form: undefined }));
            }}
          />
          {courseErrors.form && <ErrorMessage>{courseErrors.form}</ErrorMessage>}
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
      <Modal
        open={showAssignmentCreation}
        title="과제 등록"
        onClose={() => {
          if (!creatingAssignment) setShowAssignmentCreation(false);
        }}
        footer={
          <Button loading={creatingAssignment} onClick={() => void createAssignment()}>
            과제 만들기
          </Button>
        }
      >
        <div className="grid gap-4">
          <FormField label="과제명" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} />
          <DateTimePicker label="마감 시각" value={assignmentDueAt} onChange={setAssignmentDueAt} />
          {assignmentCreationError && <ErrorMessage>{assignmentCreationError}</ErrorMessage>}
        </div>
      </Modal>
    </ProfessorLayout>
  );
}
