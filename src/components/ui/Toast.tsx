import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircle, Check, Info } from "lucide-react";

/* ============ Toast ============
 * 연한 색 배경 + 같은 색 테두리/글자 + 단순 선 아이콘(체크). success 초록 / error 빨강 / info 파랑. */
type ToastKind = "info" | "success" | "error";
interface ToastItem { id: number; kind: ToastKind; message: string }
const ToastCtx = createContext<(kind: ToastKind, message: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
const ICON = { success: Check, error: AlertCircle, info: Info } as const;

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
      <div className="cl-toast-viewport" aria-live="polite">
        {items.map((t) => {
          const Icon = ICON[t.kind];
          return (
            <div key={t.id} className={`cl-toast cl-toast--${t.kind}`}>
              <Icon size={24} strokeWidth={2} aria-hidden />
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
