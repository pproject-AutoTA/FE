import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { linkButton } from "./classes";

/* ============ Button ============ */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
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

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const tone =
    variant === "primary"
      ? `border-transparent bg-blue-600 text-white hover:bg-blue-700${size === "lg" ? " shadow-btn" : ""}`
      : "border-border bg-surface text-fg hover:bg-control-hover";
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${variant === "link" ? (className ?? linkButton) : `inline-flex cursor-pointer items-center justify-center gap-2.5 border leading-none font-bold transition-[background-color,box-shadow] duration-[120ms] ${SIZE[size]} ${tone}`} focus-visible:shadow-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
