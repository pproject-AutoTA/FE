import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  AuthLayout,
  Banner,
  Button,
  Checkbox,
  FormField,
  useToast,
} from "../../components";
import { linkButtonBase } from "../../components/ui/classes";

export function AdminLogin() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trust, setTrust] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (!email.trim()) next.email = "관리자 이메일을 입력하세요";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "올바른 이메일 형식을 입력하세요";
    if (!password) next.password = "관리자 비밀번호를 입력하세요";
    setError(next);
    if (Object.keys(next).length === 0) {
      // TODO: 관리자 로그인 API 연결
      toast("success", "관리자 로그인 요청을 보냈어요");
    }
  };

  return (
    <AuthLayout onSubmit={submit}>
      <div className="text-xs leading-4 font-bold tracking-[.18em] text-blue-600 uppercase">
        System administration
      </div>
      <h2 className="mt-2 mb-0 text-[40px] leading-[48px] font-medium tracking-[-.02em]">
        시스템 관리자 로그인
      </h2>
      <p className="mt-2 mb-5 text-base leading-6 text-fg-secondary">
        승인된 시스템 관리자 계정으로 접속해 주세요.
      </p>

      <Banner
        type="info"
        title="보안 관리자 영역"
        icon={
          <span className="grid size-12 flex-none place-items-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={24} strokeWidth={1.75} aria-hidden />
          </span>
        }
      >
        시스템 운영, 사용자 권한, 채점 인프라에 접근하는 전용 로그인입니다.
        <br />
        모든 접속 기록은 보안 로그에 저장됩니다.
      </Banner>

      <div className="mt-5 grid gap-3.5">
        <FormField
          label="관리자 이메일"
          type="email"
          autoComplete="username"
          placeholder="admin@university.ac.kr"
          icon={<ShieldCheck size={22} strokeWidth={1.75} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.email}
        />
        <FormField
          label="관리자 비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          icon={<ShieldCheck size={22} strokeWidth={1.75} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error.password}
        />
      </div>

      <div className="mt-3.5 mb-5 flex items-center justify-between">
        <Checkbox
          checked={trust}
          onChange={setTrust}
          label="이 기기 신뢰하기"
        />
        <button
          type="button"
          className={`${linkButtonBase} text-sm`}
          onClick={() =>
            navigate("/forgot-password", { state: { role: "admin" } })
          }
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="[&>button]:w-full">
        <Button type="submit" size="lg">
          관리자 로그인
          <ArrowRight size={20} strokeWidth={1.75} />
        </Button>
      </div>

      <p className="mt-4 mb-0 flex items-center justify-center gap-2 text-[13px] leading-5 text-fg-secondary">
        <ShieldCheck size={16} strokeWidth={1.75} aria-hidden />
        권한이 부여된 관리자 이메일만 접속할 수 있어요.
      </p>
      <p className="mt-3 mb-0 text-center text-[13px] leading-5 text-fg-secondary">
        로그인에 문제가 있나요?{" "}
        <button
          type="button"
          className={`${linkButtonBase} text-[13px]`}
          onClick={() => navigate("/contact-admin")}
        >
          관리자에게 문의
        </button>
      </p>
      <p className="mt-1.5 mb-0 text-center">
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-xs leading-4 text-fg-secondary underline underline-offset-2"
          onClick={() => navigate("/login")}
        >
          학생·교수 로그인으로 돌아가기
        </button>
      </p>
    </AuthLayout>
  );
}
