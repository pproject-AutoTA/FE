import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  IndexChip,
  ListRow,
  PageHeader,
  ProgressRing,
  StatCard,
  VerdictBadge,
  type Verdict,
} from "../../components";
import { linkButtonBase } from "../../components/ui/classes";

/* TODO: 아래 mock 데이터는 API 연결 후 서버 응답으로 교체 */
const NAME = "민준";
const SEMESTER = "2025년 봄학기";

const ACTIVE_PROBLEMS: {
  no: string;
  title: string;
  course: string;
  problemId: number;
  due: string;
  urgent?: boolean;
  percent: number | null;
  tone: "blue" | "purple" | "orange";
}[] = [
  {
    no: "02",
    title: "괄호 문자열 검사",
    course: "자료구조",
    problemId: 2,
    due: "5월 28일",
    urgent: true,
    percent: 40,
    tone: "blue",
  },
  {
    no: "03",
    title: "최단 경로 찾기",
    course: "알고리즘",
    problemId: 3,
    due: "5월 31일",
    percent: 0,
    tone: "purple",
  },
  {
    no: "04",
    title: "우선순위 큐 구현",
    course: "자료구조",
    problemId: 4,
    due: "6월 4일",
    percent: null,
    tone: "orange",
  },
];

const RECENT: { verdict: Verdict; title: string; meta: string }[] = [
  { verdict: "AC", title: "두 수의 합", meta: "오늘 14:32 · 100점" },
  { verdict: "WA", title: "스택 수열", meta: "어제 21:18 · 60점" },
  { verdict: "FLAG", title: "정렬 알고리즘", meta: "5월 20일 · 검토 중" },
];

export function StudentHome() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow={SEMESTER}
        title={`안녕하세요, ${NAME}님`}
        description="마감이 가까운 과제를 확인하고 학습을 이어가세요."
      />

      <div className="grid grid-cols-4 gap-[22px]">
        <StatCard
          tone="blue"
          icon={<BookOpen size={28} strokeWidth={1.75} />}
          label="진행 중 과제"
          value={3}
          sub="이번 주 마감 2개"
        />
        <StatCard
          tone="green"
          icon={<CheckCircle2 size={28} strokeWidth={1.75} />}
          label="완료한 문제"
          value={12}
          sub="전체 18개 중"
        />
        <StatCard
          tone="purple"
          icon={<FileText size={28} strokeWidth={1.75} />}
          label="공개된 점수 평균"
          value="87.5"
          sub="지난주보다 4.2 상승"
        />
        <StatCard
          tone="orange"
          icon={<Clock3 size={28} strokeWidth={1.75} />}
          label="확정 대기"
          value={1}
          sub="교수 확인 대기 1건"
        />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-7">
        <Card
          padding="table"
          title="진행 중 과제"
          subtitle="마감일이 가까운 순서로 표시됩니다."
          action={
            <button
              type="button"
              className={`${linkButtonBase} inline-flex items-center gap-2 text-sm`}
              onClick={() => navigate("/student/problems")}
            >
              전체 보기
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
          }
        >
          <div className="border-t border-border">
            {ACTIVE_PROBLEMS.map((p) => (
              <ListRow
                key={p.problemId}
                leading={<IndexChip tone={p.tone}>{p.no}</IndexChip>}
                title={p.title}
                subtitle={`${p.course} · 문제 #${p.no}`}
                trailing={
                  <div className="flex items-center gap-10">
                    <div className="w-24">
                      <small className="block text-sm leading-5 text-fg-secondary">
                        마감
                      </small>
                      <strong
                        className={`block text-base leading-6 font-bold ${p.urgent ? "text-danger-fg" : "text-fg"}`}
                      >
                        {p.due}
                      </strong>
                    </div>
                    <ProgressRing percent={p.percent} />
                  </div>
                }
                onClick={() => navigate("/student/problems")}
              />
            ))}
          </div>
        </Card>

        <Card title="최근 제출" subtitle="내 채점 현황">
          <ul className="m-0 mb-6 list-none p-0">
            {RECENT.map((r) => (
              <li
                key={r.title}
                className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
              >
                <VerdictBadge verdict={r.verdict} chip />
                <div>
                  <strong className="block text-base leading-6 font-bold">
                    {r.title}
                  </strong>
                  <span className="block text-sm leading-5 text-fg-secondary">
                    {r.meta}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="[&>button]:w-full">
            <Button
              variant="secondary"
              onClick={() => navigate("/student/results")}
            >
              제출 이력 확인
            </Button>
          </div>
        </Card>
      </div>

      {/* 공지 */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-border bg-surface px-[30px] py-6 text-left shadow-sm hover:bg-[#F9FBFF]"
        onClick={() => navigate("/student")} // TODO: 공지 상세로 이동
      >
        <span className="grid size-14 flex-none place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Bell size={24} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Badge tone="info">공지</Badge>
            <strong className="text-[17px] leading-6 font-bold">
              중간고사 대체 과제 채점 기준 안내
            </strong>
          </div>
          <span className="mt-2 block text-sm leading-5 text-fg-secondary">
            부분 점수 및 허용 요소 검사 기준이 업데이트되었습니다.
          </span>
        </div>
        <span className="text-sm leading-5 text-fg-secondary">2시간 전</span>
        <ChevronRight
          size={22}
          strokeWidth={1.75}
          className="flex-none text-fg-body"
          aria-hidden
        />
      </button>
    </>
  );
}
