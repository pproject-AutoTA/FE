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

const SIZE = {
  sm: "h-[42px] rounded-md px-[18px] text-[15px]",
  md: "h-14 rounded-lg px-[26px] text-[17px]",
  lg: "h-16 rounded-[14px] px-8 text-lg",
} as const;

export function Button({ variant = "primary", size = "md", loading, icon, children, disabled, ...rest }: ButtonProps) {
  const tone =
    variant === "primary"
      ? `border-transparent bg-blue-600 text-white hover:bg-blue-700${size === "lg" ? " shadow-btn" : ""}`
      : "border-border bg-surface text-fg hover:bg-[#F7F9FC]";
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2.5 border leading-none font-bold transition-[background-color,box-shadow] duration-[120ms] focus-visible:shadow-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${SIZE[size]} ${tone}`}
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
