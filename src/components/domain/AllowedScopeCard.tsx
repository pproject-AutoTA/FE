import { ShieldCheck } from "lucide-react";
import { TagChip } from "../ui";

/* ============ AllowedScopeCard (허용 범위: 금지/허용 태그) ============ */
export interface AllowedScopeCardProps {
  description: string;
  deniedTags?: string[];
  allowedTags?: string[];
}
export function AllowedScopeCard({ description, deniedTags = [], allowedTags = [] }: AllowedScopeCardProps) {
  return (
    <div className="rounded-[18px] border border-[#E1E6FF] bg-[#F7F8FF] p-6">
      <div className="mb-[18px] flex items-center gap-4">
        <span className="grid size-12 flex-none place-items-center rounded-[14px] bg-[#EDEBFF] text-purple-fg">
          <ShieldCheck size={24} strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <strong className="block text-[17px] leading-6 font-bold">허용 범위</strong>
          <span className="block text-sm leading-5 text-fg-secondary">{description}</span>
        </div>
      </div>
      {deniedTags.length > 0 && (
        <div className={allowedTags.length ? "mb-4" : ""}>
          <small className="mb-2.5 block text-sm leading-5 text-fg-secondary">금지 태그</small>
          <div className="flex flex-wrap gap-2.5">
            {deniedTags.map((t) => <TagChip key={t} tone="deny">{t}</TagChip>)}
          </div>
        </div>
      )}
      {allowedTags.length > 0 && (
        <div>
          <small className="mb-2.5 block text-sm leading-5 text-fg-secondary">허용 태그</small>
          <div className="flex flex-wrap gap-2.5">
            {allowedTags.map((t) => <TagChip key={t} tone="allow">{t}</TagChip>)}
          </div>
        </div>
      )}
    </div>
  );
}
