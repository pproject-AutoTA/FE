import { useState, type ReactNode } from "react";
import { ArrowLeft, BookOpen, FlaskConical, Plus, ShieldCheck } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Badge,
  Banner,
  Button,
  Card,
  DateTimePicker,
  EmptyState,
  FormField,
  Modal,
  PageHeader,
  Select,
  ProgressStepper,
  Toggle,
  useToast,
} from "../../components";
import { ProfessorLayout } from "../../components/layout/ProfessorSidebar";
import { readEditableProblem, readProfessorDrafts } from "./professorAssignments";
import { readProfessorClasses } from "./professorClassData";
import { InspectionPolicyEditor } from "./InspectionPolicyEditor";
import {
  saveProblem,
  type InspectionPolicy,
  type TestCase,
} from "./savedProblems";

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
  const draftKey = problemKey ? null : searchParams.get("draft");
  return (
    <ProblemEditorForm
      key={JSON.stringify([problemKey, editStep, courseId, draftKey])}
      problemKey={problemKey}
      draftKey={draftKey}
      editStep={editStep}
      courseId={courseId}
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
        <strong className="block text-base leading-6 font-bold text-fg">
          {title}
        </strong>
        <span className="block text-sm leading-5 text-fg-secondary">
          {description}
        </span>
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
}: {
  problemKey?: string;
  draftKey: string | null;
  editStep: number;
  courseId: string | null;
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [entry] = useState(() => {
    try {
      const key = problemKey ?? draftKey;
      const found = key ? readEditableProblem(key) : undefined;
      if (draftKey && (found?.problem.status !== "초안" || (courseId && found.problem.classId !== courseId))) return undefined;
      return found;
    } catch {
      return undefined;
    }
  });
  const original = entry?.problem;
  const editingAssignment = Boolean(original && original.status !== "초안");
  const linkedCourseId = original ? original.classId : courseId;
  const course = readProfessorClasses().find(
    (item) => item.id === linkedCourseId,
  );
  const returnPath =
    !editingAssignment && course
      ? `/professor/classes?course=${encodeURIComponent(course.id)}&tab=assignments`
      : "/professor/problems";
  const [title, setTitle] = useState(original?.title ?? "");
  const [description, setDescription] = useState(original?.description ?? "");
  const [inputFormat, setInputFormat] = useState(original?.inputFormat ?? "");
  const [outputFormat, setOutputFormat] = useState(
    original?.outputFormat ?? "",
  );
  const [timeLimit, setTimeLimit] = useState(original?.timeLimit ?? "1");
  const [memoryLimit, setMemoryLimit] = useState(
    original?.memoryLimit ?? "128",
  );
  const [deadline, setDeadline] = useState(original?.deadline ?? "");
  const [resubmission, setResubmission] = useState(
    original?.resubmission ?? true,
  );
  const [trackLeave, setTrackLeave] = useState(original?.trackLeave ?? false);
  const [inspectionPolicy, setInspectionPolicy] = useState<InspectionPolicy>(
    original?.inspectionPolicy ?? {
      mode: "deny",
      deniedTags: [],
      allowedTags: [],
      requiredTags: [],
    },
  );
  const originalPublishAt = Date.parse(original?.publishAt ?? "");
  const [publishImmediately, setPublishImmediately] = useState(
    !Number.isFinite(originalPublishAt),
  );
  const [publishDateTime, setPublishDateTime] = useState(() => {
    if (!Number.isFinite(originalPublishAt)) return "";
    const date = new Date(originalPublishAt);
    return new Date(originalPublishAt - date.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 16);
  });
  const [step, setStep] = useState(editStep);
  const [testCases, setTestCases] = useState<TestCase[]>(
    original?.testCases ?? [],
  );
  const [nextCaseId, setNextCaseId] = useState(
    () =>
      Math.max(0, ...(original?.testCases ?? []).map((item) => item.id)) + 1,
  );
  const [saved, setSaved] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const drafts = showDrafts ? readProfessorDrafts(courseId) : [];
  const [showErrors, setShowErrors] = useState(false);
  const titleError =
    showErrors && !title.trim() ? "과제 제목을 입력해주세요" : undefined;
  const descriptionError =
    showErrors && !description.trim() ? "과제 설명을 입력해주세요" : undefined;

  const addTestCase = () => {
    setTestCases((cases) => [
      ...cases,
      { id: nextCaseId, input: "", expectedOutput: "", visibility: "private" },
    ]);
    setNextCaseId((id) => id + 1);
  };
  const updateTestCase = (
    id: number,
    changes: Partial<Omit<TestCase, "id">>,
  ) => {
    setTestCases((cases) =>
      cases.map((testCase) =>
        testCase.id === id ? { ...testCase, ...changes } : testCase,
      ),
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
  const save = (publish: boolean) => {
    if (saved) return;
    if (linkedCourseId && !course) {
      toast("error", "등록할 수업을 찾지 못했어요.");
      return;
    }
    if (!validateProblem()) {
      if (step !== 0) setStep(0);
      return;
    }
    const updatePublication = editingAssignment || publish;
    const scheduled = updatePublication && !publishImmediately;
    const publicationTime = Date.parse(publishDateTime);
    const samePublicationTime = editingAssignment &&
      Math.floor(originalPublishAt / 60_000) ===
      Math.floor(publicationTime / 60_000);
    if (
      scheduled &&
      (!Number.isFinite(publicationTime) ||
        (!samePublicationTime && publicationTime <= Date.now()))
    ) {
      toast("error", "공개 날짜와 시간을 현재 시각 이후로 설정해주세요.");
      if (step !== 2) setStep(2);
      return;
    }
    const status = scheduled ? "공개 예약" : updatePublication ? "공개" : "초안";
    const publishAt = !updatePublication
      ? !publishImmediately && Number.isFinite(publicationTime)
        ? new Date(publicationTime).toISOString()
        : undefined
      : scheduled
        ? samePublicationTime
          ? original?.publishAt
          : new Date(publicationTime).toISOString()
        : undefined;
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
          deadline,
          resubmission,
          trackLeave,
          testCases,
          inspectionPolicy,
          status,
          publishAt,
        },
        entry?.index,
      );
    } catch {
      toast(
        "error",
        "문제를 저장하지 못했어요. 브라우저 저장 공간을 확인해주세요.",
      );
      return;
    }
    setSaved(true);
    toast(
      "success",
      editingAssignment
        ? "변경사항을 저장했어요."
        : scheduled
          ? "문제 공개를 예약했어요."
          : publish
            ? "문제를 공개했어요."
            : "문제를 초안으로 저장했어요.",
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
                onClick={() => navigate(draftKey
                  ? `/professor/problems/new${courseId ? `?course=${encodeURIComponent(courseId)}` : ""}`
                  : "/professor/problems")}
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
        eyebrow={
          original
            ? original.title
            : `${course?.title ?? "PROFESSOR"} · NEW ASSIGNMENT`
        }
        title={editingAssignment ? "문제 수정" : "새 문제 만들기"}
        description={STEP_DESCRIPTION[step]}
        actions={
          <>
            {editingAssignment && (
              <Button
                variant="secondary"
                icon={<ArrowLeft size={20} strokeWidth={1.75} />}
                onClick={() => navigate(returnPath)}
              >
                문제 목록으로 돌아가기
              </Button>
            )}
            {!editingAssignment && course && (
              <Button
                variant="secondary"
                icon={<ArrowLeft size={20} strokeWidth={1.75} />}
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
                <Button variant="secondary" disabled={saved} onClick={() => save(false)}>
                  초안 저장
                </Button>
              </>
            )}
          </>
        }
      />

      <ProgressStepper
        steps={STEPS}
        current={step}
        label={editingAssignment ? "과제 수정 단계" : "과제 등록 단계"}
        onChange={setStep}
        disabled={saved}
      />

      {step === 0 && (
        <>
          <Card title="기본 정보">
            <div className="grid gap-5">
              <FormField
                label="과제 제목"
                placeholder="문제 제목을 입력하세요"
                value={title}
                error={titleError}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormField
                label="과제 설명"
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
                  <strong className="block text-base leading-6">
                    채점 언어
                  </strong>
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
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                />
                <FormField
                  label="메모리 제한 (MB)"
                  type="number"
                  min="16"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value)}
                />
                <DateTimePicker
                  label="제출 마감"
                  value={deadline}
                  onChange={setDeadline}
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
                <legend className="px-2 text-base leading-6 font-bold">
                  케이스 {index + 1}
                </legend>
                <div className="flex items-end justify-between gap-4">
                  <div className="w-[240px]">
                    <Select
                      label="공개 여부"
                      value={testCase.visibility}
                      onChange={(visibility) =>
                        updateTestCase(testCase.id, { visibility })
                      }
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
                      setTestCases((cases) =>
                        cases.filter((item) => item.id !== testCase.id),
                      )
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
                    onChange={(e) =>
                      updateTestCase(testCase.id, { input: e.target.value })
                    }
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
              icon={<Plus size={20} strokeWidth={1.75} />}
              onClick={addTestCase}
            >
              테스트케이스 추가
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <>
          <InspectionPolicyEditor
            policy={inspectionPolicy}
            onChange={setInspectionPolicy}
            disabled={saved}
          />
          <Card title="제출 정책">
            <PolicyRow
              title="문제 공개 시점"
              description="바로 공개하거나 공개 일시를 예약할 수 있어요."
            >
              <Toggle
                checked={publishImmediately}
                onChange={setPublishImmediately}
                label="바로 공개"
              />
            </PolicyRow>
            {!publishImmediately && (
              <div className="max-w-[420px] border-b border-border pb-5">
                <DateTimePicker
                  label="공개 날짜 및 시간"
                  value={publishDateTime}
                  onChange={setPublishDateTime}
                />
              </div>
            )}
            <PolicyRow
              title="재제출 허용"
              description="마감 전까지 여러 번 제출 가능"
            >
              <Toggle
                checked={resubmission}
                onChange={setResubmission}
                label="허용"
              />
            </PolicyRow>
            <PolicyRow
              title="화면 이탈 기록 사용"
              description="화면 활성이 풀린 횟수와 벗어난 시간을 참고용으로 기록돼요. 점수에는 반영되지 않아요."
            >
              <Toggle
                checked={trackLeave}
                onChange={setTrackLeave}
                label="사용"
              />
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
          <Button
            variant="secondary"
            disabled={saved}
            onClick={() => setStep(step - 1)}
          >
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
          <Button disabled={saved} onClick={() => save(false)}>
            변경사항 저장
          </Button>
        ) : (
          step === STEPS.length - 1 && (
            <Button disabled={saved} onClick={() => save(true)}>
              문제 등록
            </Button>
          )
        )}
      </div>
      <Modal open={showDrafts} onClose={() => setShowDrafts(false)} title="초안 불러오기">
        {drafts.length ? (
          <ul className="m-0 grid list-none gap-2 p-0">
            {drafts.map((draft) => (
              <li key={draft.editKey}>
                <Button variant="secondary" onClick={() => {
                  if (!draft.editKey) return;
                  const params = new URLSearchParams({ draft: draft.editKey });
                  if (courseId) params.set("course", courseId);
                  setShowDrafts(false);
                  navigate(`/professor/problems/new?${params}`);
                }}>
                  {draft.title}
                </Button>
              </li>
            ))}
          </ul>
        ) : <EmptyState title="저장된 초안이 없어요" />}
      </Modal>
    </ProfessorLayout>
  );
}
