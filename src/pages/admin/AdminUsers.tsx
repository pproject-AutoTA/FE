import { useState, type FormEvent } from "react";
import { BookOpen, ChevronDown, FileText, Search, ShieldCheck, Users } from "lucide-react";
import {
  Badge,
  Banner,
  Button,
  Card,
  DataTable,
  FormField,
  IndexChip,
  ListRow,
  Modal,
  PageHeader,
  Select,
  StatCard,
  Tabs,
  useToast,
  type Column,
} from "../../components";
import { ADMIN_USERS, type AdminUser, type AdminUserRole } from "../../mocks/admin";
import {
  isResourceValue,
  readResourceDefaults,
  RESOURCE_POLICY,
  saveResourceDefaults,
} from "../../resourcePolicy";
import { AdminLayout } from "./AdminLayout";

const ICON = { size: 24, strokeWidth: 1.75 };
const ROLES = {
  STUDENT: {
    label: "학생",
    tone: "neutral",
    icon: BookOpen,
    scope: "문제 열람 · 코드 제출 · 본인 채점 결과 확인",
  },
  PROFESSOR: {
    label: "교수",
    tone: "info",
    icon: FileText,
    scope: "문제·테스트케이스 관리 · 제출 검토 · 점수 확정",
  },
  ADMIN: {
    label: "관리자",
    tone: "flag",
    icon: ShieldCheck,
    scope: "시스템 운영 · 사용자 권한 · 자원 정책 관리",
  },
} as const;
const ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = (
  Object.keys(ROLES) as AdminUserRole[]
).map((value) => ({ value, label: ROLES[value].label }));
const ROLE_STORAGE = "autota.admin.demo-roles";

function readUsers(): AdminUser[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ROLE_STORAGE) ?? "null");
    return ADMIN_USERS.map((user) => {
      const role: unknown = saved?.[user.id];
      return !user.superAdmin && (role === "STUDENT" || role === "PROFESSOR" || role === "ADMIN")
        ? { ...user, role }
        : user;
    });
  } catch {
    return ADMIN_USERS;
  }
}

export function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState(readUsers);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [topQuery, setTopQuery] = useState("");
  const [roleEdit, setRoleEdit] = useState<{ user: AdminUser; role: AdminUserRole } | null>(null);
  const [resourceDefaults] = useState(readResourceDefaults);
  const [time, setTime] = useState(String(resourceDefaults.timeSeconds));
  const [memory, setMemory] = useState(String(resourceDefaults.memoryMb));
  const [validatePolicy, setValidatePolicy] = useState(false);

  const counts = { STUDENT: 0, PROFESSOR: 0, ADMIN: 0 };
  const departments = new Set<string>();
  let activeStudents = 0;
  let superAdmins = 0;
  for (const user of users) {
    counts[user.role]++;
    if (user.role === "STUDENT" && user.status === "ACTIVE") activeStudents++;
    if (user.role === "PROFESSOR" && user.department) departments.add(user.department);
    if (user.role === "ADMIN" && user.superAdmin) superAdmins++;
  }

  const terms = [query, topQuery].map((value) => value.trim().toLowerCase());
  const rows = users.filter(
    (user) =>
      (roleFilter === "all" || user.role === roleFilter) &&
      (statusFilter === "all" || user.status === statusFilter) &&
      terms.every((term) =>
        [user.name, user.email].some((value) => value.toLowerCase().includes(term)),
      ),
  );
  const timeValid = isResourceValue(Number(time), RESOURCE_POLICY.timeSeconds);
  const memoryValid = isResourceValue(Number(memory), RESOURCE_POLICY.memoryMb);

  function updateRole() {
    if (!roleEdit || roleEdit.user.superAdmin || roleEdit.role === roleEdit.user.role) return;
    const next = users.map((user) =>
      user.id === roleEdit.user.id ? { ...user, role: roleEdit.role } : user,
    );
    try {
      localStorage.setItem(
        ROLE_STORAGE,
        JSON.stringify(Object.fromEntries(next.map((user) => [user.id, user.role]))),
      );
    } catch {
      toast("error", "역할을 저장할 수 없습니다.");
      return;
    }
    setUsers(next);
    setRoleEdit(null);
    toast("success", `${roleEdit.user.name} 사용자의 예시 역할을 변경했습니다.`);
  }

  function submitPolicy(event: FormEvent) {
    event.preventDefault();
    setValidatePolicy(true);
    if (!timeValid || !memoryValid) return;
    try {
      saveResourceDefaults({ timeSeconds: Number(time), memoryMb: Number(memory) });
      setValidatePolicy(false);
      toast("success", "자원 정책 기본값을 저장했습니다.");
    } catch {
      toast("error", "자원 정책 기본값을 저장할 수 없습니다.");
    }
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "이름",
      render: (user) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <IndexChip tone="blue">{user.name[0]}</IndexChip>
          <strong className="text-fg">{user.name}</strong>
        </div>
      ),
    },
    { key: "email", header: "이메일" },
    {
      key: "role",
      header: "역할",
      render: (user) => <Badge tone={ROLES[user.role].tone}>{ROLES[user.role].label}</Badge>,
    },
    {
      key: "status",
      header: "상태",
      render: (user) => (
        <Badge tone={user.status === "ACTIVE" ? "success" : "danger"}>
          {user.status === "ACTIVE" ? "활성" : "정지"}
        </Badge>
      ),
    },
    {
      key: "roleChange",
      header: "역할 변경",
      render: (user) => (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={user.superAdmin}
          aria-label={`${user.name} 역할 변경`}
          onClick={() => setRoleEdit({ user, role: user.role })}
        >
          {ROLES[user.role].label}
          <ChevronDown {...ICON} aria-hidden />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout searchPlaceholder="이름 또는 이메일 검색" onSearch={setTopQuery}>
      <PageHeader
        responsive
        eyebrow="SYSTEM · ACCESS CONTROL"
        title="사용자 및 권한"
        description="서비스 사용자와 역할별 접근 권한을 관리하세요."
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,255px),1fr))] gap-5">
        <StatCard
          wrapValue
          label="전체 사용자"
          value={users.length}
          icon={<Users {...ICON} />}
          sub="예시 데이터"
        />
        <StatCard
          wrapValue
          label="학생"
          value={counts.STUDENT}
          icon={<BookOpen {...ICON} />}
          tone="green"
          sub={`활성 ${activeStudents}명`}
        />
        <StatCard
          wrapValue
          label="교수"
          value={counts.PROFESSOR}
          icon={<FileText {...ICON} />}
          tone="purple"
          sub={`${departments.size}개 학과`}
        />
        <StatCard
          wrapValue
          label="관리자"
          value={counts.ADMIN}
          icon={<ShieldCheck {...ICON} />}
          tone="orange"
          sub={`Super Admin ${superAdmins}명`}
        />
      </div>

      <Card padding="table">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="w-full max-w-[435px]">
            <FormField
              hideLabel
              label="사용자 목록 검색"
              placeholder="이름 또는 이메일 검색"
              icon={<Search {...ICON} aria-hidden />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="max-w-full overflow-x-auto">
            <Tabs
              active={roleFilter}
              onChange={setRoleFilter}
              items={[
                { value: "all", label: "전체", count: users.length },
                ...ROLE_OPTIONS.map((option) => ({ ...option, count: counts[option.value] })),
              ]}
            />
          </div>
          <div className="max-w-full overflow-x-auto">
            <Tabs
              active={statusFilter}
              onChange={setStatusFilter}
              items={[
                { value: "all", label: "상태 전체" },
                { value: "ACTIVE", label: "활성" },
                { value: "SUSPENDED", label: "비활성" },
              ]}
            />
          </div>
        </div>
        <DataTable horizontalScroll columns={columns} rows={rows} rowKey={(user) => user.id} />
      </Card>

      <div className="grid gap-6 min-[1000px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card title="자원 정책 기본값" subtitle="새 문제를 만들 때 기본으로 적용됩니다.">
          <form className="grid gap-5" noValidate onSubmit={submitPolicy}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,145px),1fr))] gap-4">
              <FormField
                label="시간 제한 (초)"
                type="number"
                min={RESOURCE_POLICY.timeSeconds.min}
                max={RESOURCE_POLICY.timeSeconds.max}
                value={time}
                error={
                  validatePolicy && !timeValid ? "1–10초 사이의 정수를 입력하세요." : undefined
                }
                onChange={(event) => setTime(event.target.value)}
              />
              <FormField
                label="메모리 제한 (MB)"
                type="number"
                min={RESOURCE_POLICY.memoryMb.min}
                max={RESOURCE_POLICY.memoryMb.max}
                value={memory}
                error={
                  validatePolicy && !memoryValid ? "64–512MB 사이의 정수를 입력하세요." : undefined
                }
                onChange={(event) => setMemory(event.target.value)}
              />
            </div>
            <Banner title="허용 범위">시간 1–10초 · 메모리 64–512MB</Banner>
            <Button type="submit">기본값 저장</Button>
          </form>
        </Card>
        <Card title="역할별 접근 범위" subtitle="각 역할에 부여되는 권한입니다.">
          {ROLE_OPTIONS.map(({ value, label }) => {
            const RoleIcon = ROLES[value].icon;
            return (
              <ListRow
                key={value}
                leading={
                  <IndexChip tone="blue">
                    <RoleIcon {...ICON} aria-hidden />
                  </IndexChip>
                }
                title={label}
                subtitle={ROLES[value].scope}
              />
            );
          })}
        </Card>
      </div>

      <Modal
        open={roleEdit !== null}
        title="역할 변경"
        description={roleEdit ? `${roleEdit.user.name} 사용자의 역할을 선택하세요.` : undefined}
        onClose={() => setRoleEdit(null)}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setRoleEdit(null)}>
              취소
            </Button>
            <Button
              type="button"
              disabled={!roleEdit || roleEdit.role === roleEdit.user.role}
              onClick={updateRole}
            >
              변경 저장
            </Button>
          </>
        }
      >
        {roleEdit && (
          <div className="[&_[role=listbox]]:static [&_[role=listbox]]:mt-2">
            <Select
              label="새 역할"
              value={roleEdit.role}
              options={ROLE_OPTIONS}
              onChange={(role) => setRoleEdit({ ...roleEdit, role })}
            />
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
