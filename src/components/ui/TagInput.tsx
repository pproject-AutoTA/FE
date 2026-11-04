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

const chip = "box-border inline-flex h-9 items-center rounded-md px-3.5 py-0 font-mono text-sm leading-none text-fg-body";

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
      <div className="flex flex-wrap gap-2.5">
        {tags.map((t) => (
          <span key={t} className={`${chip} gap-2 bg-neutral-bg`}>
            {t}
            <button type="button" aria-label={`${t} 삭제`} onClick={() => onChange(tags.filter((x) => x !== t))}
              className="inline-flex cursor-pointer border-0 bg-transparent p-0">
              <X size={12} strokeWidth={1.75} />
            </button>
          </span>
        ))}
        <input
          value={draft} placeholder={`+ ${placeholder}`} aria-label="태그 추가"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className={`${chip} w-[150px] gap-2 border border-dashed border-border-strong bg-surface`}
        />
      </div>
      {err && <ErrorMessage>{err}</ErrorMessage>}
    </div>
  );
}
