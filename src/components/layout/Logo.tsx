/* ---------- Logo (AutoTA) ---------- */
export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <div className="flex items-center gap-3.5 pl-4">
      <span className="grid size-[42px] flex-none place-items-center rounded-[11px] bg-white" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path d="M12 3.5 4.5 20.5h3.4l1.4-3.4h5.4l1.4 3.4h3.4L12 3.5Zm0 7.2 1.9 4.6h-3.8L12 10.7Z" fill="#1D6FF2" />
        </svg>
      </span>
      <span>
        <span className="block text-[30px] leading-8 font-bold tracking-[-.02em] text-white">Auto<b className="font-bold text-blue-600">TA</b></span>
        {tagline && (
          <span className="mt-px block text-[9.5px] leading-3 font-bold tracking-[.02em] text-[#C7D3EA] uppercase">Automated Teaching Assistant</span>
        )}
      </span>
    </div>
  );
}
