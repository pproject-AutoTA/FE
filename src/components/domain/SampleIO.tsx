/* ============ SampleIO (예제 입력 / 예제 출력) ============ */
const label = "mb-2 block text-sm leading-5 font-bold text-fg";
const box = "rounded-lg bg-[#F6F7FA] p-[18px] font-mono text-base leading-6 whitespace-pre-wrap text-fg";

export function SampleIO({ input, output }: { input: string; output: string }) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div><small className={label}>예제 입력</small><div className={box}>{input}</div></div>
      <div><small className={label}>예제 출력</small><div className={box}>{output}</div></div>
    </div>
  );
}
