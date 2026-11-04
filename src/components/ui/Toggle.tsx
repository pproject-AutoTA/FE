export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-base leading-6">
      <input type="checkbox" role="switch" className="peer hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-7 w-[52px] flex-none rounded-full bg-[#CBD2E0] transition-colors duration-150 peer-checked:bg-blue-600 after:absolute after:top-[3px] after:left-[3px] after:size-[22px] after:rounded-full after:bg-white after:shadow-sm after:transition-[left] after:duration-150 after:content-[''] peer-checked:after:left-[27px]" />
      {label}
    </label>
  );
}
