import type { SubmissionStatus } from "../../components";
import type { SubmissionApiStatus, SubmissionSummary } from "../../api/types";

/** 화면에서 쓰는 제출 상태. 서버의 FAILED(채점 시스템 실패)는 따로 다룬다 */
export type UiStatus = SubmissionStatus | "FAILED";

export const toUiStatus = (s: SubmissionApiStatus): UiStatus =>
  s === "PENDING" ? "QUEUED" : s;

/** 서버 시각은 Asia/Seoul 기준에 오프셋이 없어서, 브라우저 시간대와 상관없이 한국 시간으로 읽는다 */
export const parseKst = (iso: string) =>
  new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}+09:00`);

/** 마감 시각이 지났는지. 마감 판정은 서버가 하고, 여기서는 화면 안내용으로만 쓴다 */
export const isClosed = (dueAt: string) =>
  Date.now() > parseKst(dueAt).getTime();

const todayKst = () =>
  new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);

/** 2026-11-07T15:08:00 → "11월 7일 15:08" (오늘이면 "오늘 15:08") */
export function formatDateTime(iso: string) {
  const time = iso.slice(11, 16);
  if (iso.slice(0, 10) === todayKst()) return `오늘 ${time}`;
  return `${Number(iso.slice(5, 7))}월 ${Number(iso.slice(8, 10))}일 ${time}`;
}

/** 제출 목록의 한 줄에 보여줄 상태 문구 */
export const submissionLabel = (h: SubmissionSummary) =>
  h.status === "DONE"
    ? `${h.passedCount ?? 0} / ${h.totalCount} 통과`
    : h.status === "PENDING"
      ? "채점 대기 중…"
      : h.status === "RUNNING"
        ? "채점 중…"
        : "채점 실패";
