import { ArrowRight, BookOpen } from "lucide-react";

/* ---------- SidebarHelpCard ---------- */
export interface SidebarHelpCardProps {
  title?: string;
  description?: string;
  linkLabel?: string;
  onClick?: () => void;
}
export function SidebarHelpCard({
  title = "도움이 필요하신가요?",
  description = "이용 가이드에서 채점 기준과 제출 방법을 확인하세요.",
  linkLabel = "이용 가이드 보기",
  onClick,
}: SidebarHelpCardProps) {
  return (
    <div className="cl-sbhelp">
      <span className="cl-sbhelp-icon"><BookOpen size={22} strokeWidth={1.75} aria-hidden /></span>
      <h4>{title}</h4>
      <p>{description}</p>
      <button type="button" onClick={onClick}>
        {linkLabel}
        <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
