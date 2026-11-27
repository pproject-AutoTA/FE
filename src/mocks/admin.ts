export const QUEUE = [18, 24, 16, 34, 28, 42, 37, 51, 31, 26, 19, 12];
export const VERDICTS = [
  { label: "AC", percent: 64, color: "var(--color-success-fg)" },
  { label: "WA", percent: 21, color: "var(--color-danger-fg)" },
  { label: "TLE", percent: 6, color: "var(--color-flag-fg)" },
  { label: "MLE", percent: 3, color: "var(--color-purple-fg)" },
  { label: "RE", percent: 4, color: "var(--color-blue-600)" },
  { label: "FLAG", percent: 2, color: "var(--color-navy-900)" },
];

export const WORKERS = [1842, 1839, 1837, null, 1832, 1828].map((submission, index) => ({
  id: `worker-0${index + 1}`,
  status:
    submission === null
      ? ("IDLE" as const)
      : index === 2
        ? ("GRADING" as const)
        : ("HEALTHY" as const),
  submission: submission === null ? "–" : `SUB-20250522-${submission}`,
  runtime: "Docker sandbox",
  heartbeatSeconds: index + 1,
}));
export const FAILURES = [
  {
    id: "JOB-88412",
    submission: "SUB-1842",
    reason: "컨테이너 시작 실패",
    worker: "worker-07",
    attempts: 1,
  },
  {
    id: "JOB-88405",
    submission: "SUB-1838",
    reason: "워커 비정상 종료",
    worker: "worker-03",
    attempts: 2,
  },
  {
    id: "JOB-88391",
    submission: "SUB-1821",
    reason: "샌드박스 이미지 로드 실패",
    worker: "worker-09",
    attempts: 0,
  },
];
export const REGISTERED_WORKERS = 10;
export const COMPLETED_SUBMISSIONS = 1284;
export const AVERAGE_GRADING_SECONDS = 3.8;
export const QUEUE_COUNT_FIVE_MINUTES_AGO = 15;

export type AdminUserRole = "STUDENT" | "PROFESSOR" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: "ACTIVE" | "SUSPENDED";
  department?: string;
  superAdmin?: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "minjun",
    name: "김민준",
    email: "minjun@university.ac.kr",
    role: "STUDENT",
    status: "ACTIVE",
  },
  {
    id: "seoyeon",
    name: "박서연",
    email: "seoyeon@university.ac.kr",
    role: "PROFESSOR",
    status: "ACTIVE",
    department: "컴퓨터공학과",
  },
  {
    id: "jihun",
    name: "이지훈",
    email: "jihun@university.ac.kr",
    role: "PROFESSOR",
    status: "ACTIVE",
    department: "소프트웨어학과",
  },
  {
    id: "admin",
    name: "시스템 관리자",
    email: "admin@university.ac.kr",
    role: "ADMIN",
    status: "ACTIVE",
    superAdmin: true,
  },
  {
    id: "subin",
    name: "한수빈",
    email: "subin@university.ac.kr",
    role: "STUDENT",
    status: "SUSPENDED",
  },
];
