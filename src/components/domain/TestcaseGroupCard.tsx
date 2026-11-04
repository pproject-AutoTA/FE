import { Badge } from "../ui";
import { VerdictBadge, type Verdict } from "./VerdictBadge";

export interface TestcaseResult { id: number; isPublic: boolean; verdict: Verdict; timeSec?: number; input?: string; expected?: string }
export interface TestcaseGroup { name: string; results: TestcaseResult[] }

const cell = "border-b border-border p-[22px] text-base leading-6 text-fg-body";

export function TestcaseGroupCard({ group }: { group: TestcaseGroup }) {
  const passed = group.results.filter((r) => r.verdict === "AC").length;
  const total = group.results.length;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between px-[22px] pt-5 pb-1.5">
        <strong className="text-[17px] leading-6 font-bold">{group.name} ({total}건)</strong>
        <Badge tone={passed === total ? "success" : passed === 0 ? "danger" : "amber"}>{passed} / {total}</Badge>
      </div>
      <table className="w-full border-collapse">
        <tbody className="[&>tr:last-child>td]:border-b-0">
          {group.results.map((r) => (
            <tr key={r.id}>
              <td className={cell}>케이스 {r.id}</td>
              <td className={cell}>{r.isPublic ? "공개" : "비공개"}</td>
              <td className={cell}><VerdictBadge verdict={r.verdict} /></td>
              <td className={`${cell} font-mono`}>{r.timeSec?.toFixed(2)}s</td>
              {/* 비공개 케이스는 입출력을 절대 렌더링하지 않는다 */}
              {r.isPublic && r.input !== undefined && (
                <td className={`${cell} font-mono`}>{r.input} → {r.expected}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
