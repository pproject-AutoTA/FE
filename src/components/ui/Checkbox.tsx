/* ============ Checkbox ============ */
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-3 text-[15px] leading-5 text-fg-body">
      <input type="checkbox" className="peer absolute m-0 size-5 opacity-0" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        className="relative box-border size-5 flex-none rounded-sm border-[1.5px] border-border-strong bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus-visible:shadow-ring after:absolute after:top-px after:left-[5px] after:hidden after:h-2.5 after:w-[5px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-white after:content-[''] peer-checked:after:block"
      />
      {label}
    </label>
  );
}
