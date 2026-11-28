import { useCallback, useEffect, useState } from "react";
import { Clock3, Flag, History, Server } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorMessage,
  Modal,
  PageHeader,
  Pagination,
  StatCard,
  type Column,
} from "../../components";
import { fetchAdminStatus, fetchJudgeFailures, type JudgeFailure } from "../../api/admin";
import { errorMessage } from "../../api/client";
import { AdminLayout } from "./AdminLayout";

const ICON = { size: 24, strokeWidth: 1.75 };
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "Asia/Seoul",
});

function formatFailureDate(value: string) {
  const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}+09:00`;
  const date = Date.parse(withZone);
  return Number.isFinite(date) ? dateFormat.format(date) : "시각 정보 없음";
}

const failureColumns: Column<JudgeFailure>[] = [
  { key: "submissionId", header: "제출 ID" },
  { key: "problemId", header: "문제 ID" },
  { key: "failedAt", header: "최종 실패 시각", render: (row) => formatFailureDate(row.failedAt) },
  { key: "reason", header: "시스템 실패 원인" },
  { key: "retryCount", header: "재시도 횟수", render: (row) => `${row.retryCount}회` },
];

function useAdminLoad<T>(load: (signal: AbortSignal) => Promise<T>, refresh: number) {
  const [result, setResult] = useState<{
    load: typeof load;
    refresh: number;
    value: { data: T } | { error: string };
  }>();
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ load, refresh, value: { data } });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ load, refresh, value: { error: errorMessage(error) } });
        }
      });
    return () => controller.abort();
  }, [load, refresh]);

  return result?.load === load && result.refresh === refresh ? result.value : undefined;
}

export function AdminHome() {
  const { state } = useLocation();
  const [query, setQuery] = useState("");
  const [historyOpen, setHistoryOpen] = useState(Boolean(state?.showHistory));
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const loadFailures = useCallback((signal: AbortSignal) => fetchJudgeFailures(page, signal), [page]);
  const statusResult = useAdminLoad(fetchAdminStatus, refresh);
  const failuresResult = useAdminLoad(loadFailures, refresh);
  const status = statusResult && "data" in statusResult ? statusResult.data : undefined;
  const failures = failuresResult && "data" in failuresResult ? failuresResult.data : undefined;
  const search = query.trim();

  const failureTable = (filtered: boolean) => {
    if (!failuresResult) {
      return (
        <p role="status" className="px-5 py-4 text-sm">
          채점 실패 이력을 불러오는 중이에요.
        </p>
      );
    }
    if ("error" in failuresResult) {
      return (
        <div className="px-5 py-4">
          <ErrorMessage>{failuresResult.error}</ErrorMessage>
        </div>
      );
    }

    const { items, page, size, totalCount } = failuresResult.data;
    const rows = filtered && search
      ? items.filter(({ submissionId, problemId }) =>
          [submissionId, problemId].some((id) => String(id).includes(search)),
        )
      : items;
    const pageCount = Math.max(1, Math.ceil(totalCount / size));
    return (
      <>
        <DataTable
          horizontalScroll
          columns={failureColumns}
          rows={rows}
          rowKey={(row) => row.submissionId}
          empty={
            <EmptyState
              title={filtered && search ? "검색 결과가 없어요" : "채점 실패 이력이 없어요"}
            />
          }
        />
        {totalCount > 0 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={setPage}
            summary={`전체 ${totalCount.toLocaleString("ko-KR")}건`}
          />
        )}
      </>
    );
  };

  return (
    <AdminLayout
      searchPlaceholder="현재 페이지의 제출·문제 ID 검색"
      onSearch={setQuery}
      failureCount={failures?.totalCount}
      onShowHistory={() => setHistoryOpen(true)}
    >
      <PageHeader
        responsive
        eyebrow="SYSTEM · OPERATIONS"
        title="시스템 운영 현황"
        description="채점 인프라와 작업 큐 상태를 확인합니다."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setPage(1);
              setRefresh((value) => value + 1);
            }}
          >
            새로고침
          </Button>
        }
      />
      {!statusResult ? (
        <Card>
          <p role="status" className="text-sm">시스템 현황을 불러오는 중이에요.</p>
        </Card>
      ) : "error" in statusResult ? (
        <Card><ErrorMessage>{statusResult.error}</ErrorMessage></Card>
      ) : status && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5">
            <StatCard
              wrapValue
              tone="orange"
              icon={<History {...ICON} />}
              label="큐 대기 건수"
              value={status.queues.reduce((sum, queue) => sum + queue.ready, 0)}
            />
            <StatCard
              wrapValue
              icon={<Server {...ICON} />}
              label="워커 소비자"
              value={status.workers.judge + status.workers.lint}
              sub={`채점 ${status.workers.judge} · 검사 ${status.workers.lint}`}
            />
            <StatCard
              wrapValue
              tone="green"
              icon={<Clock3 {...ICON} />}
              label="평균 채점 시간"
              value={
                status.avgJudgeTimeMs === null
                  ? "집계 없음"
                  : `${(status.avgJudgeTimeMs / 1000).toLocaleString("ko-KR")}초`
              }
              sub={`오늘 채점 완료 ${status.todayJudged.toLocaleString("ko-KR")}건`}
            />
            <StatCard
              wrapValue
              tone="red"
              icon={<Flag {...ICON} />}
              label="채점 실패"
              value={failures?.totalCount ?? "—"}
            />
          </div>
          {status.queues.length > 0 ? (
            <BarChart
              title="큐별 대기 건수"
              legend="대기 중 메시지"
              data={status.queues.map((queue) => queue.ready)}
              labels={status.queues.map((queue) => queue.name)}
              plotHeight={300}
              showValues
            />
          ) : (
            <Card title="큐별 대기 건수"><EmptyState title="표시할 큐가 없어요" /></Card>
          )}
          <Card title="큐 처리 현황" padding="table">
            <DataTable
              horizontalScroll
              rows={status.queues}
              rowKey={(queue) => queue.name}
              columns={[
                { key: "name", header: "큐" },
                { key: "ready", header: "대기 중" },
                { key: "unacked", header: "처리 중", render: (queue) => queue.unacked ?? "집계 없음" },
              ]}
              empty={<EmptyState title="표시할 큐가 없어요" />}
            />
          </Card>
        </>
      )}
      <Card
        title="채점 실패 이력"
        subtitle="재시도 후 최종 실패한 채점을 최신순으로 확인합니다."
        padding="table"
        action={
          <Button variant="secondary" size="sm" onClick={() => setHistoryOpen(true)}>
            전체 이력
          </Button>
        }
      >
        {failureTable(true)}
      </Card>
      <Modal
        open={historyOpen}
        title="전체 채점 실패 이력"
        size="lg"
        onClose={() => setHistoryOpen(false)}
      >
        {failureTable(false)}
      </Modal>
    </AdminLayout>
  );
}
