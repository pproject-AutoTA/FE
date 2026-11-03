/* ============ NumberedSteps (빠른 시작 같은 번호 목록) ============ */
export function NumberedSteps({ items }: { items: string[] }) {
  return (
    <ol className="cl-steps">
      {items.map((t, i) => (
        <li key={t} className="cl-stepitem">
          <span className="cl-stepnum">{i + 1}</span>
          {t}
        </li>
      ))}
    </ol>
  );
}
