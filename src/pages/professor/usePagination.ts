import { useEffect, useState } from "react";

/** 목록을 pageSize 개씩 나눠 보여줄 때 쓰는 훅. resetKey 가 바뀌면(검색어·선택한 수업 등) 1페이지로 돌아간다. */
export function usePagination<T>(rows: T[], pageSize = 10, resetKey: unknown = "", alwaysShow = false) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [resetKey]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    setPage,
    pageCount,
    items: rows.slice(start, start + pageSize),
    /** 기본은 한 페이지에 다 들어가면 페이지 이동 줄을 숨긴다. alwaysShow 면 목록이 있을 때 항상 보여준다 */
    show: alwaysShow ? rows.length > 0 : rows.length > pageSize,
    summary: rows.length ? `총 ${rows.length}개 중 ${start + 1}–${Math.min(start + pageSize, rows.length)}` : "",
  };
}
