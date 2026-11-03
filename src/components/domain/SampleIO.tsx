/* ============ SampleIO (예제 입력 / 예제 출력) ============ */
export function SampleIO({ input, output }: { input: string; output: string }) {
  return (
    <div className="cl-sample">
      <div><small>예제 입력</small><div>{input}</div></div>
      <div><small>예제 출력</small><div>{output}</div></div>
    </div>
  );
}
