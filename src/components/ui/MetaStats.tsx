/* ============ MetaStats (시간 제한 / 메모리 제한 / 배점) ============ */
export function MetaStats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid auto-cols-fr grid-flow-col border-t border-border py-[22px] text-center [&>div+div]:border-l [&>div+div]:border-border">
      {items.map((i) => (
        <div key={i.label}>
          <small className="block text-sm leading-5 text-fg-secondary">{i.label}</small>
          <strong className="block text-xl leading-[30px] font-bold">{i.value}</strong>
        </div>
      ))}
    </div>
  );
}
