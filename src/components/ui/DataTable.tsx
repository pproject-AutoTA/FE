import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ErrorMessage } from "./ErrorMessage";
import { Skeleton } from "./Skeleton";

export interface Column<T> {
  key: string;
  header: string;
  width?: number | string;
  render?: (row: T) => ReactNode;
}
export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  empty?: ReactNode;
  error?: string;
  selectedKey?: string | number;
}

const th = "border-b border-border bg-th-bg px-[22px] py-4 text-left text-sm leading-5 font-medium text-fg-secondary";
const td = "border-b border-border p-[22px] text-base leading-6 text-fg-body";

export function DataTable<T extends Record<string, any>>({
  columns, rows, rowKey, onRowClick, loading, empty, error, selectedKey,
}: DataTableProps<T>) {
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (loading) return <div className="grid gap-3.5 p-6">{[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}</div>;
  if (rows.length === 0) return <>{empty ?? <EmptyState title="표시할 항목이 없어요" />}</>;
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>{columns.map((c) => <th key={c.key} className={th} style={{ width: c.width }}>{c.header}</th>)}{onRowClick && <th className={th} style={{ width: 56 }} aria-hidden />}</tr>
      </thead>
      <tbody className="[&>tr:last-child>td]:border-b-0">
        {rows.map((row) => {
          const k = rowKey(row);
          const cls = [
            onRowClick ? "cursor-pointer hover:bg-[#F9FBFF]" : "",
            selectedKey === k ? "[&>td]:bg-blue-50 [&>td:first-child]:shadow-[inset_4px_0_0_var(--color-blue-600)]" : "",
          ].join(" ").trim();
          return (
            <tr key={k} className={cls || undefined} onClick={() => onRowClick?.(row)}>
              {columns.map((c) => <td key={c.key} className={td}>{c.render ? c.render(row) : row[c.key]}</td>)}
              {onRowClick && <td className={td} style={{ width: 56 }}><ChevronRight size={22} strokeWidth={1.75} aria-hidden /></td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
