/* ============ NumberedSteps (빠른 시작 같은 번호 목록) ============ */
export function NumberedSteps({ items }: { items: string[] }) {
  return (
    <ol className="m-0 grid list-none p-0">
      {items.map((t, i) => (
        <li key={t} className="flex items-center gap-5 border-b border-border py-5 text-base leading-6 text-fg-body last:border-b-0">
          <span className="grid size-11 flex-none place-items-center rounded-full bg-blue-50 text-base leading-none font-bold text-blue-600">{i + 1}</span>
          {t}
        </li>
      ))}
    </ol>
  );
}
