import { request } from "./client";
import type { ProblemDetailData, SubmissionSummary } from "./types";

/** 문제 상세 (PROB-04) */
export const getProblem = (problemId: number) =>
  request<ProblemDetailData>(`/problems/${problemId}`);

/** 문제 하나에 대한 내 제출 목록, 최신순 (RES-01). 제출이 없으면 빈 배열 */
export const listMySubmissions = (problemId: number) =>
  request<SubmissionSummary[]>(`/problems/${problemId}/submissions/me`);
