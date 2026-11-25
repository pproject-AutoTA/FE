import { useEffect, useState, type ReactNode } from "react";
import { Bell, BookOpen, Clock3, FileText, Flag, Home, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationPanel, type NotificationItem } from "../ui";
import { Sidebar, type MenuItem } from "./Sidebar";
import { SidebarHelpCard } from "./SidebarHelpCard";
import { Topbar } from "./Topbar";

import { getPendingReviews, useProfessorMockState } from "../../pages/professor/professorMockState";

const ICON = { size: 24, strokeWidth: 1.75 } as const;
const MENU: MenuItem[] = [
  { path: "/professor", label: "홈", icon: <Home {...ICON} /> },
  { path: "/professor/classes", label: "수업 관리", icon: <Users {...ICON} /> },
  { path: "/professor/problems", label: "문제 관리", icon: <BookOpen {...ICON} /> },
  { path: "/professor/review", label: "채점 검토", icon: <Flag {...ICON} /> },
  { path: "/professor/scores", label: "점수 공개", icon: <FileText {...ICON} /> },
];

/* TODO: 알림 API 연결 후 서버 응답으로 교체 */
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, unread: true, time: "2시간 전", title: "FLAG 검토 및 점수 확정 기준 안내", body: "FLAG 제출의 검토와 점수 조정 방법이 정리됐어요.", icon: <Bell size={22} strokeWidth={1.75} aria-hidden /> },
  { id: 2, unread: true, time: "어제", title: "서버 점검 일정 안내", body: "5월 25일 02:00부터 약 30분간 진행됩니다.", icon: <Bell size={22} strokeWidth={1.75} aria-hidden /> },
  { id: 3, unread: true, time: "2일 전", title: "자료구조 과제 마감 임박", body: "괄호 문자열 검사 마감까지 2일 남았어요.", icon: <Clock3 size={22} strokeWidth={1.75} aria-hidden /> },
];

/** 알림 id → 공지 id (TODO: API 연결 후 알림 응답의 noticeId 사용) */
const NOTICE_OF: Record<string | number, number> = { 1: 1, 2: 2, 3: 3 };

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
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // 화면을 옮기면 알림 패널을 닫는다
  useEffect(() => setBellOpen(false), [pathname]);

  // 패널 바깥을 누르거나 Esc를 누르면 닫는다 (종 버튼과 패널 안쪽은 제외)
  useEffect(() => {
    if (!bellOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[role="dialog"], button[aria-expanded]')) setBellOpen(false);
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
      .filter((p) => pathname === p || (p !== "/professor" && pathname.startsWith(`${p}/`)))
      .sort((a, b) => b.length - a.length)[0] ?? "";
  const menuItems = MENU.map((m) => (m.path === "/professor/review" ? { ...m, badge: pendingCount } : m));

  return (
    <div className="grid min-h-screen min-w-[1440px] grid-cols-[384px_minmax(0,1fr)]">
      <Sidebar
        role="professor" userInitial="박" sectionLabel="강의 관리"
        menuItems={menuItems} activePath={activePath} onNavigate={navigate}
        onLogout={() => navigate("/login")} // TODO: 로그아웃 API 연결
        helpCard={<SidebarHelpCard onClick={() => navigate("/professor/guide")} />}
      />
      <div className="min-w-0">
        <Topbar
          // TODO: 로그인 API 연결 후 로그인한 교수 정보로 교체
          user={{ name: "박서연 교수", sub: "컴퓨터공학과" }}
          hasUnread={notifications.some((n) => n.unread)}
          onSearch={onSearch} searchPlaceholder={searchPlaceholder}
          onBellClick={() => setBellOpen((open) => !open)} bellOpen={bellOpen}
          popover={
            <NotificationPanel
              title="교수 알림" items={notifications}
              onReadAll={() => setNotifications((xs) => xs.map((n) => ({ ...n, unread: false })))}
              onViewAll={() => navigate("/professor/notices")}
              onItemClick={(n) => {
                setNotifications((xs) => xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
                setBellOpen(false);
                navigate(`/professor/notices?notice=${NOTICE_OF[n.id] ?? ""}`);
              }}
            />
          }
        />
        <main className="flex flex-col gap-7 px-14 pt-14 pb-[72px]">{children}</main>
      </div>
    </div>
  );
}
