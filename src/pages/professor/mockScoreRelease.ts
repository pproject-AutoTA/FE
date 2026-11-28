import type { ClassInfo } from "../../mocks/professor";
import type { Assignment } from "./professorAssignments";
import {
  getPendingReviews,
  isScoreReleased,
  type useProfessorMockState,
} from "./professorMockState";

export function getReleaseTasks(
  assignments: Assignment[],
  classes: ClassInfo[],
  state: ReturnType<typeof useProfessorMockState>,
) {
  const pendingReviews = getPendingReviews(state);
  return assignments
    .filter((assignment) => assignment.submitted > 0)
    .map((assignment) => ({
      ...assignment,
      course: classes.find((course) => course.id === assignment.classId)?.title ?? "미배정",
      pending: pendingReviews.filter((review) => review.assignmentKey === assignment.editKey)
        .length,
      released: isScoreReleased(assignment.id, state),
      scheduledAt: state.releases[assignment.id]?.scheduledAt,
    }));
}
