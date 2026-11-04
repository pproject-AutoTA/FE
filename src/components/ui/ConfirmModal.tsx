import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

/* 모달 상자 모양(제목/설명/버튼 영역). 갤러리에서 정적으로 보여줄 때도 쓴다. */
export function ModalPanel({ title, description, children, titleId, ...rest }:
  { title: string; description: string; children: ReactNode; titleId?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className="box-border w-[480px] max-w-[calc(100vw-32px)] rounded-modal bg-surface p-9 shadow-lg"
    >
      <h2 id={titleId} className="m-0 mb-2.5 text-[22px] leading-[30px] font-medium">{title}</h2>
      <p className="m-0 mb-7 text-base leading-[26px] text-fg-secondary">{description}</p>
      <div className="flex justify-end gap-3">{children}</div>
    </div>
  );
}

export interface ConfirmModalProps {
  open: boolean; title: string; description: string;
  confirmLabel?: string; cancelLabel?: string; loading?: boolean;
  onConfirm: () => void; onCancel: () => void;
}
export function ConfirmModal({ open, title, description, confirmLabel = "확인", cancelLabel = "취소", loading, onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(17,24,39,.5)]" onMouseDown={onCancel}>
      <ModalPanel
        title={title} description={description} titleId="cm-t"
        role="alertdialog" aria-modal="true" aria-labelledby="cm-t"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
      >
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm} loading={loading} autoFocus>{confirmLabel}</Button>
      </ModalPanel>
    </div>
  );
}
