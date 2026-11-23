import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "./styles/tailwind.css";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Button, ToastProvider } from "./components";
import { AdminLogin, ContactAdmin, ForgotPassword, Login } from "./pages/auth";
import { ComponentGallery } from "./pages/ComponentGallery";
import { Showcase } from "./Showcase";

/** 교수·관리자 화면이 만들어지기 전까지 쓰는 임시 화면. 실제 화면이 만들어지면 해당 라우트의 element만 교체한다. */
function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4">
      <div className="grid justify-items-center gap-3 text-center">
        <h1 className="m-0 text-[32px] leading-10 font-medium">{title}</h1>
        <p className="m-0 mb-4 text-base leading-6 text-fg-secondary">
          화면을 준비 중이에요. (로그인 이동 확인용 임시 화면)
        </p>
        <Button variant="secondary" onClick={() => navigate("/login")}>
          로그인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />

        {/* TODO: 실제 화면 구현 후 교체 (교수·관리자: 박은아) */}
        <Route path="/professor" element={<Placeholder title="교수 화면" />} />
        <Route
          path="/admin"
          element={<Placeholder title="시스템 관리자 화면" />}
        />

        <Route path="/components" element={<ComponentGallery />} />
        {/* 서비스 화면 예시(나중에 정식 화면으로 교체) */}
        <Route path="/showcase" element={<Showcase />} />
        {/* 처음 접속(/)이나 없는 주소는 로그인 화면으로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  </BrowserRouter>,
);
