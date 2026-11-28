import {
  AVERAGE_GRADING_SECONDS,
  COMPLETED_SUBMISSIONS,
  FAILURES,
  QUEUE,
  QUEUE_COUNT_FIVE_MINUTES_AGO,
  REGISTERED_WORKERS,
  VERDICTS,
  WORKERS,
} from "../../mocks/admin";
import { AdminLayout } from "./AdminLayout";
import { useState } from "react";
import { Clock3, Flag, History, Server } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Badge,
  Banner,
  BarChart,
  Button,
  Card,
  DataTable,
  DonutChart,
  Modal,
  PageHeader,
  StatCard,
  useToast,
  type Column,
} from "../../components";

const ICON = { size: 24, strokeWidth: 1.75 };
const HOURS = QUEUE.map((_, index) => (index % 2 === 0 ? formatHour(8 + index) : ""));
const STATUS_LABEL = { IDLE: "유휴", GRADING: "채점 중", HEALTHY: "정상" } as const;
const CURRENT_QUEUE_COUNT = QUEUE[QUEUE.length - 1];
const QUEUE_DECREASE = QUEUE_COUNT_FIVE_MINUTES_AGO - CURRENT_QUEUE_COUNT;
const COMPLETED_TOTAL = new Intl.NumberFormat("ko-KR").format(COMPLETED_SUBMISSIONS);

function formatHour(hour: number) {
  return `${hour}시`;
}
function formatSeconds(seconds: number) {
  return `${seconds}초`;
}

const WORKER_COLUMNS: Column<(typeof WORKERS)[number]>[] = [
  { key: "id", header: "워커", render: (row) => <span className="font-mono">{row.id}</span> },
  {
    key: "status",
    header: "상태",
    render: (row) => (
      <Badge tone={row.status === "IDLE" ? "flag" : "success"} dot>
        {STATUS_LABEL[row.status]}
      </Badge>
    ),
  },
  { key: "submission", header: "처리 중인 제출" },
  { key: "runtime", header: "실행 방식" },
  {
    key: "heartbeat",
    header: "최근 응답",
    render: (row) => `${formatSeconds(row.heartbeatSeconds)} 전`,
  },
];
const RETRY_LIMIT = 3;

export function AdminHome() {
  const { state } = useLocation();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [failures, setFailures] = useState(FAILURES);
  const [historyOpen, setHistoryOpen] = useState(Boolean(state?.showHistory));
  const search = query.trim().toLowerCase();
  const failureColumns: Column<(typeof FAILURES)[number]>[] = [
    { key: "id", header: "작업 ID", render: (row) => <span className="font-mono">{row.id}</span> },
    { key: "submission", header: "제출" },
    {
      key: "reason",
      header: "시스템 실패 원인",
      render: (row) => <Badge tone="danger">{row.reason}</Badge>,
    },
    { key: "worker", header: "워커" },
    {
      key: "attempts",
      header: "재시도 횟수",
      render: (row) => (
        <strong>
          {row.attempts} / {RETRY_LIMIT}
        </strong>
      ),
    },
    {
      key: "retry",
      header: "작업",
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          disabled={row.attempts >= RETRY_LIMIT}
          aria-label={`${row.id} 재시도`}
          onClick={() => {
            setFailures((rows) =>
              rows.map((item) =>
                item.id === row.id && item.attempts < RETRY_LIMIT
                  ? { ...item, attempts: item.attempts + 1 }
                  : item,
              ),
            );
            toast("info", `${row.id} 예시 재시도 횟수를 갱신했습니다.`);
          }}
        >
          재시도
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout
      searchPlaceholder="워커, 작업 또는 제출 ID 검색"
      onSearch={setQuery}
      failureCount={failures.length}
      onShowHistory={() => setHistoryOpen(true)}
    >
      <PageHeader
        responsive
        eyebrow="SYSTEM · OPERATIONS"
        title="시스템 운영 현황"
        description="채점 인프라와 작업 큐 상태를 확인합니다."
        actions={
          <>
            <Badge tone="info" dot>
              예시 데이터
            </Badge>
            <Button
              variant="secondary"
              onClick={() => toast("info", "예시 데이터를 표시하고 있습니다.")}
            >
              새로고침
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,255px),1fr))] gap-5">
        <StatCard
          wrapValue
          tone="orange"
          icon={<History {...ICON} />}
          label="큐 대기 건수"
          value={CURRENT_QUEUE_COUNT}
          sub={`5분 전보다 ${QUEUE_DECREASE}건 감소`}
        />
        <StatCard
          wrapValue
          icon={<Server {...ICON} />}
          label="활성 워커"
          value={`${WORKERS.length} / ${REGISTERED_WORKERS}`}
          sub={`${REGISTERED_WORKERS - WORKERS.length}대 확장 대기`}
        />
        <StatCard
          wrapValue
          tone="green"
          icon={<Clock3 {...ICON} />}
          label="평균 채점 시간"
          value={formatSeconds(AVERAGE_GRADING_SECONDS)}
          sub="최근 1시간 기준"
        />
        <StatCard
          wrapValue
          tone="red"
          icon={<Flag {...ICON} />}
          label="채점 실패"
          value={failures.length}
          sub="시스템 오류만 집계"
        />
      </div>
      <div className="grid gap-7 min-[1000px]:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <BarChart
          title="큐 적재량"
          subtitle="최근 12시간 대기 작업 수"
          legend="대기 작업"
          data={QUEUE}
          labels={HOURS}
          plotHeight={300}
          showValues
        />
        <Card title="판정 분포" subtitle={`오늘 완료된 ${COMPLETED_TOTAL}건`}>
          <div className="grid gap-6">
            <DonutChart label="판정별 비율" total={COMPLETED_TOTAL} segments={VERDICTS} />
            <Banner>TLE, MLE, RE는 학생 코드 판정이며 시스템 오류 집계에서 제외됩니다.</Banner>
          </div>
        </Card>
      </div>
      <Card
        title="워커 현황"
        subtitle={`등록된 ${REGISTERED_WORKERS}대 중 현재 ${WORKERS.length}대가 활성 상태입니다.`}
        padding="table"
        action={<Badge tone="success">{WORKERS.length}대 정상</Badge>}
      >
        <div className="overflow-x-auto">
          <DataTable
            horizontalScroll
            columns={WORKER_COLUMNS}
            rows={WORKERS.filter((row) =>
              [row.id, row.submission].some((value) => value.toLowerCase().includes(search)),
            )}
            rowKey={(row) => row.id}
          />
        </div>
      </Card>
      <Card
        title="채점 실패 이력"
        subtitle="컨테이너와 워커에서 발생한 시스템 문제만 표시합니다."
        padding="table"
        action={
          <Button variant="secondary" size="sm" onClick={() => setHistoryOpen(true)}>
            전체 이력
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <DataTable
            horizontalScroll
            columns={failureColumns}
            rows={failures.filter((row) =>
              [row.id, row.submission, row.worker].some((value) =>
                value.toLowerCase().includes(search),
              ),
            )}
            rowKey={(row) => row.id}
          />
        </div>
      </Card>
      <Modal
        open={historyOpen}
        title="전체 채점 실패 이력"
        description="현재 예시 데이터에 기록된 시스템 오류입니다."
        size="lg"
        onClose={() => setHistoryOpen(false)}
      >
        <div className="overflow-x-auto">
          <DataTable
            horizontalScroll
            columns={failureColumns}
            rows={failures}
            rowKey={(row) => row.id}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
}
