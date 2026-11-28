import { ROUTES } from "../../routes";
import { useEffect, useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ProfessorLayout,
  Badge,
  Button,
  Card,
  PageHeader,
  Pagination,
  useToast,
} from "../../components";
import { NOTICES } from "../../mocks/professor";

/** 한 페이지에 보여줄 공지 수 */
const PAGE_SIZE = 4;

export function ProfessorNotices() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  // 알림에서 넘어온 ?notice=번호 가 있으면 그 공지를 열고, 그 공지가 있는 페이지로 간다
  const fromUrl = NOTICES.findIndex((n) => n.id === Number(params.get("notice")));
  const [selectedId, setSelectedId] = useState(NOTICES[fromUrl >= 0 ? fromUrl : 0].id);
  const [page, setPage] = useState(Math.floor((fromUrl >= 0 ? fromUrl : 0) / PAGE_SIZE) + 1);
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
    <ProfessorLayout>
      <PageHeader
        responsive
        eyebrow="PROFESSOR · NOTICES"
        title="전체 공지"
        description="수업, 과제, 채점 및 시스템 관련 안내를 확인하세요."
        actions={
          <Button variant="secondary" onClick={() => navigate(ROUTES.professor)}>
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
            <span className="mt-1 text-[13px] leading-4 text-fg-secondary">
              총 {NOTICES.length}건
            </span>
          }
        >
          <div className="min-h-[492px] border-t border-border">
            {pageRows.map((n) => {
              const active = n.id === selectedId;
              return (
                <Button
                  variant="link"
                  key={n.id}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => setSelectedId(n.id)}
                  className={`box-border flex w-full cursor-pointer items-center gap-4 border-0 border-b border-solid border-border px-6 py-5 text-left last:border-b-0 ${
                    active
                      ? "bg-blue-25 shadow-[inset_3px_0_0_var(--color-blue-600)]"
                      : "bg-surface hover:bg-blue-25"
                  }`}
                >
                  <i
                    className={`size-2 flex-none rounded-full ${active ? "bg-blue-600" : "bg-fg-tertiary/60"}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge tone={n.tone}>{n.tag}</Badge>
                      <span className="text-[13px] leading-4 text-fg-secondary">{n.date}</span>
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
                </Button>
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
            <p className="m-0 text-base leading-[30px] text-fg-body">{selected.body}</p>

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
                    FLAG는 허용 범위를 벗어난 요소를 교수에게 알려주는 검토 정보이며 자동 점수에는
                    영향을 주지 않습니다.
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
                onClick={() => toast("success", "의견을 남겨 주셔서 감사합니다.")}
              >
                도움이 됐어요
              </Button>
              <Button
                variant="link"
                type="button"
                onClick={() =>
                  navigate(ROUTES.contactAdmin, {
                    state: { from: ROUTES.professorNotices },
                  })
                }
              >
                문의하기
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </ProfessorLayout>
  );
}
