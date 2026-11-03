

export interface CodeBlockProps { code: string; startLine?: number; flagLines?: number[] }
export function CodeBlock({ code, startLine = 1, flagLines = [] }: CodeBlockProps) {
  return (
    <div className="cl-codeblock" role="region" aria-label="코드">
      {code.split("\n").map((line, i) => {
        const no = startLine + i;
        return (
          <div key={no} className={`cl-code-line${flagLines.includes(no) ? " is-flag" : ""}`}>
            <span className="cl-code-no">{no}</span>
            <span>{line || " "}</span>
          </div>
        );
      })}
    </div>
  );
}
