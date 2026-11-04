import { Card, FormField } from "../ui";

export interface ScoreBreakdownProps {
  groupScore: number;
  latePenalty: number;
  adjustment: number;
  onAdjustmentChange: (v: number) => void;
  reason: string;
  onReasonChange: (v: string) => void;
  /** 조정값이 0이 아닌데 사유가 비어 있으면 에러 */
  reasonError?: string;
}

const label = "block text-sm leading-5 text-fg-secondary";
const score = "text-[28px] leading-9 font-bold";

export function ScoreBreakdown(p: ScoreBreakdownProps) {
  const final = p.groupScore - p.latePenalty + p.adjustment;
  return (
    <Card title="점수 산출">
      <div className="grid grid-cols-[repeat(4,1fr)] items-end gap-4">
        <div><small className={label}>그룹 점수 합</small><span className={score}>{p.groupScore}</span></div>
        <div><small className={label}>− 지각 감점</small><span className={score}>{p.latePenalty}</span></div>
        <FormField label="± 교수 조정" type="number" value={p.adjustment} onChange={(e) => p.onAdjustmentChange(Number(e.target.value))} />
        <div><small className={label}>= 확정 점수</small><span className={`${score} text-blue-600`}>{final}</span></div>
      </div>
      <div className="mt-4">
        <FormField label="조정 사유 (필수)" multiline value={p.reason} onChange={(e) => p.onReasonChange(e.target.value)} error={p.reasonError} />
      </div>
    </Card>
  );
}
