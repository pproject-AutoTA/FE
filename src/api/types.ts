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
export type ApiVerdict = "AC" | "WA" | "TLE" | "MLE" | "RE";

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
  timeMs: number;
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
