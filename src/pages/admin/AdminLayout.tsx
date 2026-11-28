import { useState, type ReactNode } from "react";
import { Server, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, NotificationPanel, Sidebar, SidebarHelpCard, Topbar } from "../../components";
import { ROUTES } from "../../routes";

const ICON = { size: 24, strokeWidth: 1.75 };
const MENU = [
  { path: ROUTES.admin, label: "시스템 현황", icon: <Server {...ICON} /> },
  { path: ROUTES.adminUsers, label: "사용자 · 권한", icon: <Users {...ICON} /> },
];
interface AdminLayoutProps {
  children: ReactNode;
  searchPlaceholder: string;
  onSearch: (query: string) => void;
  failureCount?: number;
  onShowHistory?: () => void;
}

export function AdminLayout({
  children,
  searchPlaceholder,
  onSearch,
  failureCount,
  onShowHistory,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [bellOpen, setBellOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);

  function showHistory() {
    if (onShowHistory) onShowHistory();
    else navigate(ROUTES.admin, { state: { showHistory: true } });
  }

  return (
    <div className="grid min-h-screen grid-cols-[clamp(260px,19vw,384px)_minmax(0,1fr)] bg-bg max-[1000px]:grid-cols-1">
      <Sidebar
        responsive
        role="admin"
        userInitial="관"
        sectionLabel="시스템"
        menuItems={MENU}
        activePath={pathname}
        onNavigate={navigate}
        onLogout={() => navigate(ROUTES.adminLogin)}
        helpCard={<SidebarHelpCard onClick={() => setGuideOpen(true)} />}
      />
      <div className="min-w-0">
        <div className="sticky top-0 z-30">
          <Topbar
            responsive
            user={{ name: "시스템 관리자", sub: "super admin" }}
            hasUnread={unread && (failureCount ?? 0) > 0}
            searchPlaceholder={searchPlaceholder}
            onSearch={onSearch}
            bellOpen={bellOpen}
            onBellClick={() => setBellOpen((open) => !open)}
            popover={
              <NotificationPanel
                readableTimestamp
                title="시스템 알림"
                items={failureCount === undefined || failureCount === 0 ? [] : [
                  {
                    id: 1,
                    title: "채점 실패",
                    body: `시스템 오류 ${failureCount}건이 기록되었습니다.`,
                    time: "조회 기준",
                    unread,
                  },
                ]}
                onReadAll={() => setUnread(false)}
                viewAllLabel="채점 실패 이력 보기"
                onItemClick={() => {
                  setUnread(false);
                  setBellOpen(false);
                  showHistory();
                }}
                onViewAll={() => {
                  setBellOpen(false);
                  showHistory();
                }}
              />
            }
          />
        </div>
        <main className="flex flex-col gap-7 px-[clamp(24px,2.75vw,56px)] pt-14 pb-[72px] max-[1000px]:pt-8">
          {children}
        </main>
      </div>
      <Modal open={guideOpen} title="시스템 운영 가이드" onClose={() => setGuideOpen(false)}>
        <p>
          큐별 대기 작업 수와 채점·검사 워커 소비자 수를 확인하세요.
        </p>
        <p>
          채점 실패 이력에서는 최종 실패 시각, 원인과 재시도 횟수를 확인할 수 있습니다.
        </p>
      </Modal>
    </div>
  );
}
