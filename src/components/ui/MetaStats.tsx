/* ============ MetaStats (시간 제한 / 메모리 제한 / 배점) ============ */
export function MetaStats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="cl-metastats">
      {items.map((i) => (
        <div key={i.label}><small>{i.label}</small><strong>{i.value}</strong></div>
      ))}
    </div>
  );
}
