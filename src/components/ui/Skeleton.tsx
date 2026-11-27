export function Skeleton({
  width = "100%",
  height = 16,
}: {
  width?: number | string;
  height?: number;
}) {
  return (
    <div
      className="animate-shimmer rounded-md bg-linear-to-r from-divider from-25% via-skeleton-highlight via-50% to-divider to-75% bg-[length:200%_100%]"
      style={{ width, height }}
      aria-hidden
    />
  );
}
