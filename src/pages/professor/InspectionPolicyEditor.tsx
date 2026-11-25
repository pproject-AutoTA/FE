import { useState, type FormEvent } from "react";
import { Ban, ListChecks, Plus, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  Select,
  SelectCard,
} from "../../components";
import type { InspectionPolicy } from "./savedProblems";

const basicTags = ["print", "len", "range"];

export function InspectionPolicyEditor({
  policy,
  onChange,
  disabled,
}: {
  policy: InspectionPolicy;
  onChange: (policy: InspectionPolicy) => void;
  disabled: boolean;
}) {
  const [tag, setTag] = useState("");
  const [required, setRequired] = useState(false);
  const [error, setError] = useState("");
  const listKey = policy.mode === "deny" ? "deniedTags" : "allowedTags";
  const listLabel = policy.mode === "deny" ? "금지" : "허용";
  const entries = [
    ...policy[listKey].map(
      (value) => ({ value, key: listKey, label: listLabel }) as const,
    ),
    ...policy.requiredTags.map((value) => ({
      value,
      key: "requiredTags" as const,
      label: "필수",
    })),
  ];

  const selectMode = (mode: InspectionPolicy["mode"]) => {
    if (disabled) return;
    onChange({ ...policy, mode });
    setError("");
  };
  const addTag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = tag.trim();
    const key = required ? "requiredTags" : listKey;
    if (!/^(import|call|syntax):[^\s:]+$/u.test(value)) {
      setError(
        "import:heapq, call:sorted, syntax:ListComp 형식으로 입력해주세요.",
      );
      return;
    }
    if (policy[key].includes(value)) {
      setError("이미 등록된 태그예요.");
      return;
    }
    if (
      (key === "deniedTags" && policy.requiredTags.includes(value)) ||
      (key === "requiredTags" && policy.deniedTags.includes(value))
    ) {
      setError("같은 태그를 금지와 필수로 동시에 설정할 수 없어요.");
      return;
    }
    onChange({ ...policy, [key]: [...policy[key], value] });
    setTag("");
    setError("");
  };

  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-4">
      <Card
        title="검사 방식"
        subtitle="허용 요소를 벗어난 제출을 어떻게 걸러낼지 정해요."
      >
        <div role="radiogroup" aria-label="검사 방식" className="grid gap-3.5">
          <SelectCard
            icon={<Ban size={26} strokeWidth={1.75} />}
            title="금지 목록 방식"
            description="지정한 요소를 사용하면 FLAG 처리"
            selected={policy.mode === "deny"}
            onSelect={() => selectMode("deny")}
          />
          <SelectCard
            icon={<ListChecks size={26} strokeWidth={1.75} />}
            title="허용 목록 방식"
            description="허용한 요소 외의 요소를 사용하면 FLAG 처리"
            selected={policy.mode === "allow"}
            onSelect={() => selectMode("allow")}
          />
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <p className="m-0 mb-3 text-sm leading-5 text-fg-secondary">
            기본 허용 요소
          </p>
          <div className="flex flex-wrap gap-2.5">
            {basicTags.map((value) => (
              <code
                key={value}
                className="rounded-md bg-success-bg px-3.5 py-2 font-mono text-sm leading-none text-success-fg"
              >
                {value}
              </code>
            ))}
          </div>
        </div>
      </Card>

      <Card
        title={`${listLabel}·필수 태그`}
        subtitle="태그 위반은 FLAG 검토 항목으로 표시됩니다."
      >
        {entries.length > 0 ? (
          <ul className="m-0 mb-6 list-none overflow-hidden rounded-xl border border-border p-0">
            {entries.map(({ value, key, label }) => (
              <li
                key={`${key}-${value}`}
                className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"
              >
                <code className="min-w-0 flex-1 font-mono text-[15px] leading-6 text-purple-fg [overflow-wrap:anywhere]">
                  {value}
                </code>
                <Badge
                  tone={
                    key === "requiredTags"
                      ? "info"
                      : key === "deniedTags"
                        ? "flag"
                        : "success"
                  }
                >
                  {label}
                </Badge>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`${label} 태그 ${value} 삭제`}
                  className="grid size-9 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-fg-secondary hover:bg-danger-bg hover:text-danger-fg disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    onChange({
                      ...policy,
                      [key]: policy[key].filter((item) => item !== value),
                    });
                    setError("");
                  }}
                >
                  <X size={18} strokeWidth={1.75} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mb-6 rounded-xl bg-bg">
            <EmptyState
              title="등록된 태그가 없어요"
              description="아래에서 태그를 추가해 검사 기준을 정해 보세요."
            />
          </div>
        )}
        <form
          onSubmit={addTag}
          className="grid grid-cols-[minmax(0,1fr)_200px] items-start gap-4"
        >
          <FormField
            label="태그"
            placeholder="예: call:sorted"
            value={tag}
            disabled={disabled}
            error={error || undefined}
            onChange={(event) => {
              setTag(event.target.value);
              setError("");
            }}
            action={
              <Button
                type="submit"
                disabled={disabled}
                icon={<Plus size={18} strokeWidth={1.75} />}
              >
                태그 추가
              </Button>
            }
          />
          <Select
            label="태그 유형"
            value={required ? "required" : "mode"}
            onChange={(value) => {
              setRequired(value === "required");
              setError("");
            }}
            options={[
              { value: "mode", label: listLabel },
              { value: "required", label: "필수" },
            ]}
          />
        </form>
      </Card>
    </div>
  );
}
