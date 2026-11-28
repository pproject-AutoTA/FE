import { ROUTES } from "../../routes";
import { readResourceDefaults } from "../../resourcePolicy";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, BookOpen, FlaskConical, Plus, ShieldCheck } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ProfessorLayout,
  Badge,
  Banner,
  Button,
  Card,
  ConfirmModal,
  EmptyState,
  ErrorMessage,
  FormField,
  Modal,
  PageHeader,
  Select,
  ProgressStepper,
  Toggle,
  useToast,
} from "../../components";
import {
  formatAssignmentDeadline,
  readEditableProblem,
  readProfessorDrafts,
} from "./professorAssignments";
import { readProfessorClasses } from "./professorClassData";
import { InspectionPolicyEditor } from "./InspectionPolicyEditor";
import { saveProblem, type InspectionPolicy, type TestCase } from "./savedProblems";
import { ApiError, errorMessage } from "../../api/client";
import { DEMO_COURSE_IDS } from "../../mocks/professor";
import { fetchMyCourses, type Course } from "./professorCoursesApi";
import { fetchCourseAssignments, type CourseAssignment } from "./professorCourseAssignmentsApi";
import {
  registerProfessorProblem,
  validateProblemRegistration,
  type RegisterProblemBody,
} from "./professorProblemRegistrationApi";

const STEPS = [
  { title: "문제 입력", description: "문제와 실행 조건", icon: BookOpen },
  { title: "테스트케이스 설정", description: "입력과 출력 예제", icon: FlaskConical },
  { title: "정책 설정", description: "제출·공개 및 검사 정책", icon: ShieldCheck },
];
const STEP_DESCRIPTION = [
  "과제 내용과 실행 조건을 입력하세요.",
  "채점에 사용할 테스트케이스를 등록하세요.",
  "과제의 제출·공개 및 검사 정책을 설정하세요.",
];

export function ProblemEditor() {
  const { problemKey } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const editStep = section === "cases" ? 1 : section === "policy" ? 2 : 0;
  const courseId = searchParams.get("course");
  const assignmentId = searchParams.get("assignmentId");
  const draftKey = problemKey ? null : searchParams.get("draft");
  return (
    <ProblemEditorForm
      key={JSON.stringify([problemKey, editStep, courseId, assignmentId, draftKey])}
      problemKey={problemKey}
      draftKey={draftKey}
      editStep={editStep}
      courseId={courseId}
      assignmentId={assignmentId}
    />
  );
}

function PolicyRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 border-b border-border py-5 first:pt-0 last:border-b-0">
      <div>
        <strong className="block text-base leading-6 font-bold text-fg">{title}</strong>
        <span className="block text-sm leading-5 text-fg-secondary">{description}</span>
      </div>
      <div className="flex-none [&>label]:flex-row-reverse">{children}</div>
    </div>
  );
}

function ProblemEditorForm({
  problemKey,
  draftKey,
  editStep,
  courseId,
  assignmentId,
}: {
  problemKey?: string;
  draftKey: string | null;
  editStep: number;
  courseId: string | null;
  assignmentId: string | null;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [entry] = useState(() => {
    try {
      const key = problemKey ?? draftKey;
      const found = key ? readEditableProblem(key) : undefined;
      if (
        draftKey &&
        (found?.problem.status !== "DRAFT" || (courseId && found.problem.classId !== courseId))
      )
        return undefined;
      return found;
    } catch {
      return undefined;
    }
  });
  const original = entry?.problem;
  const editingAssignment = Boolean(original && original.status !== "DRAFT");
  const linkedCourseId = original ? original.classId : courseId;
  const course = readProfessorClasses().find((item) => item.id === linkedCourseId);
  const returnPath =
    !editingAssignment && course
      ? `${ROUTES.professorClasses}?course=${encodeURIComponent(course.id)}&tab=assignments`
      : ROUTES.professorProblems;
  const [title, setTitle] = useState(original?.title ?? "");
  const [description, setDescription] = useState(original?.description ?? "");
  const [inputFormat, setInputFormat] = useState(original?.inputFormat ?? "");
  const [outputFormat, setOutputFormat] = useState(original?.outputFormat ?? "");
  const [resourceDefaults] = useState(readResourceDefaults);
  const [timeLimit, setTimeLimit] = useState(
    original?.timeLimit ?? String(resourceDefaults.timeSeconds),
  );
  const [memoryLimit, setMemoryLimit] = useState(
    original?.memoryLimit ?? String(resourceDefaults.memoryMb),
  );
  const [resubmission, setResubmission] = useState(original?.resubmission ?? true);
  const [trackLeave, setTrackLeave] = useState(original?.trackLeave ?? false);
  const [inspectionPolicy, setInspectionPolicy] = useState<InspectionPolicy>(
    original?.inspectionPolicy ?? {
      mode: "deny",
      deniedTags: [],
      allowedTags: [],
      requiredTags: [],
    },
  );
  const [step, setStep] = useState(editStep);
  const [testCases, setTestCases] = useState<TestCase[]>(original?.testCases ?? []);
  const [nextCaseId, setNextCaseId] = useState(
    () => Math.max(0, ...(original?.testCases ?? []).map((item) => item.id)) + 1,
  );
  const [saved, setSaved] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const drafts = showDrafts ? readProfessorDrafts(courseId) : [];
  const [showErrors, setShowErrors] = useState(false);
  const registering = !editingAssignment && !problemKey;
  const canSaveDemoPolicy = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL?.trim();
  const [courses, setCourses] = useState<Course[]>([]);
  const [targetCourse, setTargetCourse] = useState(() => {
    if (!linkedCourseId) return "";
    return [...DEMO_COURSE_IDS]
      .find(([, id]) => id === linkedCourseId)?.[0].toString() ?? linkedCourseId;
  });
  const [targetAssignment, setTargetAssignment] = useState(assignmentId ?? "");
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [coursesError, setCoursesError] = useState("");
  const [assignmentsError, setAssignmentsError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [pendingRegistration, setPendingRegistration] = useState<RegisterProblemBody>();
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!registering) return;
    const controller = new AbortController();
    void fetchMyCourses(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setCourses(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setCoursesError(errorMessage(error));
      });
    return () => controller.abort();
  }, [registering]);

  useEffect(() => {
    if (!registering || !courses.some((item) => String(item.id) === targetCourse)) return;
    const controller = new AbortController();
    void fetchCourseAssignments(Number(targetCourse), controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAssignments(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setAssignmentsError(errorMessage(error));
      });
    return () => controller.abort();
  }, [registering, courses, targetCourse]);

  const selectedAssignment = assignments.find((item) => String(item.id) === targetAssignment);
  const prepareRegistration = () => {
    setRegistrationError("");
    if (!selectedAssignment) {
      setRegistrationError("문제를 등록할 과제를 선택해주세요.");
      setStep(0);
      return;
    }
    const body: RegisterProblemBody = {
      title: title.trim(),
      description,
      inputFormat,
      outputFormat,
      timeLimitMs: Math.round(Number(timeLimit) * 1000),
      memoryLimitMb: Number(memoryLimit),
      resubmitAllowed: resubmission,
      testcases: testCases.map(({ input, expectedOutput, visibility }) => ({
        input,
        expectedOutput,
        isPublic: visibility === "public",
      })),
    };
    const [error] = validateProblemRegistration(body);
    if (error) {
      setRegistrationError(error.reason);
      setStep(error.field.startsWith("testcases") ? 1 : 0);
      return;
    }
    setPendingRegistration(body);
  };

  const submitRegistration = async () => {
    if (!selectedAssignment || !pendingRegistration || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const problem = await registerProfessorProblem(
        selectedAssignment.id,
        pendingRegistration,
        canSaveDemoPolicy ? inspectionPolicy : undefined,
      );
      setPendingRegistration(undefined);
      toast("success", "문제를 등록했어요.");
      const classId = canSaveDemoPolicy
        ? (DEMO_COURSE_IDS.get(Number(targetCourse)) ?? targetCourse)
        : targetCourse;
      const params = new URLSearchParams({
        course: classId,
        assignmentId: String(problem.assignmentId),
        problem: String(problem.id),
      });
      navigate(`${ROUTES.professorClasses}?${params}`, { replace: true });
    } catch (error) {
      const details = error instanceof ApiError ? error.errors?.map((item) => item.reason) : [];
      setRegistrationError(details?.length ? details.join(" ") : errorMessage(error));
      setPendingRegistration(undefined);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };
  const titleError = showErrors && !title.trim() ? "과제 제목을 입력해주세요" : undefined;
  const descriptionError =
    showErrors && !description.trim() ? "과제 설명을 입력해주세요" : undefined;

  const addTestCase = () => {
    setTestCases((cases) => [
      ...cases,
      { id: nextCaseId, input: "", expectedOutput: "", visibility: "private" },
    ]);
    setNextCaseId((id) => id + 1);
  };
  const updateTestCase = (id: number, changes: Partial<Omit<TestCase, "id">>) => {
    setTestCases((cases) =>
      cases.map((testCase) => (testCase.id === id ? { ...testCase, ...changes } : testCase)),
    );
  };
  const validateProblem = () => {
    if (!title.trim() || !description.trim()) {
      setShowErrors(true);
      toast("error", "과제 제목과 설명을 입력해주세요.");
      return false;
    }
    return true;
  };
  const nextStep = () => {
    if (step === 0 && !validateProblem()) return;
    setStep(step + 1);
  };
  const saveLocal = () => {
    if (saved) return;
    if (linkedCourseId && !course) {
      toast("error", "등록할 수업을 찾지 못했어요.");
      return;
    }
    if (!validateProblem()) {
      if (step !== 0) setStep(0);
      return;
    }
    try {
      saveProblem(
        {
          sampleId: original?.sampleId,
          classId: original ? original.classId : course?.id,
          title: title.trim(),
          description,
          inputFormat,
          outputFormat,
          timeLimit,
          memoryLimit,
          deadline: original?.deadline ?? "",
          resubmission,
          trackLeave,
          testCases,
          inspectionPolicy,
          status: original?.status ?? "DRAFT",
          publishAt: original?.publishAt,
        },
        entry?.index,
      );
    } catch {
      toast("error", "문제를 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.");
      return;
    }
    setSaved(true);
    toast(
      "success",
      editingAssignment ? "변경사항을 저장했어요." : "문제를 초안으로 저장했어요.",
    );
    window.setTimeout(() => navigate(returnPath), 900);
  };

  if ((problemKey || draftKey) && !original) {
    return (
      <ProfessorLayout>
        <Card>
          <EmptyState
            title="문제를 찾지 못했어요"
            action={
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(
                    draftKey
                      ? `${ROUTES.professorProblemNew}${courseId ? `?course=${encodeURIComponent(courseId)}` : ""}`
                      : ROUTES.professorProblems,
                  )
                }
              >
                {draftKey ? "문제 등록으로 돌아가기" : "문제 목록으로 돌아가기"}
              </Button>
            }
          />
        </Card>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <PageHeader
        responsive
        eyebrow={original ? original.title : `${course?.title ?? "PROFESSOR"} · NEW ASSIGNMENT`}
        title={editingAssignment ? "문제 수정" : "새 문제 만들기"}
        description={STEP_DESCRIPTION[step]}
        actions={
          <>
            {editingAssignment && (
              <Button
                variant="secondary"
                icon={<ArrowLeft size={24} strokeWidth={1.75} />}
                onClick={() => navigate(returnPath)}
              >
                문제 목록으로 돌아가기
              </Button>
            )}
            {!editingAssignment && course && (
              <Button
                variant="secondary"
                icon={<ArrowLeft size={24} strokeWidth={1.75} />}
                onClick={() => navigate(returnPath)}
              >
                수업으로 돌아가기
              </Button>
            )}
            {!editingAssignment && (
              <>
                <Button variant="secondary" disabled={saved} onClick={() => setShowDrafts(true)}>
                  초안 불러오기
                </Button>
                <Button variant="secondary" disabled={saved} onClick={saveLocal}>
                  초안 저장
                </Button>
              </>
            )}
          </>
        }
      />

      {registrationError && <ErrorMessage>{registrationError}</ErrorMessage>}

      <ProgressStepper
        steps={STEPS}
        current={step}
        label={editingAssignment ? "문제 수정 단계" : "문제 등록 단계"}
        onChange={setStep}
        disabled={saved}
      />

      {step === 0 && (
        <>
          <Card title="기본 정보">
            <div className="grid gap-5">
              {registering && (
                <div className="grid gap-5 min-[1000px]:grid-cols-2">
                  <Select
                    label="수업"
                    value={targetCourse}
                    options={[
                      { value: "", label: "수업을 선택해주세요" },
                      ...courses.map((item) => ({ value: String(item.id), label: item.name })),
                    ]}
                    error={coursesError || undefined}
                    onChange={(value) => {
                      setTargetCourse(value);
                      setTargetAssignment("");
                      setAssignments([]);
                      setAssignmentsError("");
                    }}
                  />
                  <Select
                    label="과제"
                    value={targetAssignment}
                    options={[
                      { value: "", label: "과제를 선택해주세요" },
                      ...assignments.map((item) => ({ value: String(item.id), label: item.title })),
                    ]}
                    error={assignmentsError || undefined}
                    help={
                      selectedAssignment
                        ? `과제 마감일 ${formatAssignmentDeadline(selectedAssignment.dueAt, Date.now())}`
                        : "선택한 과제에 문제를 등록합니다."
                    }
                    onChange={setTargetAssignment}
                  />
                </div>
              )}
              <FormField
                label={registering ? "문제 제목" : "과제 제목"}
                placeholder="문제 제목을 입력하세요"
                value={title}
                error={titleError}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormField
                label={registering ? "문제 설명" : "과제 설명"}
                multiline
                placeholder="문제의 설명을 입력하세요."
                value={description}
                error={descriptionError}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  label="입력 형식"
                  multiline
                  placeholder="입력값의 형식을 설명하세요."
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                />
                <FormField
                  label="출력 형식"
                  multiline
                  placeholder="출력값의 형식을 설명하세요."
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                />
              </div>
            </div>
          </Card>
          <Card title="실행 조건">
            <div className="grid gap-5">
              <div className="flex items-center justify-between gap-4 rounded-[14px] border border-border bg-th-bg px-6 py-[18px]">
                <div>
                  <strong className="block text-base leading-6">채점 언어</strong>
                  <span className="block text-sm leading-5 text-fg-secondary">
                    이 서비스는 Python 과제만 지원합니다.
                  </span>
                </div>
                <Badge tone="info" large>
                  Python 3.12
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <FormField
                  label="시간 제한 (초)"
                  type="number"
                  min={registering ? "0.1" : "1"}
                  max={registering ? "10" : undefined}
                  step={registering ? "0.001" : undefined}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                />
                <FormField
                  label="메모리 제한 (MB)"
                  type="number"
                  min={registering ? "32" : "16"}
                  max={registering ? "512" : undefined}
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                />
              </div>
            </div>
          </Card>
        </>
      )}

      {step === 1 && (
        <Card
          title="등록된 테스트케이스"
          subtitle="채점에 사용할 입력과 기대 출력을 등록하세요."
          action={<Badge tone="info">등록 {testCases.length}개</Badge>}
        >
          {testCases.length === 0 && (
            <div className="mb-5 rounded-xl bg-bg">
              <EmptyState
                title="등록된 테스트케이스가 없습니다"
                description="아래 버튼으로 첫 테스트케이스를 추가하세요."
              />
            </div>
          )}
          <div className="grid gap-5">
            {testCases.map((testCase, index) => (
              <fieldset
                key={testCase.id}
                className="m-0 grid gap-5 rounded-2xl border border-border p-6"
              >
                <legend className="px-2 text-base leading-6 font-bold">케이스 {index + 1}</legend>
                <div className="flex items-end justify-between gap-4">
                  <div className="w-[240px]">
                    <Select
                      label="공개 여부"
                      value={testCase.visibility}
                      onChange={(visibility) => updateTestCase(testCase.id, { visibility })}
                      options={[
                        { value: "private", label: "비공개" },
                        { value: "public", label: "공개" },
                      ]}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label={`케이스 ${index + 1} 삭제`}
                    onClick={() =>
                      setTestCases((cases) => cases.filter((item) => item.id !== testCase.id))
                    }
                  >
                    삭제
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    label="입력값"
                    multiline
                    spellCheck={false}
                    value={testCase.input}
                    onChange={(e) => updateTestCase(testCase.id, { input: e.target.value })}
                  />
                  <FormField
                    label="기대 출력값"
                    multiline
                    spellCheck={false}
                    value={testCase.expectedOutput}
                    onChange={(e) =>
                      updateTestCase(testCase.id, {
                        expectedOutput: e.target.value,
                      })
                    }
                  />
                </div>
              </fieldset>
            ))}
          </div>
          <div className={testCases.length ? "mt-5" : undefined}>
            <Button
              variant="secondary"
              icon={<Plus size={24} strokeWidth={1.75} />}
              onClick={addTestCase}
            >
              테스트케이스 추가
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && registering && (
        <>
          {canSaveDemoPolicy && (
            <InspectionPolicyEditor
              policy={inspectionPolicy}
              onChange={setInspectionPolicy}
              disabled={submitting}
            />
          )}
          <Card title="제출 정책">
            <PolicyRow title="재제출 허용" description="마감 전까지 여러 번 제출 가능">
              <Toggle checked={resubmission} onChange={setResubmission} label="허용" />
            </PolicyRow>
          </Card>
        </>
      )}
      {step === 2 && !registering && (
        <>
          <InspectionPolicyEditor
            policy={inspectionPolicy}
            onChange={setInspectionPolicy}
            disabled={saved}
          />
          <Card title="제출 정책">
            <PolicyRow title="재제출 허용" description="마감 전까지 여러 번 제출 가능">
              <Toggle checked={resubmission} onChange={setResubmission} label="허용" />
            </PolicyRow>
            <PolicyRow
              title="화면 이탈 기록 사용"
              description="화면 활성이 풀린 횟수와 벗어난 시간을 참고용으로 기록돼요. 점수에는 반영되지 않아요."
            >
              <Toggle checked={trackLeave} onChange={setTrackLeave} label="사용" />
            </PolicyRow>
            <div className="mt-6">
              <Banner type="info" title="점수 공개 정책">
                교수가 확정한 점수만 학생에게 공개됩니다.
              </Banner>
            </div>
          </Card>
        </>
      )}

      <div className="flex justify-end gap-3">
        {step > 0 && (
          <Button variant="secondary" disabled={saved} onClick={() => setStep(step - 1)}>
            이전
          </Button>
        )}
        {step < STEPS.length - 1 && (
          <Button
            variant={editingAssignment ? "secondary" : "primary"}
            disabled={saved}
            onClick={nextStep}
          >
            다음
          </Button>
        )}
        {editingAssignment ? (
          <Button disabled={saved} onClick={saveLocal}>
            변경사항 저장
          </Button>
        ) : (
          step === STEPS.length - 1 && (
            <Button disabled={saved} onClick={prepareRegistration}>
              문제 등록
            </Button>
          )
        )}
      </div>
      <ConfirmModal
        open={Boolean(pendingRegistration)}
        role="dialog"
        title="문제를 등록할까요?"
        description="문제는 선택한 과제에 추가되며 과제의 공개 일정과 마감을 따릅니다."
        confirmLabel="문제 등록"
        loading={submitting}
        onConfirm={() => void submitRegistration()}
        onCancel={() => {
          if (!submittingRef.current) setPendingRegistration(undefined);
        }}
      />
      <Modal open={showDrafts} onClose={() => setShowDrafts(false)} title="초안 불러오기">
        {drafts.length ? (
          <ul className="m-0 grid list-none gap-2 p-0">
            {drafts.map((draft) => (
              <li key={draft.editKey}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!draft.editKey) return;
                    const params = new URLSearchParams({ draft: draft.editKey });
                    if (courseId) params.set("course", courseId);
                    setShowDrafts(false);
                    navigate(`${ROUTES.professorProblemNew}?${params}`);
                  }}
                >
                  {draft.title}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="저장된 초안이 없어요" />
        )}
      </Modal>
    </ProfessorLayout>
  );
}
