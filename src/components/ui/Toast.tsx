import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircle, Check, Info } from "lucide-react";

/* ============ Toast ============
 * 연한 색 배경 + 같은 색 테두리/글자 + 단순 선 아이콘(체크). success 초록 / error 빨강 / info 파랑. */
type ToastKind = "info" | "success" | "error";
interface ToastItem { id: number; kind: ToastKind; message: string }
const ToastCtx = createContext<(kind: ToastKind, message: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
const ICON = { success: Check, error: AlertCircle, info: Info } as const;

const KIND: Record<ToastKind, string> = {
  info: "border-info-border bg-info-bg text-info-text [&>svg]:text-info-fg",
  success: "border-[#BFE5D6] bg-success-bg text-success-fg [&>svg]:text-success-fg",
  error: "border-[#F4C6CC] bg-danger-bg text-danger-fg [&>svg]:text-danger-fg",
};

/** 토스트 한 장의 모양. 갤러리에서 정적으로 보여줄 때도 쓴다. */
export function ToastCard({ kind = "info", children }: { kind?: ToastKind; children: ReactNode }) {
  return (
    <div className={`box-border flex w-[420px] max-w-[calc(100vw-32px)] items-center gap-3.5 rounded-[14px] border px-6 py-[18px] text-base leading-6 [&>svg]:flex-none ${KIND[kind]}`}>
      {children}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, kind, message }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed top-7 right-7 z-60 flex flex-col gap-3 [&>div]:shadow-md" aria-live="polite">
        {items.map((t) => {
          const Icon = ICON[t.kind];
          return (
            <ToastCard key={t.id} kind={t.kind}>
              <Icon size={24} strokeWidth={2} aria-hidden />
              {t.message}
            </ToastCard>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
