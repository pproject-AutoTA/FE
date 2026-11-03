import { useState } from "react";
import { BookOpen, CheckCircle2, ClipboardList, Flag, History, Home, Code2 } from "lucide-react";
import {
  AppShell, Banner, Button, Card, ClassCodeBox, CodeBlock, CodeEditor, ConfirmModal, DataTable, DateTimePicker,
  EmptyState, FlagCard, FormField, PageHeader, ProgressRing, RadioGroup, ScoreBreakdown, ScoreDisplay, StatCard,
  Stepper, SubmissionHistoryList, SubmissionStatusBadge, Tabs, TagInput, TestcaseGroupCard, Toggle, VerdictBadge,
  useToast, type MenuItem, type Verdict, type SubmissionStatus,
} from "./components";

const MENU: MenuItem[] = [
  { path: "/", label: "홈", icon: <Home size={20} strokeWidth={1.75} /> },
  { path: "/problems", label: "문제 목록", icon: <BookOpen size={20} strokeWidth={1.75} /> },
  { path: "/submit", label: "코드 제출", icon: <Code2 size={20} strokeWidth={1.75} /> },
  { path: "/results", label: "제출 및 채점 결과", icon: <History size={20} strokeWidth={1.75} /> },
];

interface Problem { id: number; title: string; course: string; due: string; status: SubmissionStatus; score: number | null; released: boolean }
const PROBLEMS: Problem[] = [
  { id: 1, title: "두 수의 합", course: "Python 기초", due: "오늘 23:59", status: "DONE", score: 100, released: true },
  { id: 2, title: "괄호 문자열 검사", course: "자료구조", due: "5월 28일", status: "DONE", score: 80, released: false },
  { id: 3, title: "최단 경로 찾기", course: "알고리즘", due: "5월 31일", status: "NONE", score: null, released: false },
];

export function Showcase() {
  const toast = useToast();
  const [path, setPath] = useState("/problems");
  const [tab, setTab] = useState("all");
  const [code, setCode] = useState("import re\ndef is_valid(s):\n    stack = []\n    return len(stack) == 0\n");
  const [tags, setTags] = useState(["call:sorted", "import:heapq"]);
  const [policy, setPolicy] = useState<"deny" | "allow">("deny");
  const [open, setOpen] = useState(false);
  const [adj, setAdj] = useState(-20);
  const [reason, setReason] = useState("");
  const [on, setOn] = useState(false);
  const [due, setDue] = useState("");

  const verdicts: Verdict[] = ["AC", "WA", "TLE", "MLE", "RE", "FLAG"];

  return (
    <AppShell
      role="student" user={{ name: "김민준", sub: "컴퓨터공학과" }} hasUnread
      menuItems={MENU} activePath={path} onNavigate={setPath} onLogout={() => toast("info", "로그아웃")}
    >
      <PageHeader eyebrow="STUDENT · PROBLEMS" title="컴포넌트 쇼케이스" description="모든 공통 컴포넌트를 한 화면에서 확인해요."
        actions={<Button onClick={() => toast("success", "저장했어요")}>토스트 확인</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard icon={<BookOpen size={22} strokeWidth={1.75} />} label="진행 중 과제" value={3} sub="이번 주 마감 2개" />
        <StatCard icon={<CheckCircle2 size={22} strokeWidth={1.75} />} label="완료한 문제" value={12} sub="전체 18개 중" />
        <StatCard icon={<ClipboardList size={22} strokeWidth={1.75} />} label="공개된 점수 평균" value="87.5" />
        <StatCard icon={<Flag size={22} strokeWidth={1.75} />} label="확정 대기" value={1} sub="FLAG 제출 1건" />
      </div>

      <Tabs active={tab} onChange={setTab} items={[
        { value: "all", label: "전체", count: 18 }, { value: "open", label: "마감 전", count: 3 }, { value: "done", label: "결과 확인", count: 12 },
      ]} />
      <Card padding="table">
        <DataTable<Problem>
          rows={PROBLEMS} rowKey={(r) => r.id} onRowClick={(r) => toast("info", `${r.title} 열기`)}
          columns={[
            { key: "title", header: "문제", render: (r) => <strong>{String(r.id).padStart(2, "0")} · {r.title}</strong> },
            { key: "course", header: "과목" },
            { key: "due", header: "마감" },
            { key: "status", header: "제출 상태", render: (r) => <SubmissionStatusBadge status={r.status} /> },
            { key: "score", header: "점수", render: (r) => <ScoreDisplay score={r.score} released={r.released} /> },
          ]}
        />
      </Card>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {verdicts.map((v) => <VerdictBadge key={v} verdict={v} />)}
        <ProgressRing percent={40} /><ProgressRing percent={null} />
      </div>
      <Stepper steps={["대기", "채점 중", "결과 확인"]} current={1} />
      <Banner type="warning" title="1번 줄 · import:re">이번 과제의 금지 항목이에요. 점수는 바뀌지 않아요.</Banner>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <CodeEditor value={code} onChange={setCode} flagLines={[1]} minLines={8} />
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <FlagCard flags={[{ tag: "import:re", line: 1, code: "import re" }]} />
          <CodeBlock code={"def solve(arr):\n    return sorted(arr)"} startLine={11} flagLines={[12]} />
        </div>
      </div>

      <TestcaseGroupCard group={{ name: "기본 입력", results: [
        { id: 1, isPublic: true, verdict: "AC", timeSec: 0.02, input: "(())", expected: "YES" },
        { id: 2, isPublic: false, verdict: "WA", timeSec: 0.04 },
        { id: 3, isPublic: false, verdict: "TLE", timeSec: 1.0 },
      ] }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="입력 컴포넌트">
          <div style={{ display: "grid", gap: 14 }}>
            <FormField label="제목" placeholder="문제 제목" />
            <FormField label="이메일" error="올바른 이메일 형식이 아니에요" defaultValue="abc" />
            <DateTimePicker label="제출 마감" value={due} onChange={setDue} />
            <Toggle checked={on} onChange={setOn} label="신규 참여 열림" />
            <RadioGroup name="policy" value={policy} onChange={setPolicy}
              options={[{ value: "deny", label: "금지 목록 (기본)" }, { value: "allow", label: "허용 목록" }]} />
            <TagInput tags={tags} onChange={setTags} />
            <Button variant="secondary" onClick={() => setOpen(true)}>확인 모달 열기</Button>
          </div>
        </Card>
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <ScoreBreakdown groupScore={100} latePenalty={0} adjustment={adj} onAdjustmentChange={setAdj}
            reason={reason} onReasonChange={setReason} reasonError={adj !== 0 && !reason ? "조정 사유를 입력해주세요" : undefined} />
          <SubmissionHistoryList items={[{ no: 3, passed: 8, total: 10, isFinal: true }, { no: 2, passed: 6, total: 10, isFinal: false }]} />
          <Card title="수업 코드"><ClassCodeBox code="DS-7K92-QX" onCopy={() => toast("success", "코드를 복사했어요")} onReissue={() => setOpen(true)} /></Card>
          <Card><EmptyState title="표시할 항목이 없어요" description="수업 코드로 수업에 참여해보세요" /></Card>
        </div>
      </div>

      <ConfirmModal open={open} title="점수를 공개할까요?" description="미확정 7건은 공개 시점에 자동 채점 점수로 확정돼요."
        confirmLabel="점수 공개" onCancel={() => setOpen(false)} onConfirm={() => { setOpen(false); toast("success", "점수를 공개했어요"); }} />
    </AppShell>
  );
}
