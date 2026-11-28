import { useEffect, useState } from "react";
import { ASSIGNMENTS, PROBLEM_DETAILS } from "../../mocks/professor";
import { REVIEWS } from "../../mocks/professor";
import { readProfessorClasses } from "./professorClassData";
import type { Assignment } from "../../mocks/professor";
import type { CourseAssignment } from "./professorCourseAssignmentsApi";
import { readSavedProblems, type SavedProblem } from "./savedProblems";

export type { Assignment };

export const ASSIGNMENT_STATUS_LABEL = {
  SCHEDULED: "예약",
  PUBLISHED: "공개",
  CLOSED: "종료",
} as const;

export type AssignmentState = keyof typeof ASSIGNMENT_STATUS_LABEL;

export function formatAssignmentDeadline(deadline: string | undefined, now: number) {
  const timestamp = Date.parse(deadline ?? "");
  if (!Number.isFinite(timestamp)) return "마감일 미설정";
  const date = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(timestamp);
  return timestamp <= now ? `${date} · 마감` : date;
}

export type AssignmentView = Omit<Assignment, "status"> & { status: AssignmentState };

type AssignmentSort = "default" | "registered" | "deadline" | "title-asc" | "title-desc";

export const ASSIGNMENT_SORT_OPTIONS: { value: AssignmentSort; label: string }[] = [
  { value: "default", label: "기본 순서" },
  { value: "registered", label: "등록순 (최신순)" },
  { value: "deadline", label: "마감순" },
  { value: "title-asc", label: "제목 오름차순" },
  { value: "title-desc", label: "제목 내림차순" },
];

const titleOrder = new Intl.Collator("ko-KR", { numeric: true });

function deadlineOrder(deadline?: string) {
  const time = Date.parse(deadline ?? "");
  return Number.isFinite(time) ? time : Infinity;
}

export function sortAssignments<T extends Pick<Assignment, "id" | "deadline" | "title">>(
  items: T[],
  sort: AssignmentSort,
) {
  if (sort === "default") return items;
  return [...items].sort((a, b) => {
    switch (sort) {
      case "registered":
        return b.id - a.id;
      case "deadline": {
        const first = deadlineOrder(a.deadline);
        const second = deadlineOrder(b.deadline);
        return first === second ? 0 : first < second ? -1 : 1;
      }
      case "title-asc":
        return titleOrder.compare(a.title, b.title);
      case "title-desc":
        return titleOrder.compare(b.title, a.title);
    }
  });
}

export function readEditableProblem(
  key: string,
): { problem: SavedProblem; index?: number } | undefined {
  const saved = readSavedProblems();
  if (key.startsWith("saved-")) {
    const index = saved.findIndex(
      (problem, index) => !problem.sampleId && key === `saved-${index}`,
    );
    return index >= 0 ? { problem: saved[index], index } : undefined;
  }
  const sample = ASSIGNMENTS.find((item) => key === `sample-${item.id}`);
  if (!sample) return undefined;
  const index = saved.findIndex((problem) => problem.sampleId === sample.id);
  if (index >= 0) return { problem: saved[index], index };

  return {
    problem: {
      sampleId: sample.id,
      classId: sample.classId,
      title: sample.title,
      ...PROBLEM_DETAILS[sample.id],
      resubmission: true,
      trackLeave: false,
      status: sample.status,
    },
  };
}

function readAllProfessorAssignments(): Assignment[] {
  const samples = ASSIGNMENTS.map((item) => {
    const editKey = `sample-${item.id}`;
    return {
      ...item,
      editKey,
      deadline: PROBLEM_DETAILS[item.id].deadline,
      flags: REVIEWS.filter((review) => review.assignmentKey === editKey).length,
    };
  });
  try {
    const classes = readProfessorClasses();
    const saved = readSavedProblems();
    const fromProblem = (problem: SavedProblem) => ({
      classId: problem.classId,
      title: problem.title,

      deadline: problem.deadline,
      status: problem.status,
      publishAt: problem.publishAt,
    });
    const updatedSamples = samples.map((item) => {
      const edited = saved.find((problem) => problem.sampleId === item.id);
      if (!edited) return item;
      const fields = fromProblem(edited);
      return { ...item, ...fields };
    });
    const registered = saved.flatMap((problem, index): Assignment[] =>
      problem.sampleId
        ? []
        : [
            {
              id: ASSIGNMENTS.length + index + 1,
              editKey: `saved-${index}`,
              ...fromProblem(problem),
              submitted: 0,
              total: classes.find((course) => course.id === problem.classId)?.count ?? 60,
              flags: 0,
            },
          ],
    );
    return [...updatedSamples, ...registered];
  } catch {
    return samples;
  }
}

export function readProfessorAssignments() {
  return readAllProfessorAssignments().filter((item) => item.status !== "DRAFT");
}

export function mergeCourseAssignments(
  courseId: string,
  response: CourseAssignment[],
  localAssignments: Assignment[],
) {
  let editedIds = new Set<number>();
  const isDemoCourse = !import.meta.env.VITE_API_BASE_URL?.trim();
  try {
    if (isDemoCourse) {
      editedIds = new Set(readSavedProblems().flatMap((item) => item.sampleId ?? []));
    }
  } catch {
    // The API list is still usable when local demo edits cannot be read.
  }
  const rows = response.flatMap((record) => {
    const editKey = `sample-${record.id}`;
    const local = isDemoCourse
      ? localAssignments.find((item) => item.editKey === editKey)
      : undefined;
    const edited = editedIds.has(record.id);
    if (edited && local?.classId !== courseId) return [];

    const assignment: Assignment = {
      id: record.id,
      classId: courseId,
      editKey: local?.editKey,
      title: edited ? (local?.title ?? record.title) : record.title,
      deadline: edited ? (local?.deadline ?? record.dueAt) : record.dueAt,
      status: local?.status ?? "PUBLISHED",
      publishAt: local?.publishAt,
      submitted: record.problems[0]?.submittedStudentCount ?? 0,
      total: record.studentCount ?? 0,
      flags: local?.flags ?? 0,
    };
    return [assignment];
  });
  const localOnly = localAssignments.filter(
    (item) =>
      item.classId === courseId &&
      !rows.some((row) => row.editKey === item.editKey) &&
      (item.editKey?.startsWith("saved-") || editedIds.has(item.id)),
  );
  return [...rows, ...localOnly];
}

export function readProfessorDrafts(courseId: string | null) {
  return readAllProfessorAssignments().filter(
    (item) => item.status === "DRAFT" && (!courseId || item.classId === courseId),
  );
}

export function getAssignmentStatus(assignment: Assignment, now: number): AssignmentState {
  const publishAt = Date.parse(assignment.publishAt ?? "");
  if (assignment.status === "DRAFT" || (assignment.status === "SCHEDULED" && !(publishAt <= now)))
    return "SCHEDULED";
  return Date.parse(assignment.deadline ?? "") <= now ? "CLOSED" : "PUBLISHED";
}

export function useAssignmentClock(assignments: Assignment[]) {
  const [now, setNow] = useState(Date.now);
  const nextChangeAt = assignments.reduce((next, assignment) => {
    const status = getAssignmentStatus(assignment, now);
    const date =
      status === "PUBLISHED"
        ? assignment.deadline
        : assignment.status === "SCHEDULED" && status === "SCHEDULED"
          ? assignment.publishAt
          : undefined;
    const time = Date.parse(date ?? "");
    return time > now ? Math.min(next, time) : next;
  }, Infinity);

  useEffect(() => {
    if (!Number.isFinite(nextChangeAt)) return;
    const timeout = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(Math.max(nextChangeAt - Date.now(), 0), 2_147_483_647),
    );
    return () => window.clearTimeout(timeout);
  }, [nextChangeAt, now]);

  return now;
}
