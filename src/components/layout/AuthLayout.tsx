import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

/* ---------- AuthLayout (로그인 계열 화면 공통 틀) ----------
 * 왼쪽 서비스 소개 + 오른쪽 카드(form). 학생/교수 로그인, 시스템 관리자 로그인에서 같이 쓴다.
 * 기준 화면(1600 x 860)으로 디자인하고, 브라우저 창 크기에 맞춰 통째로 확대/축소해서
 * 어떤 화면에서도 스크롤 없이 한 화면에 들어오게 한다. */
const REF_W = 1600;
const REF_H = 860;

function useFit() {
  const calc = () => {
    const s = Math.min(
      Math.max(
        Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H),
        0.55,
      ),
      1.4,
    );
    return { s, w: window.innerWidth / s, h: window.innerHeight / s };
  };
  const [fit, setFit] = useState(calc);
  useEffect(() => {
    const on = () => setFit(calc());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return fit;
}

const FEATURES = [
  {
    icon: Check,
    title: "신뢰할 수 있는 자동 채점",
    text: "격리된 환경에서 안전하고 정확하게 실행합니다.",
  },
  {
    icon: ShieldCheck,
    title: "학습 범위 기반 검사",
    text: "허용 요소를 확인하고 교수 검토를 지원합니다.",
  },
] as const;

export interface AuthLayoutProps {
  /** 카드 안에 들어갈 내용 */
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export function AuthLayout({ children, onSubmit }: AuthLayoutProps) {
  const fit = useFit();
  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <div
        className="grid grid-cols-[40%_1fr] overflow-hidden"
        style={{ zoom: fit.s, width: fit.w, height: fit.h }}
      >
        {/* ---------- 왼쪽: 서비스 소개 ---------- */}
        <aside className="relative flex flex-col justify-between overflow-hidden bg-navy-900 px-16 py-12 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[12%] -left-[18%] size-[130%] rounded-full border border-[rgba(255,255,255,.05)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-[28%] left-[10%] size-[95%] rounded-full bg-[rgba(255,255,255,.035)]"
          />

          <div className="relative -ml-4">
            <Logo />
          </div>

          <div className="relative">
            <div className="mb-5 text-[13px] leading-[18px] font-bold tracking-[.2em] text-[#2F7BFF] uppercase">
              Python Assignment Platform
            </div>
            <h1 className="m-0 text-[52px] leading-[1.35] font-medium tracking-[-.02em]">
              코드의 결과를 넘어,
              <br />
              학습 과정을 평가합니다.
            </h1>
            <p className="mt-6 mb-0 max-w-[520px] break-keep text-lg leading-[1.7] text-[#C7D3EA]">
              프로그래밍 교과목을 위한 Python 과제 제출, 자동 채점, 교수 검토
              서비스를 한 곳에서 이용하세요.
            </p>
          </div>

          <div className="relative">
            <ul className="m-0 grid list-none gap-6 p-0">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    className="mt-0.5 flex-none text-[#2F7BFF]"
                    aria-hidden
                  />
                  <div>
                    <strong className="block text-lg leading-7 font-bold">
                      {title}
                    </strong>
                    <span className="block text-sm leading-5 text-[#9FB0D3]">
                      {text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-xs leading-4 text-[#7F90B5]">
              © 2025 AutoTA · Automated Teaching Assistant
            </div>
          </div>
        </aside>

        {/* ---------- 오른쪽: 카드 ---------- */}
        <main className="grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#F5F7FB_0%,#EEF3FF_100%)] p-10">
          <form
            onSubmit={onSubmit}
            noValidate
            className="box-border w-full max-w-[800px] rounded-[28px] border border-border bg-surface px-14 py-9 shadow-md"
          >
            {children}
          </form>
        </main>
      </div>
    </div>
  );
}
