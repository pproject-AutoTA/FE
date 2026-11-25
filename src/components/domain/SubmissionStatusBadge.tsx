import { Badge, type Tone } from "../ui";

export type SubmissionStatus = "NONE" | "QUEUED" | "RUNNING" | "DONE";

const STATUS_META: Record<SubmissionStatus, { label: string; tone: Tone }> = {
  NONE: { label: "미제출", tone: "neutral" },
  QUEUED: { label: "대기", tone: "flag" },
  RUNNING: { label: "채점 중", tone: "info" },
  DONE: { label: "채점 완료", tone: "success" },
};

/* ============ SubmissionStatusBadge ============ */
export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const m = STATUS_META[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
