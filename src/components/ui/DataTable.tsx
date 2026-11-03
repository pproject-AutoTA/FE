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
export function DataTable<T extends Record<string, any>>({
  columns, rows, rowKey, onRowClick, loading, empty, error, selectedKey,
}: DataTableProps<T>) {
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (loading) return <div style={{ padding: 24, display: "grid", gap: 14 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}</div>;
  if (rows.length === 0) return <>{empty ?? <EmptyState title="표시할 항목이 없어요" />}</>;
  return (
    <table className="cl-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key} style={{ width: c.width }}>{c.header}</th>)}{onRowClick && <th style={{ width: 56 }} aria-hidden />}</tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const k = rowKey(row);
          return (
            <tr
              key={k}
              className={`${onRowClick ? "is-click" : ""}${selectedKey === k ? " is-selected" : ""}`.trim() || undefined}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
              {onRowClick && <td style={{ width: 56 }}><ChevronRight size={22} strokeWidth={1.75} aria-hidden /></td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
