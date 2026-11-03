import { Badge } from "../ui";
import { VerdictBadge, type Verdict } from "./VerdictBadge";

export interface TestcaseResult { id: number; isPublic: boolean; verdict: Verdict; timeSec?: number; input?: string; expected?: string }
export interface TestcaseGroup { name: string; results: TestcaseResult[] }
export function TestcaseGroupCard({ group }: { group: TestcaseGroup }) {
  const passed = group.results.filter((r) => r.verdict === "AC").length;
  const total = group.results.length;
  return (
    <div className="cl-card cl-card--table">
      <div className="cl-group-head">
        <strong>{group.name} ({total}건)</strong>
        <Badge tone={passed === total ? "success" : passed === 0 ? "danger" : "amber"}>{passed} / {total}</Badge>
      </div>
      <table className="cl-table">
        <tbody>
          {group.results.map((r) => (
            <tr key={r.id}>
              <td>케이스 {r.id}</td>
              <td className="cl-muted">{r.isPublic ? "공개" : "비공개"}</td>
              <td><VerdictBadge verdict={r.verdict} /></td>
              <td className="cl-muted" style={{ fontFamily: "var(--font-mono)" }}>{r.timeSec?.toFixed(2)}s</td>
              {/* 비공개 케이스는 입출력을 절대 렌더링하지 않는다 */}
              {r.isPublic && r.input !== undefined && (
                <td className="cl-muted" style={{ fontFamily: "var(--font-mono)" }}>{r.input} → {r.expected}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
