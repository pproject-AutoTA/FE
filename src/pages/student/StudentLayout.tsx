import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock3,
  Code2,
  History,
  Home,
  Bell,
  Plus,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  NotificationPanel,
  SidebarHelpCard,
  type MenuItem,
  type NotificationItem,
} from "../../components";

const MENU: MenuItem[] = [
  {
    path: "/student",
    label: "홈",
    icon: <Home size={24} strokeWidth={1.75} />,
  },
  {
    path: "/student/join",
    label: "수업 참여",
    icon: <Plus size={24} strokeWidth={1.75} />,
  },
  {
    path: "/student/problems",
    label: "문제 목록",
    icon: <BookOpen size={24} strokeWidth={1.75} />,
  },
  {
    path: "/student/submit",
    label: "코드 제출",
    icon: <Code2 size={24} strokeWidth={1.75} />,
  },
  {
    path: "/student/results",
    label: "제출 및 채점 결과",
    icon: <History size={24} strokeWidth={1.75} />,
  },
];

/* TODO: 알림 API 연결 후 서버 응답으로 교체 */
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    unread: true,
    time: "2시간 전",
    title: "중간고사 대체 과제 채점 기준 안내",
    body: "부분 점수 및 허용 요소 기준이 변경됐어요.",
    icon: <Bell size={22} strokeWidth={1.75} aria-hidden />,
  },
  {
    id: 2,
    unread: true,
    time: "어제",
    title: "서버 점검 일정 안내",
    body: "5월 25일 02:00부터 약 30분간 진행됩니다.",
    icon: <Bell size={22} strokeWidth={1.75} aria-hidden />,
  },
  {
    id: 3,
    unread: true,
    time: "2일 전",
    title: "자료구조 과제 마감 임박",
    body: "괄호 문자열 검사 마감까지 2일 남았어요.",
    icon: <Clock3 size={22} strokeWidth={1.75} aria-hidden />,
  },
];

/** 알림 id → 공지 id (TODO: API 연결 후 알림 응답의 noticeId 사용) */
const NOTICE_OF: Record<string | number, number> = { 1: 1, 2: 2, 3: 3 };

/** 학생 화면 공통 틀: 왼쪽 사이드바 + 위쪽 상단바(검색, 알림, 사용자). 안쪽 화면은 <Outlet />에 들어간다. */
export function StudentLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // TODO: 로그인 API 연결 후 로그인한 학생 정보로 교체
  const user = { name: "김민준", sub: "컴퓨터공학과 · 20240123" };

  // 화면을 옮기면 알림 패널을 닫는다
  useEffect(() => setBellOpen(false), [pathname]);

  // /student/results/3 같은 하위 주소에서도 "제출 및 채점 결과" 메뉴가 선택되게 한다.
  // 홈(/student)은 모든 학생 주소의 앞부분이라 정확히 같을 때만 선택한다 (공지·가이드 화면에서는 선택 없음).
  const activePath =
    MENU.map((m) => m.path)
      .filter(
        (p) =>
          pathname === p || (p !== "/student" && pathname.startsWith(`${p}/`)),
      )
      .sort((a, b) => b.length - a.length)[0] ?? pathname;

  // 패널 바깥을 누르거나 Esc를 누르면 닫는다 (종 버튼과 패널 안쪽은 제외)
  useEffect(() => {
    if (!bellOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        !(e.target as Element).closest('[role="dialog"], button[aria-expanded]')
      )
        setBellOpen(false);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setBellOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [bellOpen]);

  return (
    <AppShell
      role="student"
      user={user}
      hasUnread={notifications.some((n) => n.unread)}
      bellOpen={bellOpen}
      onBellClick={() => setBellOpen((v) => !v)}
      notifications={
        <NotificationPanel
          title="학생 알림"
          items={notifications}
          onReadAll={() =>
            setNotifications((xs) => xs.map((n) => ({ ...n, unread: false })))
          }
          onViewAll={() => navigate("/student/notices")}
          onItemClick={(n) => {
            setNotifications((xs) =>
              xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
            );
            setBellOpen(false);
            navigate(`/student/notices?notice=${NOTICE_OF[n.id] ?? ""}`);
          }}
        />
      }
      sectionLabel="학습"
      menuItems={MENU}
      activePath={activePath}
      onNavigate={navigate}
      onLogout={() => navigate("/login")} // TODO: 로그아웃 API 연결
      helpCard={<SidebarHelpCard onClick={() => navigate("/student/guide")} />}
    >
      <Outlet />
    </AppShell>
  );
}
