export interface RadioGroupProps<V extends string> {
  name: string; value: V; onChange: (v: V) => void;
  options: { value: V; label: string; disabled?: boolean }[];
}
export function RadioGroup<V extends string>({ name, value, onChange, options }: RadioGroupProps<V>) {
  return (
    <div role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className="mb-3 flex cursor-pointer items-center gap-3 text-base leading-6">
          <input type="radio" className="peer hidden" name={name} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
          <span className="box-border grid size-5 place-items-center rounded-full border-[1.5px] border-border-strong bg-white peer-checked:border-blue-600 after:hidden after:size-2.5 after:rounded-full after:bg-blue-600 after:content-[''] peer-checked:after:block" />
          {o.label}
        </label>
      ))}
    </div>
  );
}
