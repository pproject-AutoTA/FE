import { request } from "../../api/client";
import type { ApiSuccess, ApiVerdict, SubmissionApiStatus } from "../../api/types";

export const COURSE_ASSIGNMENTS_PATH = /^\/api\/v1\/courses\/(\d+)\/assignments$/;
export const ASSIGNMENT_CREATION_PATH = /^\/api\/v1\/professor\/courses\/(\d+)\/assignments$/;

export type CreateAssignmentBody = { title: string; dueAt: string };

export type CreatedAssignment = CreateAssignmentBody & {
  id: number;
  courseId: number;
  problemCount: number;
};

export function createProfessorAssignment(courseId: number, body: CreateAssignmentBody) {
  return request<CreatedAssignment>(`/professor/courses/${courseId}/assignments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type CourseAssignment = {
  id: number;
  title: string;
  dueAt: string;
  studentCount: number | null;
  problems: {
    id: number;
    title: string;
    resubmitAllowed: boolean;
    testcaseCount: number;
    submittedStudentCount: number | null;
    mySubmission: {
      submissionId: number;
      status: SubmissionApiStatus;
      verdict: ApiVerdict | null;
      passedCount: number | null;
      totalCount: number;
      submittedAt: string;
    } | null;
  }[];
};

export type CourseAssignmentsResponse = ApiSuccess<CourseAssignment[]>;

export async function fetchCourseAssignments(courseId: number, signal: AbortSignal) {
  const assignments = await request<CourseAssignment[]>(`/courses/${courseId}/assignments`, {
    signal,
  });
  if (!Array.isArray(assignments)) {
    throw new Error("과제 목록을 불러오지 못했어요.");
  }
  return assignments;
}
