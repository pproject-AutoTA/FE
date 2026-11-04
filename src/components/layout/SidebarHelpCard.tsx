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
    <div className="mx-0.5 mb-[22px] rounded-2xl bg-[rgba(255,255,255,.07)] px-[22px] pt-[22px] pb-6">
      <span className="mb-6 grid size-[46px] place-items-center rounded-lg bg-[rgba(255,255,255,.14)]"><BookOpen size={22} strokeWidth={1.75} aria-hidden /></span>
      <h4 className="m-0 mb-2 text-xl leading-7 font-bold">{title}</h4>
      <p className="m-0 mb-4 text-[15px] leading-6 text-[#C7D3EA]">{description}</p>
      <button type="button" className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-base leading-[22px] font-bold text-white" onClick={onClick}>
        {linkLabel}
        <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
