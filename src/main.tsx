import { ROUTES } from "./routes";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "./styles/tailwind.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components";
import { AdminHome } from "./pages/admin/AdminHome";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminLogin, ContactAdmin, ForgotPassword, Login } from "./pages/auth";
import { ComponentGallery } from "./pages/ComponentGallery";
import {
  GradingReview,
  ProblemEditor,
  ProfessorClasses,
  ProfessorGuide,
  ProfessorNotices,
  ProfessorHome,
  ProfessorProblems,
  ScoreRelease,
} from "./pages/professor";
import {
  StudentGuide,
  StudentHome,
  StudentJoin,
  StudentLayout,
  StudentNotices,
  StudentProblems,
  StudentResultDetail,
  StudentResults,
  StudentSubmit,
} from "./pages/student";
import { Showcase } from "./Showcase";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.adminLogin} element={<AdminLogin />} />
        <Route path={ROUTES.contactAdmin} element={<ContactAdmin />} />

        {/* 학생: 공통 틀(StudentLayout) 안에 화면이 들어간다 */}
        <Route path={ROUTES.student} element={<StudentLayout />}>
          <Route index element={<StudentHome />} />
          <Route path={ROUTES.studentNotices} element={<StudentNotices />} />
          <Route path={ROUTES.studentGuide} element={<StudentGuide />} />
          <Route path={ROUTES.studentJoin} element={<StudentJoin />} />
          <Route path={ROUTES.studentProblems} element={<StudentProblems />} />
          <Route path={ROUTES.studentSubmit} element={<StudentSubmit />} />
          <Route path={ROUTES.studentResults} element={<StudentResults />} />
          <Route path={ROUTES.studentResultDetail} element={<StudentResultDetail />} />
        </Route>

        {/* 교수: 각 화면이 ProfessorLayout(사이드바·상단바)을 직접 감싼다 */}
        <Route path={ROUTES.professor} element={<ProfessorHome />} />
        <Route path={ROUTES.professorClasses} element={<ProfessorClasses />} />
        <Route path={ROUTES.professorProblems} element={<ProfessorProblems />} />
        <Route path={ROUTES.professorProblemNew} element={<ProblemEditor />} />
        <Route path={ROUTES.professorProblemEdit} element={<ProblemEditor />} />
        <Route path={ROUTES.professorReview} element={<GradingReview />} />
        <Route path={ROUTES.professorScores} element={<ScoreRelease />} />
        <Route path={ROUTES.professorGuide} element={<ProfessorGuide />} />

        <Route path={ROUTES.professorNotices} element={<ProfessorNotices />} />

        <Route path={ROUTES.admin} element={<AdminHome />} />
        <Route path={ROUTES.adminUsers} element={<AdminUsers />} />

        <Route path={ROUTES.components} element={<ComponentGallery />} />
        {/* 서비스 화면 예시(나중에 정식 화면으로 교체) */}
        <Route path={ROUTES.showcase} element={<Showcase />} />
        {/* 처음 접속(/)이나 없는 주소는 로그인 화면으로 */}
        <Route path={ROUTES.fallback} element={<Navigate to={ROUTES.login} replace />} />
      </Routes>
    </ToastProvider>
  </BrowserRouter>,
);
