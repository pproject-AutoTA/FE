import { request } from "../../api/client";
import type { InspectionPolicy } from "./savedProblems";

const PROBLEM_DETAILS_ENDPOINT = "/professor/problems";
export const PROBLEM_DETAILS_PATH = new RegExp(`^/api/v1${PROBLEM_DETAILS_ENDPOINT}/(\\d+)$`);

export type ProfessorProblemDetails = {
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
  demoInspectionPolicy?: InspectionPolicy;
  testcases: {
    no: number;
    input: string;
    expectedOutput: string;
    isPublic: boolean;
  }[];
};

export async function fetchProfessorProblemDetails(problemId: number, signal: AbortSignal) {
  const details = await request<ProfessorProblemDetails>(`${PROBLEM_DETAILS_ENDPOINT}/${problemId}`, {
    signal,
  });
  if (!Array.isArray(details?.testcases) || details.id !== problemId) {
    throw new Error("문제 상세를 불러오지 못했어요.");
  }
  return details;
}
