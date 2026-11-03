/* ============ ScoreDisplay ============
 * 점수 노출 규칙을 이 컴포넌트에서만 처리한다.
 * released=false(교수가 아직 공개하지 않음)이면 score 값이 들어와도 숫자를 그리지 않는다.
 * submitted=false(미제출)이면 "—" 를 보여준다. */
export interface ScoreDisplayProps { score?: number | null; max?: number; released: boolean; submitted?: boolean }
export function ScoreDisplay({ score, max = 100, released, submitted = true }: ScoreDisplayProps) {
  if (!submitted) return <span className="cl-score-none">—</span>;
  if (!released || score === null || score === undefined) return <span className="cl-score-hidden">공개 전</span>;
  return (
    <span className="cl-score-inline">
      <strong>{score} / {max}</strong>
      <small>공개</small>
    </span>
  );
}
