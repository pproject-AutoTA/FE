import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

/* ============ Modal ============
 * 입력창이 들어가는 모달(수업 만들기, 코드 보기 등). 확인만 받는 모달은 ConfirmModal 을 쓴다.
 * 오버레이 클릭 / ESC 로 닫히고, 열려 있는 동안 role="dialog" 로 읽힌다. */
export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  /** 하단 오른쪽 버튼 영역 (Button 들) */
  footer?: ReactNode;
  size?: "md" | "lg";
  children: ReactNode;
}

const SIZE = { md: "w-[560px]", lg: "w-[760px]" } as const;

export function Modal({ open, title, description, onClose, footer, size = "md", children }: ModalProps) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(17,24,39,.5)] p-4" onMouseDown={onClose}>
      <div
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`box-border max-h-[calc(100vh-32px)] max-w-full overflow-auto rounded-modal bg-surface p-9 shadow-lg ${SIZE[size]}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="m-0 text-[22px] leading-[30px] font-medium">{title}</h2>
            {description && <p className="m-0 mt-2 text-base leading-[26px] text-fg-secondary">{description}</p>}
          </div>
          <button
            type="button" aria-label="닫기" onClick={onClose}
            className="grid size-10 flex-none cursor-pointer place-items-center rounded-lg border-0 bg-neutral-bg text-fg-secondary hover:bg-border"
          >
            <X size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        {children}
        {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
