/* ui 컴포넌트끼리 같이 쓰는 Tailwind 클래스 모음 (index.ts 로 내보내지 않는 내부용) */

/** "전체 보기 →" 같은 텍스트 링크 버튼 */
export const linkButtonBase =
  "inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 leading-5 font-bold text-blue-600";
export const linkButton = `${linkButtonBase} text-[15px]`;

export const fieldLabel = "mb-2.5 text-[15px] leading-5 font-bold text-fg";
export const fieldHelp = "mt-2.5 text-sm leading-5 text-fg-secondary";

/** 아이콘/입력/버튼이 한 줄에 들어가는 입력창 테두리 */
export function inputWrap(error?: boolean, action?: boolean) {
  return [
    "box-border flex h-[58px] items-center gap-3 rounded-[14px] border bg-surface text-fg-tertiary",
    "transition-[border-color,box-shadow] duration-100 focus-within:shadow-ring",
    error ? "border-danger-fg" : "border-border focus-within:border-blue-600",
    action
      ? "overflow-hidden pr-0 pl-[18px] [&>button]:h-auto [&>button]:self-stretch [&>button]:rounded-none"
      : "px-[18px]",
  ].join(" ");
}

/** 입력창 안쪽 input / select */
export const wrapControl =
  "h-full min-w-0 flex-1 border-0 bg-transparent text-base leading-6 text-fg outline-none placeholder:text-fg-tertiary";
