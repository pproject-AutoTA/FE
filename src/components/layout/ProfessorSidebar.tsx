import { PROFESSOR_NOTIFICATIONS, PROFESSOR_NOTICE_FOR_NOTIFICATION } from "../../mocks/professor";
import { ROUTES } from "../../routes";
import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, FileText, Flag, Home, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationPanel } from "../ui";
import { Sidebar, type MenuItem } from "./Sidebar";
import { SidebarHelpCard } from "./SidebarHelpCard";
import { Topbar } from "./Topbar";

import { getPendingReviews, useProfessorMockState } from "../../pages/professor/professorMockState";

const ICON = { size: 24, strokeWidth: 1.75 } as const;
const MENU: MenuItem[] = [
  { path: ROUTES.professor, label: "홈", icon: <Home {...ICON} /> },
  { path: ROUTES.professorClasses, label: "수업 관리", icon: <Users {...ICON} /> },
  { path: ROUTES.professorProblems, label: "문제 관리", icon: <BookOpen {...ICON} /> },
  { path: ROUTES.professorReview, label: "채점 검토", icon: <Flag {...ICON} /> },
  { path: ROUTES.professorScores, label: "점수 공개", icon: <FileText {...ICON} /> },
];

export interface ProfessorLayoutProps {
  /** 사이드바 "채점 검토" 옆 숫자 */
  /** 상단 검색창 입력을 받을 때만 넘긴다 */
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  children: ReactNode;
}

/** 교수 화면 공통 틀: 학생 화면(StudentLayout)과 같은 Sidebar + Topbar 를 쓴다. 각 교수 화면이 이 틀로 직접 감싼다. */
export function ProfessorLayout({ onSearch, searchPlaceholder, children }: ProfessorLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pendingCount = getPendingReviews(useProfessorMockState()).length;
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState(PROFESSOR_NOTIFICATIONS);

  // 화면을 옮기면 알림 패널을 닫는다
  useEffect(() => setBellOpen(false), [pathname]);

  // 패널 바깥을 누르거나 Esc를 누르면 닫는다 (종 버튼과 패널 안쪽은 제외)
  useEffect(() => {
    if (!bellOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[role="dialog"], button[aria-expanded]'))
        setBellOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBellOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [bellOpen]);

  // /professor/problems/new 같은 하위 주소에서도 메뉴가 선택되게 한다. 홈은 정확히 같을 때만 선택한다.
  const activePath =
    MENU.map((m) => m.path)
      .filter((p) => pathname === p || (p !== ROUTES.professor && pathname.startsWith(`${p}/`)))
      .sort((a, b) => b.length - a.length)[0] ?? "";
  const menuItems = MENU.map((m) =>
    m.path === ROUTES.professorReview ? { ...m, badge: pendingCount } : m,
  );

  return (
    <div className="grid min-h-screen grid-cols-[clamp(260px,19vw,384px)_minmax(0,1fr)] max-[1000px]:grid-cols-1">
      <Sidebar
        responsive
        role="professor"
        userInitial="박"
        sectionLabel="강의 관리"
        menuItems={menuItems}
        activePath={activePath}
        onNavigate={navigate}
        onLogout={() => navigate(ROUTES.login)} // TODO: 로그아웃 API 연결
        helpCard={<SidebarHelpCard onClick={() => navigate(ROUTES.professorGuide)} />}
      />
      <div className="min-w-0">
        <Topbar
          responsive
          // TODO: 로그인 API 연결 후 로그인한 교수 정보로 교체
          user={{ name: "박서연 교수", sub: "컴퓨터공학과" }}
          hasUnread={notifications.some((n) => n.unread)}
          onSearch={onSearch}
          searchPlaceholder={searchPlaceholder}
          onBellClick={() => setBellOpen((open) => !open)}
          bellOpen={bellOpen}
          popover={
            <NotificationPanel
              readableTimestamp
              title="교수 알림"
              items={notifications}
              onReadAll={() => setNotifications((xs) => xs.map((n) => ({ ...n, unread: false })))}
              onViewAll={() => navigate(ROUTES.professorNotices)}
              onItemClick={(n) => {
                setNotifications((xs) =>
                  xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
                );
                setBellOpen(false);
                navigate(
                  `${ROUTES.professorNotices}?notice=${PROFESSOR_NOTICE_FOR_NOTIFICATION[n.id] ?? ""}`,
                );
              }}
            />
          }
        />
        <main className="flex flex-col gap-7 px-14 pt-14 max-[1000px]:px-5 max-[1000px]:pt-8 pb-[72px]">
          {children}
        </main>
      </div>
    </div>
  );
}
