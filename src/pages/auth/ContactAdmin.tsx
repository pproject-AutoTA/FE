import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bell, Clock } from "lucide-react";
import {
  AuthLayout,
  Button,
  FormField,
  Select,
  useToast,
} from "../../components";

type InquiryType = "login" | "account" | "submit" | "etc";

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "login", label: "로그인 문제" },
  { value: "account", label: "계정 및 권한" },
  { value: "submit", label: "제출 및 채점" },
  { value: "etc", label: "기타 문의" },
];

export function ContactAdmin() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // 문의 화면으로 들어온 로그인 화면(학생·교수 / 관리자)으로 되돌아간다
  const backTo = (location.state as { from?: string } | null)?.from ?? "/login";
  const [type, setType] = useState<InquiryType>("login");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<{ email?: string; message?: string }>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (!email.trim()) next.email = "이메일을 입력하세요";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "올바른 이메일 형식을 입력하세요";
    if (!message.trim()) next.message = "문의 내용을 입력하세요";
    setError(next);
    if (next.email || next.message) return;
    // TODO: 관리자 문의 접수 API 연결 (type, email, message 전달)
    toast("success", "문의가 접수되었어요. 1영업일 이내에 답변드릴게요.");
    setMessage("");
  };

  return (
    <AuthLayout onSubmit={submit}>
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm leading-5 text-fg-secondary hover:text-fg"
      >
        <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        로그인으로 돌아가기
      </button>

      <div className="text-xs leading-4 font-bold tracking-[.18em] text-blue-600 uppercase">
        Contact admin
      </div>
      <h2 className="mt-2 mb-0 text-[40px] leading-[48px] font-medium tracking-[-.02em]">
        관리자에게 문의
      </h2>
      <p className="mt-2 mb-6 text-base leading-6 text-fg-secondary">
        계정이나 서비스 이용 중 발생한 문제를 남겨 주세요.
      </p>

      {/* 문의 내용 입력칸은 크기를 고정해서 화면이 스크롤되지 않게 한다 */}
      <div className="grid gap-3.5 [&_textarea]:resize-none">
        <Select
          label="문의 유형"
          value={type}
          onChange={setType}
          options={INQUIRY_OPTIONS}
        />
        <FormField
          label="답변받을 이메일"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={<Bell size={22} strokeWidth={1.75} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.email}
        />
        <FormField
          label="문의 내용"
          multiline
          rows={4}
          placeholder="문제가 발생한 상황을 자세히 적어 주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={error.message}
        />
      </div>

      <div className="mt-6 [&>button]:w-full">
        <Button type="submit" size="lg">
          문의 보내기
          <ArrowRight size={20} strokeWidth={1.75} />
        </Button>
      </div>

      <p className="mt-4 mb-0 flex items-center justify-center gap-2 text-[13px] leading-5 text-fg-secondary">
        <Clock size={16} strokeWidth={1.75} aria-hidden />
        평일 09:00–18:00 · 평균 1영업일 이내 답변
      </p>
    </AuthLayout>
  );
}
