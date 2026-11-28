import { request } from "./client";
import type { AssignmentItem, CourseSummary } from "./types";

/** 내 수업 목록 (COURSE-03). 학생은 참여한 수업, joinCode는 null */
export const listMyCourses = () => request<CourseSummary[]>("/courses/me");

/** 수업의 과제·문제 목록 (PROB-03). 학생은 문제마다 내 마지막 제출(mySubmission)이 붙는다 */
export const listCourseAssignments = (courseId: number) =>
  request<AssignmentItem[]>(`/courses/${courseId}/assignments`);
