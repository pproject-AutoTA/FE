import { useState } from "react";
import { X } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  /** call:sorted, import:heapq, syntax:For 형식만 허용 */
  validate?: (tag: string) => boolean;
  placeholder?: string;
}
export const TAG_PATTERN = /^(import|call|syntax):\S+$/;
export function TagInput({ tags, onChange, validate = (t) => TAG_PATTERN.test(t), placeholder = "call:sorted" }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState<string>();
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (!validate(t)) return setErr("import:모듈, call:이름, syntax:노드타입 형식으로 입력해주세요");
    if (!tags.includes(t)) onChange([...tags, t]);
    setDraft(""); setErr(undefined);
  };
  return (
    <div>
      <div className="cl-tags">
        {tags.map((t) => (
          <span key={t} className="cl-chip">
            {t}
            <button type="button" aria-label={`${t} 삭제`} onClick={() => onChange(tags.filter((x) => x !== t))}
              style={{ border: 0, background: "none", padding: 0, display: "inline-flex", cursor: "pointer" }}>
              <X size={12} strokeWidth={1.75} />
            </button>
          </span>
        ))}
        <input
          value={draft} placeholder={`+ ${placeholder}`} aria-label="태그 추가"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="cl-chip cl-chip--add" style={{ width: 150 }}
        />
      </div>
      {err && <ErrorMessage>{err}</ErrorMessage>}
    </div>
  );
}
