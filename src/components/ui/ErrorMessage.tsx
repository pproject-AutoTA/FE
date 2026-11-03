import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <div className="cl-error" role="alert">
      <AlertCircle size={16} strokeWidth={1.75} aria-hidden />
      {children}
    </div>
  );
}
