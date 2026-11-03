/* ---------- Logo (AutoTA) ---------- */
export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <div className="cl-logo">
      <span className="cl-logo-mark" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path d="M12 3.5 4.5 20.5h3.4l1.4-3.4h5.4l1.4 3.4h3.4L12 3.5Zm0 7.2 1.9 4.6h-3.8L12 10.7Z" fill="#1D6FF2" />
        </svg>
      </span>
      <span>
        <span className="cl-logo-word">Auto<b>TA</b></span>
        {tagline && <span className="cl-logo-sub">Automated Teaching Assistant</span>}
      </span>
    </div>
  );
}
