import { request } from "./client";
import type { SubmissionDetailData, SubmitData } from "./types";

/** 코드 제출 (SUB-01). 접수되면 202로 바로 돌아오고 채점은 서버에서 따로 진행된다 */
export const submitCode = (problemId: number, code: string) =>
  request<SubmitData>(`/problems/${problemId}/submissions`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });

/** 내 제출 상세 (RES-02). status가 PENDING·RUNNING이면 2초 간격으로 다시 조회한다 */
export const getMySubmission = (submissionId: number) =>
  request<SubmissionDetailData>(`/submissions/me/${submissionId}`);
