import { useSyncExternalStore } from "react";
import { REVIEWS } from "../../mocks/professor";

type ReleaseState = { released?: boolean; scheduledAt?: string };
type ReviewStatus = "held" | "confirmed";

const initiallyReleased = new Set([8]);
let snapshot = {
  resolved: {} as Record<number, ReviewStatus>,
  releases: {} as Record<number, ReleaseState>,
};
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProfessorMockState() {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function setReviewStatus(id: number, status: ReviewStatus) {
  snapshot = { ...snapshot, resolved: { ...snapshot.resolved, [id]: status } };
  listeners.forEach((listener) => listener());
}

export function setScoreRelease(id: number, release: ReleaseState) {
  snapshot = { ...snapshot, releases: { ...snapshot.releases, [id]: release } };
  listeners.forEach((listener) => listener());
}

export function isScoreReleased(id: number, state: typeof snapshot) {
  return initiallyReleased.has(id) || state.releases[id]?.released === true;
}

export function getPendingReviews(state: typeof snapshot) {
  return REVIEWS.filter(
    (review) =>
      !state.resolved[review.id] &&
      !Object.entries(state.releases).some(
        ([id, release]) => release.released && review.assignmentKey === `sample-${id}`,
      ),
  );
}
