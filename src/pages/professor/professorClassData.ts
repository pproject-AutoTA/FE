import {
  CLASSES,
  DEMO_COURSE_IDS,
  DEPARTMENTS,
  STUDENT_NAMES,
  type ClassInfo,
} from "../../mocks/professor";
import type { Course } from "./professorCoursesApi";

export type { ClassInfo };
const storageKey = "autota.professor.classes.v2";

export function getMockClassStudent(classId: string, index: number) {
  const classIndex = Math.max(
    0,
    CLASSES.findIndex((course) => course.id === classId),
  );
  const rosterIndex = classIndex * 70 + index;
  return {
    name: STUDENT_NAMES[rosterIndex % STUDENT_NAMES.length],
    department: DEPARTMENTS[rosterIndex % DEPARTMENTS.length],
    studentId: `20251${String(rosterIndex + 1).padStart(3, "0")}`,
  };
}

export function readProfessorClasses(): ClassInfo[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
    return Array.isArray(stored) ? stored : CLASSES;
  } catch {
    return CLASSES;
  }
}

export function saveProfessorClasses(classes: ClassInfo[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(classes));
}

function formatSemester(semester: string) {
  const match = /^(\d{4})-([12])$/.exec(semester);
  return match ? `${match[1]}년 ${match[2]}학기` : semester;
}

type CourseListFields = Pick<Course, "id" | "name" | "semester" | "studentCount" | "joinCode">;

export function toProfessorClass(course: CourseListFields, saved = readProfessorClasses()): ClassInfo {
  const demoId = import.meta.env.VITE_API_BASE_URL?.trim()
    ? undefined
    : DEMO_COURSE_IDS.get(course.id);
  const id = demoId ?? String(course.id);
  const previous = saved.find((item) => item.id === id);
  const original = CLASSES.find((item) => item.id === id);
  return {
    id,
    title: course.name,
    term: formatSemester(course.semester),
    count: course.studentCount,
    code: previous && previous.code !== original?.code ? previous.code : course.joinCode,
    open: previous?.open ?? original?.open ?? true,
  };
}

export function toProfessorClasses(courses: CourseListFields[]): ClassInfo[] {
  const saved = readProfessorClasses();
  const classes = courses.map((course) => toProfessorClass(course, saved));
  return [...classes, ...saved.filter((item) => item.id.startsWith("local-"))];
}
