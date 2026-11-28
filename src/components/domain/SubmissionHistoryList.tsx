import { Badge, Card } from "../ui";

export interface HistoryItem { no: number; passed: number; total: number; isFinal: boolean }
export function SubmissionHistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <Card title="제출 이력">
      <div className="text-base leading-[38px]">
        {items.map((h) => (
          <div key={h.no} className={h.isFinal ? "" : "text-fg-secondary"}>
            <strong>#{h.no}</strong> · {h.passed} / {h.total} {h.isFinal && <Badge tone="info">최종 반영</Badge>}
          </div>
        ))}
      </div>
    </Card>
  );
}
