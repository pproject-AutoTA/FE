import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { fieldHelp, fieldLabel, inputWrap, wrapControl } from "./classes";

/* ============ FormField ============ */
interface FieldBase {
  label: string;
  help?: string;
  error?: string;
  /** 입력창 왼쪽 아이콘 */
  icon?: ReactNode;
  /** 입력창 오른쪽에 붙는 버튼 (예: 참여하기) */
  action?: ReactNode;
}
export function FormField({ label, help, error, multiline, icon, action, ...rest }:
  FieldBase & { multiline?: boolean } & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const aria = { id, "aria-invalid": !!error, "aria-describedby": `${id}-d` };
  const textarea = [
    "box-border min-h-[120px] w-full resize-y rounded-[14px] border bg-surface px-[18px] py-4 text-base leading-[26px] text-fg focus:shadow-ring focus:outline-none",
    error ? "border-danger-fg" : "border-border focus:border-blue-600",
  ].join(" ");
  return (
    <div className="flex flex-col">
      <label className={fieldLabel} htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...(rest as any)} {...aria} className={textarea} />
      ) : (
        <div className={inputWrap(!!error, !!action)}>
          {icon}
          <input {...(rest as any)} {...aria} className={wrapControl} />
          {action}
        </div>
      )}
      <div id={`${id}-d`}>
        {error ? <ErrorMessage>{error}</ErrorMessage> : help && <div className={fieldHelp}>{help}</div>}
      </div>
    </div>
  );
}
