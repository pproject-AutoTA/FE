import { Bell, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Banner,
  Button,
  Card,
  NumberedSteps,
  PageHeader,
  VerdictBadge,
  type Verdict,
} from "../../components";

const STEPS = [
  "문제 목록에서 마감과 재제출 가능 여부를 확인해요.",
  "Python 코드를 작성하고 제출하면 대기열에 등록돼요.",
  "대기 → 채점 중 → 결과 확인 순서로 진행돼요.",
  "교수가 확정한 뒤 최종 점수를 확인할 수 있어요.",
];

const VERDICTS: { verdict: Verdict; name: string; desc: string }[] = [
  { verdict: "AC", name: "정답", desc: "모든 테스트케이스 통과" },
  { verdict: "WA", name: "오답", desc: "일부 출력이 정답과 다름" },
  { verdict: "TLE", name: "시간 초과", desc: "제한 시간 안에 실행되지 않음" },
  { verdict: "MLE", name: "메모리 초과", desc: "허용 메모리를 초과함" },
  { verdict: "RE", name: "런타임 에러", desc: "실행 중 오류가 발생함" },
  { verdict: "FLAG", name: "검토 필요", desc: "허용 범위를 벗어난 요소 사용" },
];

export function StudentGuide() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow="AUTOTA · HELP CENTER"
        title="학생 이용 가이드"
        description="처음부터 차근차근 AutoTA 사용 방법을 확인하세요."
        actions={
          <Button variant="secondary" onClick={() => navigate("/student")}>
            내 화면으로 돌아가기
          </Button>
        }
      />

      <div className="grid gap-6">
        {/* 소개 */}
        <section className="flex items-center justify-between gap-8 rounded-2xl border border-info-border bg-gradient-to-r from-blue-25 to-blue-50 px-10 py-9">
          <div>
            <Badge tone="info">학생 가이드</Badge>
            <h2 className="mt-5 mb-0 text-[28px] leading-9 font-medium tracking-[-.01em]">
              AutoTA를 처음 사용하시나요?
            </h2>
            <p className="mt-2.5 mb-0 text-sm leading-5 text-fg-secondary">
              아래 핵심 흐름을 따라가면 과제 제출부터 채점 결과 확인까지 쉽게
              이용할 수 있어요.
            </p>
          </div>
          <span
            className="grid size-[102px] flex-none place-items-center rounded-3xl bg-surface text-blue-600 shadow-sm"
            aria-hidden
          >
            <Code2 size={44} strokeWidth={1.75} />
          </span>
        </section>

        <div className="grid grid-cols-[3fr_2fr] items-stretch gap-6">
          <Card title="빠른 시작" subtitle="역할별 기본 이용 순서">
            <NumberedSteps items={STEPS} />
          </Card>
          <Card title="꼭 알아두세요" subtitle="채점과 권한 관련 주요 안내">
            <div className="grid gap-4">
              <Banner type="warning">
                FLAG는 오답이 아니며 점수를 자동으로 깎지 않아요.
              </Banner>
              <Banner type="info">
                재제출 가능 문제는 마지막 제출이 성적에 반영돼요.
              </Banner>
            </div>
          </Card>
        </div>

        {/* 판정 코드 */}
        <Card
          title="판정 코드 안내"
          subtitle="AutoTA에서 사용하는 여섯 가지 판정입니다."
        >
          <div className="grid grid-cols-3 gap-4">
            {VERDICTS.map((v) => (
              <div
                key={v.verdict}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-5"
              >
                <VerdictBadge verdict={v.verdict} chip />
                <div>
                  <strong className="block text-[15px] leading-5 font-bold">
                    {v.name}
                  </strong>
                  <span className="block text-xs leading-4 text-fg-secondary">
                    {v.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 문의 */}
        <section className="flex items-center gap-5 rounded-2xl border border-border bg-surface px-7 py-7 shadow-sm">
          <span
            className="grid size-[52px] flex-none place-items-center rounded-xl bg-[#EFEAFF] text-[#6D4AFF]"
            aria-hidden
          >
            <Bell size={24} strokeWidth={1.75} />
          </span>
          <div>
            <strong className="block text-base leading-6 font-bold">
              찾는 내용이 없나요?
            </strong>
            <span className="block text-[13px] leading-5 text-fg-secondary">
              서비스 관리자에게 문의하면 계정과 이용 문제를 도와드려요.
            </span>
          </div>
          <div className="ml-auto">
            <Button
              variant="secondary"
              onClick={() =>
                navigate("/contact-admin", {
                  state: { from: "/student/guide" },
                })
              }
            >
              관리자에게 문의
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
