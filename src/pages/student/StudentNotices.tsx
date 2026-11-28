import { useEffect, useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Pagination,
  useToast,
  type Tone,
} from "../../components";
import { linkButtonBase } from "../../components/ui/classes";

interface Notice {
  id: number;
  tag: string;
  tone: Tone;
  title: string;
  preview: string;
  date: string;
  author: string;
  body: string;
  /** FLAG 처리 원칙 안내 박스를 같이 보여줄지 */
  showFlagRule?: boolean;
}

/* TODO: 공지 API 연결 후 서버 응답으로 교체 */
const NOTICES: Notice[] = [
  {
    id: 1,
    tag: "채점",
    tone: "info",
    date: "2025. 05. 22",
    author: "AutoTA 운영팀",
    title: "중간고사 대체 과제 채점 기준 안내",
    preview: "부분 점수 및 허용 요소 검사 기준이 업데이트되었습니다.",
    body: "중간고사 대체 과제의 채점 기준이 변경되었습니다. 테스트케이스 그룹별 부분 점수가 적용되며, FLAG는 오답으로 처리되거나 자동 감점되지 않습니다. 최종 점수는 담당 교수가 제출 코드를 검토한 뒤 확정합니다.",
    showFlagRule: true,
  },
  {
    id: 2,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 21",
    author: "AutoTA 운영팀",
    title: "서버 정기 점검 일정 안내",
    preview: "5월 25일 새벽 서비스 점검이 예정되어 있습니다.",
    body: "5월 25일 02:00부터 약 30분간 서비스 정기 점검이 진행됩니다. 점검 중에는 코드 제출과 채점 결과 확인이 제한될 수 있으니, 마감이 가까운 과제는 미리 제출해 주세요.",
  },
  {
    id: 3,
    tag: "과제",
    tone: "neutral",
    date: "2025. 05. 20",
    author: "자료구조 담당 교수",
    title: "자료구조 과제 마감 임박 안내",
    preview: "괄호 문자열 검사 문제의 마감까지 2일 남았습니다.",
    body: "괄호 문자열 검사 문제의 제출 마감이 2일 남았습니다. 마감 이후에는 제출할 수 없으니 기한 안에 코드를 제출해 주세요.",
  },
  {
    id: 4,
    tag: "수업",
    tone: "neutral",
    date: "2025. 05. 18",
    author: "AutoTA 운영팀",
    title: "Python 실행 환경 업데이트",
    preview: "채점 환경이 Python 3.12로 업데이트되었습니다.",
    body: "채점 환경이 Python 3.12로 업데이트되었습니다. 기존에 제출한 코드는 영향을 받지 않으며, 새로 제출하는 코드부터 변경된 환경에서 채점됩니다.",
  },
  {
    id: 5,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 17",
    author: "AutoTA 운영팀",
    title: "코드 제출 용량 제한 안내",
    preview: "한 번에 제출할 수 있는 코드는 최대 64KB입니다.",
    body: "코드 제출 시 파일 하나당 최대 64KB까지 업로드할 수 있습니다. 용량을 넘으면 제출이 거절되니 불필요한 주석이나 테스트용 입력을 제거한 뒤 제출해 주세요.",
  },
  {
    id: 6,
    tag: "채점",
    tone: "info",
    date: "2025. 05. 16",
    author: "AutoTA 운영팀",
    title: "부분 점수 계산 방식 안내",
    preview: "테스트케이스 그룹별 통과 비율로 점수가 계산됩니다.",
    body: "부분 점수는 테스트케이스 그룹별 통과 비율에 배점을 곱해 계산합니다. 비공개 테스트케이스의 입출력은 공개되지 않으며, 그룹별 통과 개수만 확인할 수 있습니다.",
  },
  {
    id: 7,
    tag: "수업",
    tone: "neutral",
    date: "2025. 05. 15",
    author: "알고리즘 담당 교수",
    title: "알고리즘 수업 코드 변경 안내",
    preview: "수업 참여 코드가 새 학기 코드로 변경되었습니다.",
    body: "알고리즘 수업의 참여 코드가 새 학기 코드로 변경되었습니다. 이미 참여한 학생은 다시 입력할 필요가 없고, 아직 참여하지 않은 학생만 새 코드로 참여해 주세요.",
  },
  {
    id: 8,
    tag: "과제",
    tone: "neutral",
    date: "2025. 05. 14",
    author: "Python 기초 담당 교수",
    title: "Python 기초 과제 점수 공개",
    preview: "1주차 과제 점수가 공개되었습니다.",
    body: "Python 기초 1주차 과제의 점수가 공개되었습니다. 제출 및 채점 결과 화면에서 테스트케이스 결과와 교수 평가를 확인할 수 있습니다.",
  },
  {
    id: 9,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 12",
    author: "AutoTA 운영팀",
    title: "비밀번호 변경 권장 안내",
    preview: "보안을 위해 비밀번호를 주기적으로 변경해 주세요.",
    body: "계정 보안을 위해 비밀번호를 주기적으로 변경하는 것을 권장합니다. 비밀번호를 잊으셨다면 로그인 화면의 비밀번호 찾기를 이용해 주세요.",
  },
];

/** 한 페이지에 보여줄 공지 수 */
const PAGE_SIZE = 4;

export function StudentNotices() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  // 알림에서 넘어온 ?notice=번호 가 있으면 그 공지를 열고, 그 공지가 있는 페이지로 간다
  const fromUrl = NOTICES.findIndex(
    (n) => n.id === Number(params.get("notice")),
  );
  const [selectedId, setSelectedId] = useState(
    NOTICES[fromUrl >= 0 ? fromUrl : 0].id,
  );
  const [page, setPage] = useState(
    Math.floor((fromUrl >= 0 ? fromUrl : 0) / PAGE_SIZE) + 1,
  );
  const selected = NOTICES.find((n) => n.id === selectedId) ?? NOTICES[0];

  // 이미 공지 화면에 있을 때 알림을 눌러도 따라가게 한다
  useEffect(() => {
    if (fromUrl < 0) return;
    setSelectedId(NOTICES[fromUrl].id);
    setPage(Math.floor(fromUrl / PAGE_SIZE) + 1);
  }, [fromUrl, params]);

  const pageCount = Math.ceil(NOTICES.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = NOTICES.slice(start, start + PAGE_SIZE);

  /** 페이지를 옮기면 그 페이지 첫 공지를 열어서, 오른쪽 상세가 목록과 맞게 한다 */
  const changePage = (next: number) => {
    setPage(next);
    setSelectedId(NOTICES[(next - 1) * PAGE_SIZE].id);
  };

  return (
    <>
      <PageHeader
        eyebrow="STUDENT · NOTICES"
        title="전체 공지"
        description="수업, 과제, 채점 및 시스템 관련 안내를 확인하세요."
        actions={
          <Button variant="secondary" onClick={() => navigate("/student")}>
            홈으로 돌아가기
          </Button>
        }
      />

      <div className="grid grid-cols-[4fr_7fr] items-start gap-7">
        {/* 공지 목록 */}
        <Card
          padding="table"
          title="공지 목록"
          action={
            <span className="mt-1 text-xs leading-4 text-fg-secondary">
              총 {NOTICES.length}건
            </span>
          }
        >
          <div className="min-h-[492px] border-t border-border">
            {pageRows.map((n) => {
              const active = n.id === selectedId;
              return (
                <button
                  key={n.id}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => setSelectedId(n.id)}
                  className={`box-border flex w-full cursor-pointer items-center gap-4 border-0 border-b border-solid border-border px-6 py-5 text-left last:border-b-0 ${
                    active
                      ? "bg-blue-25 shadow-[inset_3px_0_0_var(--color-blue-600)]"
                      : "bg-surface hover:bg-[#F9FBFF]"
                  }`}
                >
                  <i
                    className={`size-2 flex-none rounded-full ${active ? "bg-blue-600" : "bg-fg-tertiary/60"}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge tone={n.tone}>{n.tag}</Badge>
                      <span className="text-xs leading-4 text-fg-secondary">
                        {n.date}
                      </span>
                    </div>
                    <strong className="block text-[15px] leading-[22px] font-bold text-fg">
                      {n.title}
                    </strong>
                    <span className="block text-[13px] leading-5 text-fg-secondary">
                      {n.preview}
                    </span>
                  </div>
                  <ChevronRight
                    size={20}
                    strokeWidth={1.75}
                    className="flex-none text-fg-body"
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={changePage}
            summary={`총 ${NOTICES.length}건 중 ${start + 1}–${start + pageRows.length}`}
          />
        </Card>

        {/* 공지 상세 */}
        <article className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <header className="border-b border-border px-10 pt-9 pb-8">
            <Badge tone={selected.tone}>{selected.tag}</Badge>
            <h2 className="mt-5 mb-0 text-[28px] leading-9 font-medium tracking-[-.01em]">
              {selected.title}
            </h2>
            <div className="mt-3 text-sm leading-5 text-blue-600">
              {selected.author} · {selected.date}
            </div>
          </header>

          <div className="flex-1 px-10 pt-9">
            <p className="m-0 text-base leading-[30px] text-fg-body">
              {selected.body}
            </p>

            {selected.showFlagRule && (
              <div className="mt-9 flex gap-4 rounded-xl border border-info-border bg-blue-25 px-6 py-6">
                <ShieldCheck
                  size={24}
                  strokeWidth={1.75}
                  className="flex-none text-blue-600"
                  aria-hidden
                />
                <div>
                  <strong className="block text-base leading-6 font-bold text-blue-600">
                    FLAG 처리 원칙
                  </strong>
                  <span className="mt-1.5 block text-[13px] leading-5 text-fg-secondary">
                    FLAG는 허용 범위를 벗어난 요소를 교수에게 알려주는 검토
                    정보이며 자동 점수에는 영향을 주지 않습니다.
                  </span>
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between border-t border-border px-10 py-6">
            <span className="text-[13px] leading-5 text-fg-secondary">
              이 공지가 도움이 되었나요?
            </span>
            <div className="flex items-center gap-5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast("success", "의견을 남겨 주셔서 감사합니다.")
                }
              >
                도움이 됐어요
              </Button>
              <button
                type="button"
                className={`${linkButtonBase} text-[13px]`}
                onClick={() =>
                  navigate("/contact-admin", {
                    state: { from: "/student/notices" },
                  })
                }
              >
                문의하기
              </button>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
