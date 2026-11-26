import { Flag } from "lucide-react";
import { Badge, Card } from "../ui";
import { VerdictBadge } from "./VerdictBadge";

export interface FlagItem { tag: string; line: number; code: string; col?: number }
export function FlagCard({ flags, message = "이번 과제의 허용 범위를 벗어났어요. 점수에는 반영되지 않고, 교수 검토 후 확정돼요." }:
  { flags: FlagItem[]; message?: string }) {
  return (
    <Card title="허용 요소 검사">
      <div className="mb-2.5">{flags.length > 0 ? <VerdictBadge verdict="FLAG" /> : <Badge tone="success">위반 없음</Badge>}</div>
      <div className="grid gap-2.5">
        {flags.map((f) => (
          <div
            key={`${f.tag}-${f.line}`}
            className="flex flex-col gap-2 rounded-[14px] bg-flag-bg px-5 py-[18px] text-[15px] leading-6 text-flag-text"
          >
            <strong className="flex items-center gap-2 text-flag-fg">
              <Flag size={16} strokeWidth={1.75} aria-hidden />{f.line}번 줄 · <code className="font-mono">{f.tag}</code>
            </strong>
            <code className="font-mono text-[14px] leading-6 text-fg">{f.code}</code>
            <span>{message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
