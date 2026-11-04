import { useState, type ReactNode } from "react";
import {
  AlertCircle, ArrowRight, Bell, Check, RotateCcw, Server, Timer, BookOpen, CheckCircle2, ChevronRight, ClipboardList, Clock, Code2, Copy, FileText, Flag,
  History, Home, Inbox, Info, Loader2, LogOut, Mail, Plus, Search, ShieldCheck, TriangleAlert, Users, X,
} from "lucide-react";
import {
  AllowedScopeCard, Badge, Banner, BarChart, Button, Card, Checkbox, ClassCodeBox, CodeBlock, CodeEditor, ConfirmModal, DataTable,
  DateTimePicker, EmptyState, ErrorMessage, FlagCard, FormField, IndexChip, ListRow, MetaStats, NotificationPanel,
  ModalPanel, NumberedSteps, PageHeader, ProgressRing, RadioGroup, SampleIO, ScoreBreakdown, ScoreDisplay, Select, SelectCard, Sidebar,
  SidebarHelpCard, Skeleton, StatCard, Stepper, SubmissionHistoryList, SubmissionStatusBadge, Tabs, TagChip, TagInput,
  TestcaseGroupCard, Toggle, Topbar, ToastCard, VerdictBadge, useToast,
  type MenuItem, type NotificationItem, type SubmissionStatus, type Tone, type Verdict,
} from "../components";
import { linkButton } from "../components/ui/classes";

/* ---------- 갤러리 전용 레이아웃 헬퍼 ---------- */
function Group({ title }: { title: string }) {
  return (
    <h2 className="col-span-full mx-0 mt-7 mb-0 border-t-2 border-[rgba(24,33,54,.18)] pt-[22px] text-sm leading-[18px] font-bold tracking-[.14em] text-fg-secondary uppercase">
      {title}
    </h2>
  );
}
const SPAN = { 2: "col-span-2 max-[1000px]:col-auto", full: "col-span-full" } as const;
function Section({ title, span, children }: { title: string; span?: 2 | "full"; children: ReactNode }) {
  return (
    <section className={`min-w-0 ${span ? SPAN[span] : ""}`}>
      <h3 className="m-0 mb-3.5 text-lg leading-[26px] font-bold text-fg">{title}</h3>
      <div className="grid gap-[18px]">{children}</div>
    </section>
  );
}
function Sub({ children }: { children: ReactNode }) {
  return <div className="mb-2 text-[13px] leading-[18px] font-medium text-fg-secondary">{children}</div>;
}

/* ---------- 샘플 데이터 ---------- */
const MENU: MenuItem[] = [
  { path: "/", label: "홈", icon: <Home size={24} strokeWidth={1.75} /> },
  { path: "/classes", label: "수업 참여", icon: <Plus size={24} strokeWidth={1.75} /> },
  { path: "/problems", label: "문제 목록", icon: <BookOpen size={24} strokeWidth={1.75} /> },
  { path: "/submit", label: "코드 제출", icon: <Code2 size={24} strokeWidth={1.75} /> },
  { path: "/results", label: "제출 및 채점 결과", icon: <History size={24} strokeWidth={1.75} /> },
];

interface Row { id: number; title: string; course: string; due: string; late?: boolean; status: SubmissionStatus; score: number | null; released: boolean }
const ROWS: Row[] = [
  { id: 1, title: "두 수의 합", course: "Python 기초", due: "5월 18일 · 마감", late: true, status: "DONE", score: 100, released: true },
  { id: 2, title: "괄호 문자열 검사", course: "자료구조", due: "5월 28일", status: "RUNNING", score: 80, released: false },
  { id: 3, title: "최단 경로 찾기", course: "알고리즘", due: "5월 31일", status: "QUEUED", score: null, released: false },
  { id: 4, title: "우선순위 큐 구현", course: "자료구조", due: "6월 4일", status: "NONE", score: null, released: false },
];
const COLUMNS = [
  { key: "title", header: "문제", render: (r: Row) => (
    <span className="flex items-center gap-4 text-[17px] leading-6 font-bold text-fg"><IndexChip>{String(r.id).padStart(2, "0")}</IndexChip>{r.title}</span>
  ) },
  { key: "course", header: "과목" },
  { key: "due", header: "마감", render: (r: Row) => <span className={r.late ? "font-bold text-danger-fg" : undefined}>{r.due}</span> },
  { key: "status", header: "제출 상태", render: (r: Row) => <SubmissionStatusBadge status={r.status} /> },
  { key: "score", header: "점수", render: (r: Row) => <ScoreDisplay score={r.score} released={r.released} submitted={r.status !== "NONE"} /> },
];

const VERDICTS: Verdict[] = ["AC", "WA", "TLE", "MLE", "RE", "FLAG"];
const STATUSES: SubmissionStatus[] = ["NONE", "QUEUED", "RUNNING", "DONE"];
const TONES: Tone[] = ["success", "danger", "flag", "amber", "neutral", "info", "purple"];

const NOTIFS: NotificationItem[] = [
  { id: 1, title: "중간고사 대체 과제 채점 기준 안내", body: "부분 점수 및 허용 요소 기준이 변경됐어요.", time: "2시간 전", unread: true },
  { id: 2, title: "서버 점검 일정 안내", body: "5월 25일 02:00부터 약 30분간 진행됩니다.", time: "어제", unread: true },
  { id: 3, title: "자료구조 과제 마감 임박", body: "괄호 문자열 검사 마감까지 2일 남았어요.", time: "2일 전", unread: true, icon: <Clock size={22} strokeWidth={1.75} /> },
];

const ICONS: { name: string; node: ReactNode }[] = [
  { name: "Home", node: <Home size={24} strokeWidth={1.75} /> },
  { name: "Plus", node: <Plus size={24} strokeWidth={1.75} /> },
  { name: "BookOpen", node: <BookOpen size={24} strokeWidth={1.75} /> },
  { name: "Code2", node: <Code2 size={24} strokeWidth={1.75} /> },
  { name: "History", node: <History size={24} strokeWidth={1.75} /> },
  { name: "Search", node: <Search size={24} strokeWidth={1.75} /> },
  { name: "Bell", node: <Bell size={24} strokeWidth={1.75} /> },
  { name: "ShieldCheck", node: <ShieldCheck size={24} strokeWidth={1.75} /> },
  { name: "ChevronRight", node: <ChevronRight size={24} strokeWidth={1.75} /> },
  { name: "ArrowRight", node: <ArrowRight size={24} strokeWidth={1.75} /> },
  { name: "LogOut", node: <LogOut size={24} strokeWidth={1.75} /> },
  { name: "Copy", node: <Copy size={24} strokeWidth={1.75} /> },
  { name: "Flag", node: <Flag size={24} strokeWidth={1.75} /> },
  { name: "CheckCircle2", node: <CheckCircle2 size={24} strokeWidth={1.75} /> },
  { name: "ClipboardList", node: <ClipboardList size={24} strokeWidth={1.75} /> },
  { name: "Clock", node: <Clock size={24} strokeWidth={1.75} /> },
  { name: "FileText", node: <FileText size={24} strokeWidth={1.75} /> },
  { name: "Users", node: <Users size={24} strokeWidth={1.75} /> },
  { name: "Mail", node: <Mail size={24} strokeWidth={1.75} /> },
  { name: "X", node: <X size={24} strokeWidth={1.75} /> },
  { name: "Inbox", node: <Inbox size={24} strokeWidth={1.75} /> },
  { name: "Info", node: <Info size={24} strokeWidth={1.75} /> },
  { name: "TriangleAlert", node: <TriangleAlert size={24} strokeWidth={1.75} /> },
  { name: "AlertCircle", node: <AlertCircle size={24} strokeWidth={1.75} /> },
  { name: "Loader2", node: <Loader2 size={24} strokeWidth={1.75} /> },
];
const icode = "rounded-sm bg-blue-50 px-2 py-0.5 font-mono text-[.9em] leading-normal font-medium text-[#1D77F4]";
const ICON_SIZES = [16, 18, 20, 22, 24, 28, 40];

/* ---------- 페이지 ---------- */
export function ComponentGallery() {
  const toast = useToast();
  const [due, setDue] = useState("");
  const [on, setOn] = useState(true);
  const [keep, setKeep] = useState(false);
  const [policy, setPolicy] = useState<"deny" | "allow">("deny");
  const [role, setRole] = useState<"student" | "professor">("student");
  const [selRole, setSelRole] = useState<"student" | "professor" | "admin">("student");
  const [classCode, setClassCode] = useState("");
  const [tags, setTags] = useState(["call:sorted", "import:heapq"]);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("all");
  const [tab2, setTab2] = useState("problem");
  const [code, setCode] = useState("def is_valid_parentheses(s):\n    stack = []\n\n    for char in s:\n        if char == \"(\":\n            stack.append(char)\n        elif not stack:\n            return False\n        else:\n            stack.pop()\n\n    return len(stack) == 0\n");
  const [adj, setAdj] = useState(-20);
  const [reason, setReason] = useState("");

  return (
    <div className="box-border min-h-screen bg-[#CDD1E0] px-16 pt-14 pb-[120px] max-[1000px]:px-5 max-[1000px]:pt-8 max-[1000px]:pb-[72px]">
      <header className="mx-auto mb-2 max-w-[1760px]">
        <h1 className="m-0 mb-1.5 text-[32px] leading-10 font-bold">Components</h1>
        <p className="m-0 text-base leading-6 text-fg-secondary">공통 컴포넌트가 의도한 모양으로 만들어졌는지 확인하는 화면이에요. (/components)</p>
      </header>

      <div className="mx-auto grid max-w-[1760px] grid-cols-[repeat(auto-fill,minmax(440px,1fr))] items-start gap-x-14 gap-y-12 max-[1000px]:grid-cols-1">
        {/* ============ FORM ============ */}
        <Group title="Form" />

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3.5">
            <Button size="lg" icon={undefined}>로그인<ArrowRight size={20} strokeWidth={1.75} /></Button>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button size="sm">Small Button</Button>
            <Button size="sm" variant="secondary">Small Secondary</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button icon={<Copy size={18} strokeWidth={1.75} />}>With icon</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Text Input">
          <FormField label="등록된 이메일" placeholder="name@university.ac.kr" icon={<Mail size={22} strokeWidth={1.75} />} />
          <FormField label="텍스트 입력" placeholder="텍스트를 입력하세요" help="8자 이상, 영문/숫자/특수문자 포함" />
        </Section>

        <Section title="Text area">
          <FormField label="설명" multiline placeholder="문제 설명을 입력하세요" />
        </Section>

        <Section title="Input = error">
          <FormField label="이메일" placeholder="이메일을 입력하세요" defaultValue="abc" error="올바른 이메일 형식을 입력하세요" icon={<Mail size={22} strokeWidth={1.75} />} />
        </Section>

        <Section title="Input + 버튼 (수업 코드 입력)">
          <FormField
            label="수업 코드" placeholder="DS-7K92-QX" value={classCode} onChange={(e) => setClassCode(e.target.value)}
            icon={<Code2 size={22} strokeWidth={1.75} />}
            action={<Button disabled={!classCode}>참여하기</Button>}
            help="영문 대문자, 숫자와 하이픈을 포함한 코드를 입력하세요."
          />
        </Section>

        <Section title="Select">
          <Select label="역할" value={role} onChange={setRole} options={[{ value: "student", label: "학생" }, { value: "professor", label: "교수" }]} />
        </Section>

        <Section title="DateTimePicker">
          <DateTimePicker label="제출 마감" value={due} onChange={setDue} />
        </Section>

        <Section title="Checkbox / Toggle / RadioGroup">
          <Checkbox checked={keep} onChange={setKeep} label="로그인 상태 유지" />
          <Toggle checked={on} onChange={setOn} label="신규 참여 열림" />
          <RadioGroup name="policy" value={policy} onChange={setPolicy}
            options={[{ value: "deny", label: "금지 목록 (기본)" }, { value: "allow", label: "허용 목록" }]} />
        </Section>

        <Section title="SelectCard (로그인 역할 선택)" span={2}>
          <div role="radiogroup" className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
            <SelectCard icon={<Code2 size={26} strokeWidth={1.75} />} title="학생" description="문제 풀이와 채점 결과 확인" selected={selRole === "student"} onSelect={() => setSelRole("student")} />
            <SelectCard icon={<FileText size={26} strokeWidth={1.75} />} title="교수" description="과제 관리와 점수 확정" selected={selRole === "professor"} onSelect={() => setSelRole("professor")} />
            <SelectCard icon={<Users size={26} strokeWidth={1.75} />} title="관리자" description="시스템과 사용자 관리" selected={selRole === "admin"} onSelect={() => setSelRole("admin")} />
          </div>
        </Section>

        <Section title="TagInput (call: / import: / syntax:)">
          <TagInput tags={tags} onChange={setTags} />
        </Section>

        {/* ============ OVERLAY & FEEDBACK ============ */}
        <Group title="Overlay & Feedback" />

        <Section title="Modal">
          <div className="[&>div]:w-full [&>div]:max-w-[480px] [&>div]:shadow-md">
            <ModalPanel title="점수를 공개할까요?" description="미확정 7건은 공개 시점에 자동 채점 점수로 확정돼요.">
              <Button variant="secondary">취소</Button>
              <Button>점수 공개</Button>
            </ModalPanel>
          </div>
          <div className="flex flex-wrap items-center gap-3.5"><Button variant="secondary" size="sm" onClick={() => setModal(true)}>실제 모달 열기</Button></div>
          <ConfirmModal open={modal} title="점수를 공개할까요?" description="미확정 7건은 공개 시점에 자동 채점 점수로 확정돼요."
            confirmLabel="점수 공개" onCancel={() => setModal(false)} onConfirm={() => { setModal(false); toast("success", "점수를 공개했어요"); }} />
        </Section>

        <Section title="Toast">
          <div className="grid gap-3 [&>div]:w-full">
            <ToastCard kind="success"><Check size={24} strokeWidth={2} />입력한 이메일로 비밀번호 재설정 안내를 보냈습니다.</ToastCard>
            <ToastCard><Info size={24} strokeWidth={2} />안내 메시지예요</ToastCard>
            <ToastCard kind="error"><AlertCircle size={24} strokeWidth={2} />저장하지 못했어요</ToastCard>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button size="sm" variant="secondary" onClick={() => toast("success", "입력한 이메일로 비밀번호 재설정 안내를 보냈습니다.")}>success</Button>
            <Button size="sm" variant="secondary" onClick={() => toast("info", "안내 메시지예요")}>info</Button>
            <Button size="sm" variant="secondary" onClick={() => toast("error", "저장하지 못했어요")}>error</Button>
          </div>
        </Section>

        <Section title="Banner">
          <Banner type="warning">FLAG는 오답이 아니며 점수를 자동으로 깎지 않아요.</Banner>
          <Banner type="info">재제출 가능 문제는 마지막 제출이 성적에 반영돼요.</Banner>
          <Banner type="warning" title="1번 줄 · import:re" icon={<TriangleAlert size={22} strokeWidth={1.75} />}>이번 과제의 금지 항목이에요. 점수는 바뀌지 않아요.</Banner>
        </Section>

        <Section title="NotificationPanel">
          <div className="[&>div]:shadow-md">
            <NotificationPanel title="학생 알림" items={NOTIFS} />
          </div>
        </Section>

        <Section title="ErrorMessage / Skeleton">
          <ErrorMessage>채점 결과를 불러오지 못했어요</ErrorMessage>
          <div className="grid gap-2.5"><Skeleton /><Skeleton width="70%" /><Skeleton width="40%" /></div>
        </Section>

        <Section title="EmptyState">
          <Card><EmptyState title="표시할 항목이 없어요" description="수업 코드로 수업에 참여해보세요" action={<Button size="sm">수업 참여</Button>} /></Card>
        </Section>

        {/* ============ NAVIGATION & LAYOUT ============ */}
        <Group title="Navigation & Layout" />

        <Section title="Sidebar (+ SidebarHelpCard)">
          <div className="flex h-[1000px] w-[384px] max-w-full flex-col overflow-hidden rounded-2xl [&>aside]:static [&>aside]:h-full [&>aside]:flex-1">
            <Sidebar role="student" userInitial="김" menuItems={MENU} activePath="/problems" sectionLabel="학습"
              onNavigate={() => {}} onLogout={() => toast("info", "로그아웃")}
              helpCard={<SidebarHelpCard onClick={() => toast("info", "이용 가이드")} />} />
          </div>
        </Section>

        <Section title="Header (Topbar) / PageHeader" span={2}>
          <div className="overflow-hidden rounded-2xl"><Topbar user={{ name: "김민준", sub: "컴퓨터공학과 · 20240123" }} hasUnread /></div>
          <div className="rounded-2xl bg-surface p-6">
            <PageHeader eyebrow="STUDENT · PROBLEMS" title="문제 목록" description="수강 중인 강의의 과제를 확인하고 제출하세요."
              actions={<Button variant="secondary">내 화면으로 돌아가기</Button>} />
          </div>
        </Section>

        <Section title="Tabs">
          <Sub>pill</Sub>
          <Tabs active={tab} onChange={setTab} items={[
            { value: "all", label: "전체", count: 18 }, { value: "open", label: "마감 전", count: 6 }, { value: "done", label: "결과 확인", count: 8 }, { value: "closed", label: "마감", count: 4 },
          ]} />
          <Sub>line</Sub>
          <Tabs variant="line" active={tab2} onChange={setTab2} items={[{ value: "problem", label: "문제" }, { value: "status", label: "제출 현황" }]} />
        </Section>

        <Section title="Stepper">
          <Stepper steps={["대기", "채점 중", "결과 확인"]} current={1} />
          <Stepper steps={["대기", "채점 중", "결과 확인"]} current={3} />
        </Section>

        <Section title="NumberedSteps">
          <Card title="빠른 시작" subtitle="역할별 기본 이용 순서">
            <NumberedSteps items={["문제 목록에서 마감과 재제출 가능 여부를 확인해요.", "Python 코드를 작성하고 제출하면 대기열에 등록돼요.", "대기 → 채점 중 → 결과 확인 순서로 진행돼요.", "교수가 확정한 뒤 최종 점수를 확인할 수 있어요."]} />
          </Card>
        </Section>

        {/* ============ DATA DISPLAY ============ */}
        <Group title="Data Display" />

        <Section title="Card" >
          <Card title="진행 중 과제" subtitle="마감일이 가까운 순서로 표시됩니다."
            action={<button type="button" className={linkButton}>전체 보기<ArrowRight size={18} strokeWidth={1.75} /></button>}>
            기본 카드예요.
          </Card>
          <Card highlight>강조 카드예요.</Card>
        </Section>

        <Section title="StatCard (톤별)" span={2}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            <StatCard tone="blue" icon={<BookOpen size={28} strokeWidth={1.75} />} label="진행 중 과제" value={3} sub="이번 주 마감 2개" />
            <StatCard tone="green" icon={<CheckCircle2 size={28} strokeWidth={1.75} />} label="완료한 문제" value={12} sub="전체 18개 중" />
            <StatCard tone="purple" icon={<FileText size={28} strokeWidth={1.75} />} label="공개된 점수 평균" value="87.5" sub="지난주보다 4.2 상승" />
            <StatCard tone="orange" icon={<Clock size={28} strokeWidth={1.75} />} label="확정 대기" value={1} sub="교수 확인 대기 1건" />
          </div>
        </Section>

        <Section title="Badge">
          <Sub>tone</Sub>
          <div className="flex flex-wrap items-center gap-3.5">{TONES.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}</div>
          <Sub>large</Sub>
          <div className="flex flex-wrap items-center gap-3.5"><Badge tone="info" large>large</Badge></div>
          <Sub>VerdictBadge</Sub>
          <div className="flex flex-wrap items-center gap-3.5">{VERDICTS.map((v) => <VerdictBadge key={v} verdict={v} />)}</div>
          <Sub>VerdictBadge chip (목록 왼쪽)</Sub>
          <div className="flex flex-wrap items-center gap-3.5">{VERDICTS.map((v) => <VerdictBadge key={v} verdict={v} chip />)}</div>
          <Sub>SubmissionStatusBadge</Sub>
          <div className="flex flex-wrap items-center gap-3.5">{STATUSES.map((s) => <SubmissionStatusBadge key={s} status={s} />)}</div>
        </Section>

        <Section title="ScoreDisplay / ProgressRing">
          <div className="flex flex-wrap items-center gap-3.5"><ScoreDisplay score={100} released /><ScoreDisplay score={80} released={false} /><ScoreDisplay released={false} submitted={false} /></div>
          <div className="flex flex-wrap items-center gap-3.5"><ProgressRing percent={0} /><ProgressRing percent={40} /><ProgressRing percent={100} /><ProgressRing percent={null} /></div>
        </Section>

        <Section title="IndexChip / ListRow">
          <Card padding="table">
            <ListRow leading={<IndexChip tone="blue">02</IndexChip>} title="괄호 문자열 검사" subtitle="자료구조 · 문제 #02"
              trailing={<><span><small className="text-sm leading-5 text-fg-secondary">마감</small><br /><b className="font-bold text-danger-fg">5월 28일</b></span><ProgressRing percent={40} /></>} onClick={() => toast("info", "열기")} />
            <ListRow leading={<IndexChip tone="purple">03</IndexChip>} title="최단 경로 찾기" subtitle="알고리즘 · 문제 #03"
              trailing={<ProgressRing percent={0} />} onClick={() => toast("info", "열기")} />
            <ListRow leading={<VerdictBadge verdict="AC" chip />} title="두 수의 합" subtitle="오늘 14:32 · 100점" />
            <ListRow leading={<VerdictBadge verdict="FLAG" chip />} title="정렬 알고리즘" subtitle="5월 20일 · 검토 중" />
          </Card>
        </Section>

        <Section title="DataTable" span="full">
          <Sub>기본 (행 클릭 가능)</Sub>
          <Card padding="table"><DataTable<Row> rows={ROWS} rowKey={(r) => r.id} columns={COLUMNS} onRowClick={(r) => toast("info", `${r.title} 열기`)} /></Card>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            <div><Sub>loading</Sub><Card padding="table"><DataTable<Row> rows={[]} rowKey={(r) => r.id} columns={COLUMNS} loading /></Card></div>
            <div><Sub>empty</Sub><Card padding="table"><DataTable<Row> rows={[]} rowKey={(r) => r.id} columns={COLUMNS} /></Card></div>
            <div><Sub>error</Sub><Card><DataTable<Row> rows={[]} rowKey={(r) => r.id} columns={COLUMNS} error="목록을 불러오지 못했어요" /></Card></div>
          </div>
        </Section>

        <Section title="Icon (lucide · stroke 1.75)" span="full">
          <div className="rounded-2xl bg-surface p-6">
            <Sub>size scale</Sub>
            <div className="mb-6 flex flex-wrap items-center gap-3.5">
              {ICON_SIZES.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2 text-xs leading-4 text-fg-secondary [&_svg]:text-fg"><Home size={s} strokeWidth={1.75} />{s}px</div>
              ))}
            </div>
            <Sub>24px icons in use</Sub>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {ICONS.map((i) => <div key={i.name} className="flex flex-col items-center gap-2 text-xs leading-4 text-fg-secondary [&_svg]:text-fg">{i.node}{i.name}</div>)}
            </div>
          </div>
        </Section>


        {/* ============ ADMIN / PROFESSOR ============ */}
        <Group title="Admin & Professor" />

        <Section title="Sidebar 메뉴 (교수 · 배지 숫자)">
          <div className="flex h-[1000px] w-[384px] max-w-full flex-col overflow-hidden rounded-2xl [&>aside]:static [&>aside]:h-full [&>aside]:flex-1">
            <Sidebar role="professor" userInitial="박" activePath="/classes" sectionLabel="강의 관리"
              menuItems={[
                { path: "/classes", label: "수업 관리", icon: <Users size={24} strokeWidth={1.75} /> },
                { path: "/problems", label: "문제 관리", icon: <BookOpen size={24} strokeWidth={1.75} /> },
                { path: "/review", label: "채점 검토", icon: <Flag size={24} strokeWidth={1.75} />, badge: 7 },
                { path: "/release", label: "점수 공개", icon: <FileText size={24} strokeWidth={1.75} /> },
              ]}
              onNavigate={() => {}} onLogout={() => {}} helpCard={<SidebarHelpCard />} />
          </div>
        </Section>

        <Section title="시스템 운영 현황 (관리자)" span={2}>
          <div className="rounded-2xl bg-surface p-6">
            <PageHeader eyebrow="SYSTEM · OPERATIONS" title="시스템 운영 현황" description="채점 인프라와 작업 큐 상태를 실시간으로 모니터링합니다."
              actions={<><Badge tone="success" dot>실시간 갱신 중</Badge><Button variant="secondary" size="sm" icon={<RotateCcw size={16} strokeWidth={1.75} />}>새로고침</Button></>} />
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              <StatCard tone="orange" icon={<History size={28} strokeWidth={1.75} />} label="큐 대기 건수" value={12} sub="5분 전보다 3건 감소" />
              <StatCard tone="blue" icon={<Server size={28} strokeWidth={1.75} />} label="활성 워커" value="6 / 10" sub="4대 확장 대기" />
              <StatCard tone="green" icon={<Timer size={28} strokeWidth={1.75} />} label="평균 채점 시간" value="3.8초" sub="최근 1시간 기준" />
              <StatCard tone="purple" icon={<Flag size={28} strokeWidth={1.75} />} label="채점 실패" value={3} sub="시스템 오류만 집계" />
            </div>
          </div>
          <BarChart title="큐 적재량" subtitle="최근 12시간 대기 작업 수" legend="대기 작업"
            data={[3, 5, 2, 8, 6, 14, 9, 12, 20, 11, 7, 4]} labels={["09","10","11","12","13","14","15","16","17","18","19","20"]} />
        </Section>

        <Section title="수업 관리 (교수 · 선택된 행)" span={2}>
          <div className="rounded-2xl bg-surface p-6">
            <PageHeader eyebrow="PROFESSOR · CLASSES" title="수업 관리" description="수업 코드와 학생 참여 상태를 관리하세요."
              actions={<Button icon={<Plus size={20} strokeWidth={1.75} />}>새 수업 만들기</Button>} />
          </div>
          <Card padding="table">
            <div className="mb-[22px] flex items-start justify-between gap-4 px-[30px] pt-[30px]">
              <div>
                <h2 className="m-0 text-[22px] leading-[30px] font-medium">내 수업</h2>
                <div className="mt-1.5 text-sm leading-5 text-fg-secondary">수업을 선택하면 참여 코드를 관리할 수 있어요.</div>
              </div>
              <Badge tone="info">3개</Badge>
            </div>
            <DataTable<{ id: number; name: string; term: string; n: string; code: string; open: boolean }>
              rowKey={(r) => r.id} selectedKey={1} onRowClick={() => {}}
              rows={[
                { id: 1, name: "자료구조", term: "2025년 봄학기", n: "60명", code: "DS-7K92-QX", open: true },
                { id: 2, name: "알고리즘", term: "2025년 봄학기", n: "52명", code: "AL-4P18-MN", open: true },
                { id: 3, name: "Python 프로그래밍", term: "2024년 가을학기", n: "48명", code: "PY-9C31-LK", open: false },
              ]}
              columns={[
                { key: "name", header: "수업", render: (r) => <b>{r.name}</b> },
                { key: "term", header: "학기" },
                { key: "n", header: "수강생", render: (r) => <b>{r.n}</b> },
                { key: "code", header: "수업 코드", render: (r) => <span className="font-mono">{r.code}</span> },
                { key: "open", header: "신규 참여", render: (r) => <Badge tone={r.open ? "success" : "neutral"}>{r.open ? "열림" : "닫힘"}</Badge> },
              ]} />
          </Card>
          <Card icon={<Code2 size={28} strokeWidth={1.75} />} title="자료구조" subtitle="2025년 봄학기 · 60명 참여 중"
            action={<Badge tone="info" large>참여 열림</Badge>}><span /></Card>
        </Section>

        {/* ============ DOMAIN ============ */}
        <Group title="Domain (채점 서비스 전용)" />

        <Section title="CodeEditor (macOS 창 + FLAG 줄 강조)" span={2}>
          <CodeEditor value={code} onChange={setCode} flagLines={[5]} minLines={12} />
        </Section>

        <Section title="CodeBlock (읽기 전용)">
          <CodeBlock code={"def solve(arr):\n    return sorted(arr)"} startLine={11} flagLines={[12]} />
        </Section>

        <Section title="FlagCard">
          <FlagCard flags={[{ tag: "import:re", line: 1, code: "import re" }]} />
          <FlagCard flags={[]} />
        </Section>

        <Section title="AllowedScopeCard (허용 범위)">
          <AllowedScopeCard description="스택과 기본 제어문만 사용해 해결하세요." deniedTags={["import:re", "call:eval"]} />
        </Section>

        <Section title="SampleIO / MetaStats / inline code">
          <p className="m-0">여는 괄호 <code className={icode}>(</code> 가 나오면 반드시 대응하는 닫는 괄호 <code className={icode}>)</code> 가 있어야 해요.</p>
          <SampleIO input="(())()" output="YES" />
          <MetaStats items={[{ label: "시간 제한", value: "1초" }, { label: "메모리 제한", value: "128 MB" }, { label: "배점", value: "100점" }]} />
        </Section>

        <Section title="TagChip (읽기 전용)">
          <div className="flex flex-wrap items-center gap-3.5"><TagChip tone="deny">import:re</TagChip><TagChip tone="deny">call:eval</TagChip><TagChip tone="allow">call:sorted</TagChip><TagChip>syntax:For</TagChip></div>
        </Section>

        <Section title="TestcaseGroupCard (비공개 입출력 미노출)" span={2}>
          <TestcaseGroupCard group={{ name: "기본 입력", results: [
            { id: 1, isPublic: true, verdict: "AC", timeSec: 0.02, input: "(())", expected: "YES" },
            { id: 2, isPublic: false, verdict: "WA", timeSec: 0.04, input: "secret", expected: "secret" },
            { id: 3, isPublic: false, verdict: "TLE", timeSec: 1.0 },
          ] }} />
        </Section>

        <Section title="ScoreBreakdown">
          <ScoreBreakdown groupScore={100} latePenalty={0} adjustment={adj} onAdjustmentChange={setAdj}
            reason={reason} onReasonChange={setReason} reasonError={adj !== 0 && !reason ? "조정 사유를 입력해주세요" : undefined} />
        </Section>

        <Section title="SubmissionHistoryList">
          <SubmissionHistoryList items={[{ no: 3, passed: 8, total: 10, isFinal: true }, { no: 2, passed: 6, total: 10, isFinal: false }]} />
        </Section>

        <Section title="ClassCodeBox">
          <Card title="수업 코드"><ClassCodeBox code="DS-7K92-QX" onCopy={() => toast("success", "코드를 복사했어요")} onReissue={() => setModal(true)} /></Card>
        </Section>
      </div>
    </div>
  );
}
