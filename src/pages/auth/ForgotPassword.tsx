import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bell, ShieldCheck } from "lucide-react";
import {
  AuthLayout,
  Button,
  FormField,
  Select,
  useToast,
} from "../../components";

type ResetRole = "student" | "professor" | "admin";

const ROLES: ResetRole[] = ["student", "professor", "admin"];

export function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // 로그인 화면에서 넘겨준 역할로 시작 (학생/교수 로그인 → 선택값, 관리자 로그인 → admin)
  const fromRole = (location.state as { role?: ResetRole } | null)?.role;
  const [role, setRole] = useState<ResetRole>(
    fromRole && ROLES.includes(fromRole) ? fromRole : "student",
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("이메일을 입력하세요");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("올바른 이메일 형식을 입력하세요");
    setError(undefined);
    // TODO: 비밀번호 재설정 메일 발송 API 연결 (role, email 전달)
    toast("success", "입력한 이메일로 비밀번호 재설정 안내를 보냈습니다.");
  };

  return (
    <AuthLayout onSubmit={submit}>
      <button
        type="button"
        onClick={() => navigate(role === "admin" ? "/admin/login" : "/login")}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm leading-5 text-fg-secondary hover:text-fg"
      >
        <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        로그인으로 돌아가기
      </button>

      <div className="text-xs leading-4 font-bold tracking-[.18em] text-blue-600 uppercase">
        Reset password
      </div>
      <h2 className="mt-2 mb-0 text-[40px] leading-[48px] font-medium tracking-[-.02em]">
        비밀번호 찾기
      </h2>
      <p className="mt-2 mb-6 text-base leading-6 text-fg-secondary">
        계정에 등록된 이메일로 비밀번호 재설정 안내를 보내드려요.
      </p>

      <div className="mb-6 grid size-20 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <ShieldCheck size={36} strokeWidth={1.75} aria-hidden />
      </div>

      <div className="grid gap-3.5">
        <Select
          label="역할"
          value={role}
          onChange={setRole}
          options={[
            { value: "student", label: "학생" },
            { value: "professor", label: "교수" },
            { value: "admin", label: "관리자" },
          ]}
        />
        <FormField
          label="등록된 이메일"
          type="email"
          autoComplete="username"
          placeholder="name@university.ac.kr"
          icon={<Bell size={22} strokeWidth={1.75} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
      </div>

      <div className="mt-6 [&>button]:w-full">
        <Button type="submit" size="lg">
          재설정 안내 보내기
          <ArrowRight size={20} strokeWidth={1.75} />
        </Button>
      </div>
    </AuthLayout>
  );
}
