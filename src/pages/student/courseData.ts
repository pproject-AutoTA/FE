import type { Verdict } from "../../components";
import { errorMessage } from "../../api/client";
import { listCourseAssignments, listMyCourses } from "../../api/courses";
import { useLoad } from "../../api/useLoad";
import { formatDateTime, isClosed, toUiStatus, type UiStatus } from "./format";

export { errorMessage };

/** 문제 목록의 한 줄 (PROB-03의 문제 + 과제 + 수업을 합친 것) */
export interface Problem {
  id: number;
  title: string;
  course: string;
  courseId: number;
  assignmentTitle: string;
  /** 서버가 준 마감 시각 */
  dueAt: string;
  /** 화면에 보여줄 마감일 */
  due: string;
  /** 마감이 지났는지 (화면 안내용, 판정은 서버가 한다) */
  closed: boolean;
  status: UiStatus;
  /** Must 범위에는 점수가 없다 */
  score: number | null;
  released: boolean;
  canResubmit: boolean;
}

/** GRADING: 채점 중 / REVIEWING: 채점 끝, 교수 검토 전 / FAILED: 채점 시스템 실패 */
export type Stage = "GRADING" | "REVIEWING" | "REVIEWED" | "FAILED";

/** 제출 및 결과 목록의 한 줄 (문제마다 내 마지막 제출 1건) */
export interface Submission {
  id: number;
  no: number;
  problemId: number;
  title: string;
  course: string;
  submittedAt: string;
  verdict: Verdict | null;
  passed: number | null;
  total: number;
  score: number | null;
  released: boolean;
  stage: Stage;
}

const dueLabel = (iso: string) =>
  `${Number(iso.slice(5, 7))}월 ${Number(iso.slice(8, 10))}일`;

/** 내 수업마다 과제·문제 목록(PROB-03)을 받아 학생 화면에서 쓰는 두 목록으로 만든다 */
export async function loadStudentCourseData() {
  const courses = await listMyCourses();
  const lists = await Promise.all(
    courses.map(async (course) => ({
      course,
      assignments: await listCourseAssignments(course.id),
    })),
  );

  const problems: Problem[] = [];
  const latest: { s: Omit<Submission, "no">; at: string }[] = [];

  for (const { course, assignments } of lists) {
    for (const a of assignments) {
      for (const p of a.problems) {
        const my = p.mySubmission;
        problems.push({
          id: p.id,
          title: p.title,
          course: course.name,
          courseId: course.id,
          assignmentTitle: a.title,
          dueAt: a.dueAt,
          due: dueLabel(a.dueAt),
          closed: isClosed(a.dueAt),
          status: my ? toUiStatus(my.status) : "NONE",
          score: null,
          released: false,
          canResubmit: p.resubmitAllowed,
        });
        if (my) {
          latest.push({
            at: my.submittedAt,
            s: {
              id: my.submissionId,
              problemId: p.id,
              title: p.title,
              course: course.name,
              submittedAt: formatDateTime(my.submittedAt),
              verdict:
                my.verdict && my.verdict !== "SKIPPED" ? my.verdict : null,
              passed: my.passedCount,
              total: my.totalCount,
              score: null,
              released: false,
              stage:
                my.status === "DONE"
                  ? "REVIEWING"
                  : my.status === "FAILED"
                    ? "FAILED"
                    : "GRADING",
            },
          });
        }
      }
    }
  }

  const submissions: Submission[] = latest
    .sort((x, y) => (x.at < y.at ? 1 : x.at > y.at ? -1 : 0))
    .map((x, i) => ({ ...x.s, no: i + 1 }));

  return { courses, problems, submissions };
}

/** 학생 문제 목록·결과 목록 화면이 함께 쓰는 데이터 불러오기 */
export const useStudentCourseData = () => useLoad(loadStudentCourseData, []);
