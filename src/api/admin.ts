import { request } from "./client";

export const ADMIN_STATUS_PATH = "/admin/status";
export const JUDGE_FAILURES_PATH = "/admin/judge-failures";
export const JUDGE_FAILURE_PAGE_SIZE = 20;

export type AdminStatus = {
  queues: { name: string; ready: number; unacked: number | null }[];
  workers: { judge: number; lint: number };
  todayJudged: number;
  avgJudgeTimeMs: number | null;
};

export type JudgeFailure = {
  submissionId: number;
  problemId: number;
  failedAt: string;
  reason: string;
  retryCount: number;
};

export type JudgeFailurePage = {
  items: JudgeFailure[];
  page: number;
  size: number;
  totalCount: number;
};

export function fetchAdminStatus(signal: AbortSignal) {
  return request<AdminStatus>(ADMIN_STATUS_PATH, { signal });
}

export function fetchJudgeFailures(page: number, signal: AbortSignal) {
  const query = new URLSearchParams({ page: String(page), size: String(JUDGE_FAILURE_PAGE_SIZE) });
  return request<JudgeFailurePage>(`${JUDGE_FAILURES_PATH}?${query}`, { signal });
}
