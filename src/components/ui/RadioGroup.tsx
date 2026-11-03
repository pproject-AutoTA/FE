

export interface RadioGroupProps<V extends string> {
  name: string; value: V; onChange: (v: V) => void;
  options: { value: V; label: string; disabled?: boolean }[];
}
export function RadioGroup<V extends string>({ name, value, onChange, options }: RadioGroupProps<V>) {
  return (
    <div role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className="cl-radio">
          <input type="radio" name={name} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
          <span className="cl-radio-dot" />
          {o.label}
        </label>
      ))}
    </div>
  );
}
