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
const LH = 31;   // 줄 높이
const PAD = 20;  // 위아래 안쪽 여백
export function CodeEditor({ value, onChange, flagLines = [], filename = "main.py", language = "Python 3.12", readOnly, minLines = 16 }: CodeEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const lines = Math.max(value.split("\n").length, minLines);
  return (
    <div className="cl-editor">
      <div className="cl-editor-head">
        <span className="cl-dots" aria-hidden><i /><i /><i /></span>
        <span className="cl-editor-chips">
          <span className="cl-editor-chip">{language}</span>
          <span className="cl-editor-chip">{filename}</span>
        </span>
      </div>
      <div className="cl-code" style={{ display: "flex", height: lines * LH }}>
        {flagLines.map((n) => (
          <div key={n} aria-hidden style={{ position: "absolute", left: 0, right: 0, top: PAD + (n - 1) * LH, height: LH, background: "rgba(255,176,64,.18)" }} />
        ))}
        <div aria-hidden className="cl-code-gutter">
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
          style={{
            flex: 1, border: 0, outline: 0, resize: "none", background: "transparent", color: "inherit",
            font: "inherit", lineHeight: `${LH}px`, padding: "0 28px 0 0", position: "relative", whiteSpace: "pre", overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
}
