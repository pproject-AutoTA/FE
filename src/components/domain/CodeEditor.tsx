import { useRef } from "react";

/* ============ CodeEditor ============ */
export interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  /** FLAG가 걸린 줄(1부터) — 제출 직후 강조 */
  flagLines?: number[];
  filename?: string;
  language?: string;
  readOnly?: boolean;
  minLines?: number;
}
const LH = 31;   // 줄 높이 (px) — 줄 수에 따라 계산하는 값이라 style 로 전달
const PAD = 20;  // 위아래 안쪽 여백 (px) — 위 py-5 와 같은 값
export function CodeEditor({ value, onChange, flagLines = [], filename = "main.py", language = "Python 3.12", readOnly, minLines = 16 }: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const lines = Math.max(value.split("\n").length, minLines);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-code-bg text-code-text">
      <div className="flex items-center justify-between border-b border-white/6 px-7 py-5">
        <span className="flex gap-2.5" aria-hidden>
          <span className="size-3.5 rounded-full bg-[#EF6B6B]" />
          <span className="size-3.5 rounded-full bg-[#E7B84F]" />
          <span className="size-3.5 rounded-full bg-[#4BBB77]" />
        </span>
        <span className="flex gap-2.5">
          <span className="rounded-md border border-white/8 bg-code-chip px-3.5 py-[9px] text-sm leading-none font-medium text-[#CDD5E7]">{language}</span>
          <span className="rounded-md border border-white/8 bg-code-chip px-3.5 py-[9px] text-sm leading-none font-medium text-[#CDD5E7]">{filename}</span>
        </span>
      </div>
      <div className="relative box-content flex py-5 font-mono text-[19px] leading-[31px] font-normal" style={{ height: lines * LH }}>
        {flagLines.map((n) => (
          <div
            key={n}
            aria-hidden
            className="absolute inset-x-0 bg-[rgba(255,176,64,.18)]"
            style={{ top: PAD + (n - 1) * LH, height: LH }}
          />
        ))}
        <div aria-hidden className="relative pr-[22px] pl-7 text-right text-code-no">
          {Array.from({ length: lines }, (_, i) => <div key={i} style={{ height: LH }}>{i + 1}</div>)}
        </div>
        <textarea
          ref={ref} value={value} readOnly={readOnly} spellCheck={false} aria-label="Python 코드 입력"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Tab") return;
            e.preventDefault();
            const t = e.currentTarget, s = t.selectionStart;
            onChange(value.slice(0, s) + "    " + value.slice(t.selectionEnd));
            requestAnimationFrame(() => t.setSelectionRange(s + 4, s + 4));
          }}
          className="relative m-0 flex-1 resize-none overflow-hidden border-0 bg-transparent py-0 pr-7 pl-0 text-inherit outline-none whitespace-pre [font:inherit]"
          style={{ lineHeight: `${LH}px` }}
        />
      </div>
    </div>
  );
}
