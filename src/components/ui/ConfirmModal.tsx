import { Button } from "./Button";

export interface ConfirmModalProps {
  open: boolean; title: string; description: string;
  confirmLabel?: string; cancelLabel?: string; loading?: boolean;
  onConfirm: () => void; onCancel: () => void;
}
export function ConfirmModal({ open, title, description, confirmLabel = "확인", cancelLabel = "취소", loading, onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="cl-overlay" onMouseDown={onCancel}>
      <div className="cl-modal" role="alertdialog" aria-modal="true" aria-labelledby="cm-t" onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}>
        <h2 id="cm-t">{title}</h2>
        <p>{description}</p>
        <div className="cl-modal-actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button onClick={onConfirm} loading={loading} autoFocus>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
