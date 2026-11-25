import { CLASSES, DEPARTMENTS, STUDENT_NAMES, type ClassInfo } from "./mockClasses";

export type { ClassInfo };
const storageKey = "autota.professor.classes.v2";

export function getMockClassStudent(classId: string, index: number) {
  const classIndex = Math.max(0, CLASSES.findIndex((course) => course.id === classId));
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
