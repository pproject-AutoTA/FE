

export function Skeleton({ width = "100%", height = 16 }: { width?: number | string; height?: number }) {
  return <div className="cl-skel" style={{ width, height }} aria-hidden />;
}
