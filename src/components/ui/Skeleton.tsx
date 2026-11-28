export function Skeleton({ width = "100%", height = 16 }: { width?: number | string; height?: number }) {
  return (
    <div
      className="animate-shimmer rounded-md bg-[linear-gradient(90deg,#EEF1F6_25%,#F8F9FC_50%,#EEF1F6_75%)] bg-[length:200%_100%]"
      style={{ width, height }}
      aria-hidden
    />
  );
}
