import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { ErrorMessage } from "./ErrorMessage";

/* ============ Select ============ */
export interface SelectProps<V extends string> {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
  help?: string;
  error?: string;
}
export function Select<V extends string>({ label, value, onChange, options, help, error }: SelectProps<V>) {
  const id = useId();
  return (
    <div className="cl-field">
      <label className="cl-label" htmlFor={id}>{label}</label>
      <div className={`cl-inputwrap${error ? " is-error" : ""}`}>
        <select id={id} value={value} aria-invalid={!!error} onChange={(e) => onChange(e.target.value as V)}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={20} strokeWidth={1.75} aria-hidden />
      </div>
      {error ? <ErrorMessage>{error}</ErrorMessage> : help && <div className="cl-help">{help}</div>}
    </div>
  );
}
