import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Code2, FileText, Mail, ShieldCheck } from "lucide-react";
import {
  AuthLayout,
  Button,
  Checkbox,
  ErrorMessage,
  FormField,
  SelectCard,
} from "../../components";
import { linkButtonBase } from "../../components/ui/classes";
import { describeLoginError, login } from "../../api/auth";
import { saveAuth } from "../../auth/storage";
import { HOME } from "../../auth/home";

type LoginRole = "student" | "professor";

export function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<LoginRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setFormError(undefined);

    const next: typeof error = {};
    if (!email.trim()) next.email = "이메일을 입력하세요";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "올바른 이메일 형식을 입력하세요";
    if (!password) next.password = "비밀번호를 입력하세요";
    setError(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      if (data.user.role === "ADMIN") {
        setFormError("관리자 계정은 시스템 관리자 로그인에서 접속해 주세요");
        return;
      }
      saveAuth(data.accessToken, data.user, keep);
      navigate(HOME[data.user.role], { replace: true });
    } catch (err) {
      const { fields, form } = describeLoginError(err);
      setError(fields);
      setFormError(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout onSubmit={submit}>
      <div className="text-xs leading-4 font-bold tracking-[.18em] text-blue-600 uppercase">
        Welcome back
      </div>
      <h2 className="mt-2 mb-0 text-[40px] leading-[48px] font-medium tracking-[-.02em]">
        AutoTA 로그인
      </h2>
      <p className="mt-2 mb-5 text-base leading-6 text-fg-secondary">
        먼저 로그인할 역할을 선택해 주세요.
      </p>

      <div
        role="radiogroup"
        aria-label="로그인 역할"
        className="grid grid-cols-2 gap-3.5"
      >
        <SelectCard
          icon={<Code2 size={26} strokeWidth={1.75} />}
          title="학생"
          description="문제 풀이와 채점 결과 확인"
          selected={role === "student"}
          onSelect={() => setRole("student")}
        />
        <SelectCard
          icon={<FileText size={26} strokeWidth={1.75} />}
          title="교수"
          description="과제 관리와 점수 확정"
          selected={role === "professor"}
          onSelect={() => setRole("professor")}
        />
      </div>

      <div className="mt-5 grid gap-3.5">
        <FormField
          label="등록된 이메일"
          type="email"
          autoComplete="username"
          placeholder="name@university.ac.kr"
          icon={<Mail size={22} strokeWidth={1.75} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.email}
        />
        <FormField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          icon={<ShieldCheck size={22} strokeWidth={1.75} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error.password}
        />
      </div>

      {formError && <ErrorMessage>{formError}</ErrorMessage>}

      <div className="mt-3.5 mb-5 flex items-center justify-between">
        <Checkbox checked={keep} onChange={setKeep} label="로그인 상태 유지" />
        <button
          type="button"
          className={`${linkButtonBase} text-sm`}
          onClick={() => navigate("/forgot-password", { state: { role } })}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="[&>button]:w-full">
        <Button type="submit" size="lg" loading={loading}>
          로그인
          <ArrowRight size={20} strokeWidth={1.75} />
        </Button>
      </div>

      <p className="mt-4 mb-0 flex items-center justify-center gap-2 text-[13px] leading-5 text-fg-secondary">
        <ShieldCheck size={16} strokeWidth={1.75} aria-hidden />
        미리 등록된 계정의 이메일로 로그인해요. 회원가입은 지원하지 않아요.
      </p>
      <p className="mt-3 mb-0 text-center text-[13px] leading-5 text-fg-secondary">
        로그인에 문제가 있나요?{" "}
        <button
          type="button"
          className={`${linkButtonBase} text-[13px]`}
          onClick={() =>
            navigate("/contact-admin", { state: { from: "/login" } })
          }
        >
          관리자에게 문의
        </button>
      </p>
      <p className="mt-1.5 mb-0 text-center">
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-xs leading-4 text-fg-secondary underline underline-offset-2"
          onClick={() => navigate("/admin/login")}
        >
          시스템 관리자 로그인
        </button>
      </p>
    </AuthLayout>
  );
}
