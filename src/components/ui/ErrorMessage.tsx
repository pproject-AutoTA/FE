import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-sm leading-5 text-danger-fg" role="alert">
      <AlertCircle size={16} strokeWidth={1.75} aria-hidden />
      {children}
    </div>
  );
}
