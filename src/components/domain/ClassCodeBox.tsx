import type { ReactNode } from "react";
import { Copy } from "lucide-react";
import { Button } from "../ui";

export function ClassCodeBox({ code, onCopy, onReissue, extra }: { code: string; onCopy?: () => void; onReissue?: () => void; extra?: ReactNode }) {
  return (
    <div>
      <div className="cl-classcode" aria-label={`수업 코드 ${code}`}>{code}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Button
          icon={<Copy size={16} strokeWidth={1.75} />}
          onClick={() => { navigator.clipboard?.writeText(code); onCopy?.(); }}
        >코드 복사</Button>
        <Button variant="secondary" onClick={onReissue}>코드 재발급</Button>
      </div>
      {extra}
    </div>
  );
}
