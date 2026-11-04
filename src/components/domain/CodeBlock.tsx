export interface CodeBlockProps { code: string; startLine?: number; flagLines?: number[] }
export function CodeBlock({ code, startLine = 1, flagLines = [] }: CodeBlockProps) {
  return (
    <div
      className="rounded-[14px] bg-[#F6F7FA] py-3.5 font-mono text-[15px] leading-[26px] text-fg"
      role="region"
      aria-label="코드"
    >
      {code.split("\n").map((line, i) => {
        const no = startLine + i;
        return (
          <div key={no} className={`flex gap-[18px] px-5 whitespace-pre${flagLines.includes(no) ? " bg-flag-bg" : ""}`}>
            <span className="w-7 flex-none text-right text-fg-tertiary">{no}</span>
            <span>{line || " "}</span>
          </div>
        );
      })}
    </div>
  );
}
