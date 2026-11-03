import { Flag } from "lucide-react";
import { Badge, Card } from "../ui";
import { VerdictBadge } from "./VerdictBadge";

export interface FlagItem { tag: string; line: number; code: string; col?: number }
export function FlagCard({ flags, message = "이번 과제의 허용 범위를 벗어났어요. 점수에는 반영되지 않고, 교수 검토 후 확정돼요." }:
  { flags: FlagItem[]; message?: string }) {
  return (
    <Card title="허용 요소 검사">
      <div style={{ marginBottom: 10 }}>{flags.length > 0 ? <VerdictBadge verdict="FLAG" /> : <Badge tone="success">위반 없음</Badge>}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {flags.map((f) => (
          <div key={`${f.tag}-${f.line}`} className="cl-flagbox">
            <strong><Flag size={16} strokeWidth={1.75} aria-hidden />{f.line}번 줄 · <code style={{ font: "var(--font-mono)" }}>{f.tag}</code></strong>
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-primary)" }}>{f.code}</code>
            <span>{message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
