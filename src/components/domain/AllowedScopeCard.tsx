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
    <div className="cl-scope">
      <div className="cl-scope-head">
        <span className="cl-scope-icon"><ShieldCheck size={24} strokeWidth={1.75} aria-hidden /></span>
        <div><strong>허용 범위</strong><span>{description}</span></div>
      </div>
      {deniedTags.length > 0 && (
        <div style={{ marginBottom: allowedTags.length ? 16 : 0 }}>
          <small>금지 태그</small>
          <div className="cl-tags">{deniedTags.map((t) => <TagChip key={t} tone="deny">{t}</TagChip>)}</div>
        </div>
      )}
      {allowedTags.length > 0 && (
        <div>
          <small>허용 태그</small>
          <div className="cl-tags">{allowedTags.map((t) => <TagChip key={t} tone="allow">{t}</TagChip>)}</div>
        </div>
      )}
    </div>
  );
}
