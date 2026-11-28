import { request } from "../../api/client";
import type { ApiSuccess } from "../../api/types";

const MY_COURSES_PATH = "/courses/me";
export const MY_COURSES_ENDPOINT = "/api/v1/courses/me";
const PROFESSOR_COURSES_PATH = "/professor/courses";
export const COURSE_CREATION_ENDPOINT = `/api/v1${PROFESSOR_COURSES_PATH}`;
export const COURSE_SEMESTER_PATTERN = /^\d{4}-[1-9]$/;

export type CreateCourseBody = { name: string; semester: string };
export type CreatedCourse = CreateCourseBody & {
  id: number;
  joinCode: string;
  studentCount: number;
  createdAt: string;
};

export function createProfessorCourse(body: CreateCourseBody) {
  return request<CreatedCourse>(PROFESSOR_COURSES_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type Course = {
  id: number;
  name: string;
  semester: string;
  professorName: string;
  joinCode: string;
  studentCount: number;
  assignmentCount: number;
};

export type MyCoursesResponse = ApiSuccess<Course[]>;

export async function fetchMyCourses(signal: AbortSignal): Promise<Course[]> {
  const courses = await request<Course[]>(MY_COURSES_PATH, { signal });
  if (!Array.isArray(courses)) {
    throw new Error("수업 목록을 불러오지 못했어요.");
  }
  return courses;
}
