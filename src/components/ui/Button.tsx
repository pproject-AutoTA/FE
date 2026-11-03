import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

/* ============ Button ============ */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  /** sm 42 · md 56 · lg 64 (로그인 같은 주요 버튼) */
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}
export function Button({ variant = "primary", size = "md", loading, icon, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`cl-btn cl-btn--${variant}${size === "sm" ? " cl-btn--sm" : size === "lg" ? " cl-btn--lg" : ""}`}
    >
      {loading ? <Loader2 size={18} className="cl-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
