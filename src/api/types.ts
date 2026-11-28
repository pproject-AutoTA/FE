export type Role = "STUDENT" | "PROFESSOR" | "ADMIN";

export interface FieldError {
  field: string;
  rejectedValue: unknown;
  reason: string;
}

export interface ApiSuccess<T> {
  success: true;
  code: string;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  code: string;
  message: string;
  data: null;
  timestamp: string;
  path: string;
  errors: FieldError[] | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  studentNo: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

/* ===== 수업 참여 (COURSE-02) ===== */
export interface JoinData {
  courseId: number;
  name: string;
  semester: string;
  professorName: string;
  joinedAt: string;
}

/* ===== 문제 · 제출 (PROB-04, RES-01, RES-02, SUB-01) ===== */
export type SubmissionApiStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED";
/** SKIPPED: 실행하지 않은 케이스 (API 명세 v1.8에 없던 값, 이때 timeMs는 null) */
export type ApiVerdict = "AC" | "WA" | "TLE" | "MLE" | "RE" | "SKIPPED";

/** 문제 상세: 비공개 케이스는 개수(totalTestcaseCount)만 온다 */
export interface ProblemDetailData {
  id: number;
  assignmentId: number;
  courseId: number;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  resubmitAllowed: boolean;
  dueAt: string;
  testcases: { no: number; input: string; expectedOutput: string }[];
  totalTestcaseCount: number;
}

/** 내 제출 목록의 한 항목 (최신순) */
export interface SubmissionSummary {
  id: number;
  status: SubmissionApiStatus;
  verdict: ApiVerdict | null;
  passedCount: number | null;
  totalCount: number;
  submittedAt: string;
  /** 성적 대상(마지막 제출) 여부 */
  isLatest: boolean;
}

export interface TestcaseResult {
  no: number;
  isPublic: boolean;
  verdict: ApiVerdict;
  timeMs: number | null;
  input: string;
  expectedOutput: string;
  actualOutput: string;
}

/** 제출 상세. 채점 완료 전에는 verdict·시간·메모리가 null, testcases는 빈 배열 */
export interface SubmissionDetailData {
  id: number;
  problemId: number;
  status: SubmissionApiStatus;
  verdict: ApiVerdict | null;
  code: string;
  submittedAt: string;
  judgedAt: string | null;
  executionTimeMs: number | null;
  memoryKb: number | null;
  testcases: TestcaseResult[];
  /** 마감 전에만 값이 있다 (마감 후에는 testcases에 포함되어 null) */
  hiddenPassed: number | null;
  hiddenTotal: number | null;
  flagged: boolean;
}

export interface SubmitData {
  id: number;
  problemId: number;
  status: "PENDING";
  submittedAt: string;
}

/* ===== 내 수업 · 과제 목록 (COURSE-03, PROB-03) ===== */
/** 내 수업 목록의 한 항목. joinCode는 교수만 값이 있고 학생은 null */
export interface CourseSummary {
  id: number;
  name: string;
  semester: string;
  professorName: string;
  joinCode: string | null;
  studentCount: number;
  assignmentCount: number;
}

/** 문제 목록에 붙는 내 마지막 제출 1건 (학생만, 제출이 없으면 null) */
export interface MySubmissionBrief {
  submissionId: number;
  status: SubmissionApiStatus;
  verdict: ApiVerdict | null;
  passedCount: number | null;
  totalCount: number;
  submittedAt: string;
}

export interface AssignmentProblem {
  id: number;
  title: string;
  resubmitAllowed: boolean;
  /** 공개 + 비공개 케이스 합계 */
  testcaseCount: number;
  /** 교수만 값, 학생은 null */
  submittedStudentCount: number | null;
  mySubmission: MySubmissionBrief | null;
}

/** 수업의 과제 한 건과 그 안의 문제들 */
export interface AssignmentItem {
  id: number;
  title: string;
  dueAt: string;
  /** 교수만 값, 학생은 null */
  studentCount: number | null;
  problems: AssignmentProblem[];
}
