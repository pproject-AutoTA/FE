import type { AdminStatus, JudgeFailure } from "../api/admin";

export const DEMO_ADMIN_STATUS: AdminStatus = {
  queues: [
    { name: "judge.queue", ready: 12, unacked: null },
    { name: "lint.queue", ready: 0, unacked: null },
    { name: "result.queue", ready: 1, unacked: null },
  ],
  workers: { judge: 2, lint: 1 },
  todayJudged: 1284,
  avgJudgeTimeMs: 3800,
};

const failureReasons = ["컨테이너 시작 실패", "워커 비정상 종료", "샌드박스 이미지 로드 실패"];

export const DEMO_JUDGE_FAILURES: JudgeFailure[] = Array.from({ length: 23 }, (_, index) => ({
  submissionId: 339 - index,
  problemId: 12 + (index % 3),
  failedAt: new Date(Date.UTC(2026, 10, 7, 5, 50 - index, 12)).toISOString(),
  reason: failureReasons[index % failureReasons.length],
  retryCount: 3,
}));

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
