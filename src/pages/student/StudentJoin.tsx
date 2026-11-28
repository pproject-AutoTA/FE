import { useState, type FormEvent } from "react";
import { BookOpen, Code2, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  FormField,
  PageHeader,
  Pagination,
  useToast,
} from "../../components";

interface JoinedClass {
  id: number;
  /** 수업 이름 왼쪽 칩에 들어가는 짧은 글자 */
  short: string;
  tone: "blue" | "purple" | "green";
  name: string;
  professor: string;
  problems: number;
  /** 마감 전 과제 수 */
  open: number;
}

/* TODO: 참여 중인 수업 API 연결 후 서버 응답으로 교체 */
const CLASSES: JoinedClass[] = [
  {
    id: 1,
    short: "Py",
    tone: "blue",
    name: "Python 프로그래밍 기초",
    professor: "김도현 교수",
    problems: 18,
    open: 3,
  },
  {
    id: 2,
    short: "알고",
    tone: "purple",
    name: "알고리즘",
    professor: "이지훈 교수",
    problems: 16,
    open: 2,
  },
  {
    id: 3,
    short: "컴퓨",
    tone: "green",
    name: "컴퓨팅 사고",
    professor: "최유진 교수",
    problems: 10,
    open: 0,
  },
  {
    id: 4,
    short: "DB",
    tone: "blue",
    name: "데이터베이스",
    professor: "박서연 교수",
    problems: 14,
    open: 1,
  },
  {
    id: 5,
    short: "OS",
    tone: "purple",
    name: "운영체제",
    professor: "정하늘 교수",
    problems: 12,
    open: 2,
  },
  {
    id: 6,
    short: "웹",
    tone: "green",
    name: "웹 프로그래밍",
    professor: "한지민 교수",
    problems: 20,
    open: 4,
  },
  {
    id: 7,
    short: "SW",
    tone: "blue",
    name: "소프트웨어공학",
    professor: "오세준 교수",
    problems: 9,
    open: 0,
  },
];

/** 한 페이지에 보여줄 수업 수 */
const PAGE_SIZE = 3;

const CHIP_TONE = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-bg text-purple-fg",
  green: "bg-success-bg text-success-fg",
} as const;

const EXAMPLE_CODE = "DS-7K92-QX";

export function StudentJoin() {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(CLASSES.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = CLASSES.slice(start, start + PAGE_SIZE);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = code.trim();
    if (!/^[A-Z0-9]+(-[A-Z0-9]+)+$/.test(value))
      return setError("올바른 수업 코드 형식이 아니에요");
    setError(undefined);
    // TODO: 수업 코드 확인·참여 API 연결 (value 전달)
    toast("success", "수업 코드를 확인했어요. 수업에 참여했습니다.");
    setCode("");
  };

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · CLASSES"
        title="수업 참여"
        description="교수에게 받은 수업 코드를 입력해 새로운 수업에 참여하세요."
      />

      <div className="grid grid-cols-[2fr_3fr] items-stretch gap-7">
        <Card
          className="flex flex-col"
          icon={<Plus size={28} strokeWidth={1.75} />}
          title="수업 코드 입력"
          subtitle="코드를 확인한 뒤 참여할 수업 정보를 먼저 보여드려요."
        >
          <form
            onSubmit={submit}
            noValidate
            className="flex flex-1 flex-col border-t border-border pt-8"
          >
            <FormField
              label="수업 코드"
              placeholder={EXAMPLE_CODE}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(undefined);
              }}
              icon={<Code2 size={22} strokeWidth={1.75} />}
              action={
                <Button type="submit" disabled={!code.trim()}>
                  참여하기
                </Button>
              }
              help="영문 대문자, 숫자와 하이픈을 포함한 코드를 입력하세요."
              error={error}
            />

            {/* 안내 박스는 카드 맨 아래에 붙여서, 오른쪽 카드와 높이가 달라도 균형이 맞게 한다 */}
            <div className="mt-auto pt-6">
              <div className="flex gap-4 rounded-xl bg-blue-25 px-7 py-6">
                <BookOpen
                  size={24}
                  strokeWidth={1.75}
                  className="mt-0.5 flex-none text-blue-600"
                  aria-hidden
                />
                <div>
                  <strong className="block text-base leading-6 font-bold text-blue-600">
                    수업 코드는 어디서 받나요?
                  </strong>
                  <p className="m-0 mt-1.5 text-sm leading-[22px] text-fg-secondary">
                    담당 교수가 수업 공지나 강의 시간에 전달한 코드를
                    입력하세요. 예시 코드는{" "}
                    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                      {EXAMPLE_CODE}
                    </code>{" "}
                    입니다.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Card>

        <Card
          className="flex flex-col"
          padding="table"
          title="참여 중인 수업"
          subtitle={`현재 ${CLASSES.length}개 수업에 참여하고 있어요.`}
          action={<Badge tone="info">{CLASSES.length}개</Badge>}
        >
          <div className="min-h-[320px] flex-1">
            <DataTable<JoinedClass>
              rows={pageRows}
              rowKey={(r) => r.id}
              columns={[
                {
                  key: "name",
                  header: "수업",
                  width: "38%",
                  render: (r) => (
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid h-11 w-12 flex-none place-items-center rounded-lg text-xs font-bold ${CHIP_TONE[r.tone]}`}
                      >
                        {r.short}
                      </span>
                      <strong className="text-[15px] font-bold text-fg">
                        {r.name}
                      </strong>
                    </div>
                  ),
                },
                {
                  key: "professor",
                  header: "교수",
                  width: "22%",
                  render: (r) => (
                    <span className="text-sm text-fg-secondary">
                      {r.professor}
                    </span>
                  ),
                },
                {
                  key: "problems",
                  header: "문제 수",
                  width: "17%",
                  render: (r) => (
                    <strong className="text-sm text-fg">{r.problems}개</strong>
                  ),
                },
                {
                  key: "open",
                  header: "마감 전 과제",
                  render: (r) =>
                    r.open > 0 ? (
                      <Badge tone="flag">{r.open}개</Badge>
                    ) : (
                      <Badge tone="neutral">없음</Badge>
                    ),
                },
              ]}
            />
          </div>
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={setPage}
            summary={`총 ${CLASSES.length}개 중 ${start + 1}–${start + pageRows.length}`}
          />
        </Card>
      </div>
    </>
  );
}
