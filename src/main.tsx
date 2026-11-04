import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "./styles/tailwind.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components";
import { AdminLogin, ContactAdmin, ForgotPassword, Login } from "./pages/auth";
import { ComponentGallery } from "./pages/ComponentGallery";
import { Showcase } from "./Showcase";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
        <Route path="/components" element={<ComponentGallery />} />
        {/* 서비스 화면 예시(나중에 정식 화면으로 교체) */}
        <Route path="/showcase" element={<Showcase />} />
        {/* 그 외 주소(/ 또는 오타)는 갤러리로 */}
        <Route path="*" element={<Navigate to="/components" replace />} />
      </Routes>
    </ToastProvider>
  </BrowserRouter>,
);
