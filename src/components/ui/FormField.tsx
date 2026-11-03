import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { ErrorMessage } from "./ErrorMessage";

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
  return (
    <div className="cl-field">
      <label className="cl-label" htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...(rest as any)} {...aria} className={`cl-input${error ? " is-error" : ""}`} />
      ) : (
        <div className={`cl-inputwrap${error ? " is-error" : ""}${action ? " cl-inputwrap--action" : ""}`}>
          {icon}
          <input {...(rest as any)} {...aria} />
          {action}
        </div>
      )}
      <div id={`${id}-d`}>
        {error ? <ErrorMessage>{error}</ErrorMessage> : help && <div className="cl-help">{help}</div>}
      </div>
    </div>
  );
}
