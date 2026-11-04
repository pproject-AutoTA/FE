import { Flag } from "lucide-react";
import { Badge, type Tone } from "../ui";

export type Verdict = "AC" | "WA" | "TLE" | "MLE" | "RE" | "FLAG";

const VERDICT_TONE: Record<Verdict, Tone> = {
  AC: "success", WA: "danger", TLE: "amber", MLE: "amber", RE: "neutral", FLAG: "flag",
};

/* ============ VerdictBadge ============
 * chip: 목록 왼쪽에 쓰는 둥근 사각형 칩(최근 제출 등) */
export function VerdictBadge({ verdict, chip }: { verdict: Verdict; chip?: boolean }) {
  return (
    <Badge
      tone={VERDICT_TONE[verdict]}
      square={chip}
      icon={verdict === "FLAG" && !chip ? <Flag size={14} strokeWidth={1.75} aria-hidden /> : undefined}
    >
      {verdict}
    </Badge>
  );
}
