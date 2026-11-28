import type { SubmissionStatus } from "../../components";

export interface Problem {
  id: number;
  title: string;
  course: string;
  /** 화면에 보여줄 마감일 */
  due: string;
  /** 마감이 지났는지 */
  closed: boolean;
  status: SubmissionStatus;
  score: number | null;
  /** 교수가 점수를 공개했는지. false면 점수 숫자를 보여주지 않는다 */
  released: boolean;
  /** true면 "재제출 가능", false면 "한 번만 제출" */
  canResubmit: boolean;
}

/* TODO: 문제 목록 API 연결 후 서버 응답으로 교체 */
export const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "두 수의 합",
    course: "Python 기초",
    due: "5월 18일",
    closed: true,
    status: "DONE",
    score: 100,
    released: true,
    canResubmit: true,
  },
  {
    id: 2,
    title: "괄호 문자열 검사",
    course: "자료구조",
    due: "5월 28일",
    closed: false,
    status: "RUNNING",
    score: null,
    released: false,
    canResubmit: true,
  },
  {
    id: 3,
    title: "최단 경로 찾기",
    course: "알고리즘",
    due: "5월 31일",
    closed: false,
    status: "QUEUED",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 4,
    title: "우선순위 큐 구현",
    course: "자료구조",
    due: "6월 4일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 5,
    title: "문자열 뒤집기",
    course: "Python 기초",
    due: "5월 12일",
    closed: true,
    status: "DONE",
    score: 90,
    released: true,
    canResubmit: true,
  },
  {
    id: 6,
    title: "피보나치 수열",
    course: "Python 기초",
    due: "5월 14일",
    closed: true,
    status: "DONE",
    score: 80,
    released: true,
    canResubmit: true,
  },
  {
    id: 7,
    title: "이진 탐색",
    course: "알고리즘",
    due: "5월 16일",
    closed: true,
    status: "DONE",
    score: 85,
    released: false,
    canResubmit: true,
  },
  {
    id: 8,
    title: "스택 수열",
    course: "자료구조",
    due: "6월 7일",
    closed: false,
    status: "DONE",
    score: 60,
    released: true,
    canResubmit: true,
  },
  {
    id: 9,
    title: "정렬 알고리즘",
    course: "알고리즘",
    due: "6월 9일",
    closed: false,
    status: "DONE",
    score: 100,
    released: true,
    canResubmit: true,
  },
  {
    id: 10,
    title: "큐 시뮬레이션",
    course: "자료구조",
    due: "6월 11일",
    closed: false,
    status: "DONE",
    score: 95,
    released: false,
    canResubmit: true,
  },
  {
    id: 11,
    title: "그래프 탐색 (BFS)",
    course: "알고리즘",
    due: "6월 14일",
    closed: false,
    status: "RUNNING",
    score: null,
    released: false,
    canResubmit: true,
  },
  {
    id: 12,
    title: "동적 계획법 기초",
    course: "알고리즘",
    due: "6월 16일",
    closed: false,
    status: "QUEUED",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 13,
    title: "해시 테이블 구현",
    course: "자료구조",
    due: "6월 18일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 14,
    title: "문자 빈도 세기",
    course: "Python 기초",
    due: "6월 20일",
    closed: false,
    status: "DONE",
    score: 100,
    released: true,
    canResubmit: true,
  },
  {
    id: 15,
    title: "연결 리스트",
    course: "자료구조",
    due: "6월 22일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 16,
    title: "트리 순회",
    course: "자료구조",
    due: "6월 25일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 17,
    title: "최소 신장 트리",
    course: "알고리즘",
    due: "6월 28일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
  {
    id: 18,
    title: "행렬 곱셈",
    course: "컴퓨팅 사고",
    due: "6월 30일",
    closed: false,
    status: "NONE",
    score: null,
    released: false,
    canResubmit: false,
  },
];

/** 문제 상세(문제 설명 + 제출 화면에 필요한 내용) */
export interface ProblemDetail {
  /** 문제 설명. `코드` 처럼 백틱으로 감싼 부분은 작은 코드 표시로 보인다. 빈 줄 = 문단 구분 */
  description: string;
  inputFormat: string;
  /** 입력 범위 같은 제한 사항 (코드 상자로 표시) */
  constraints?: string;
  outputFormat: string;
  sample: { input: string; output: string };
  meta: { label: string; value: string }[];
  scope: { description: string; deniedTags: string[] };
  /** 편집기에 채워 둘 코드. 이미 제출한 문제라면 "내가 마지막으로 제출한 코드" */
  initialCode: string;
  /** 내 제출 이력 (최신순) */
  history: { no: number; passed: number; total: number; isFinal: boolean }[];
}

const DEFAULT_META = [
  { label: "시간 제한", value: "1초" },
  { label: "메모리 제한", value: "128 MB" },
  { label: "배점", value: "100점" },
];

/* TODO: 문제 상세 API 연결 후 서버 응답으로 교체 (문제 id로 조회) */
const DETAILS: Record<number, ProblemDetail> = {
  1: {
    description:
      "정수 `A`와 `B`가 주어질 때, 두 수의 합을 출력하는 프로그램을 작성하세요.",
    inputFormat: "첫째 줄에 두 정수 A와 B가 공백으로 구분되어 주어집니다.",
    constraints: "-1,000 ≤ A, B ≤ 1,000",
    outputFormat: "A + B 의 값을 출력합니다.",
    sample: { input: "3 5", output: "8" },
    meta: DEFAULT_META,
    scope: {
      description: "기본 입출력과 사칙연산만 사용해 해결하세요.",
      deniedTags: ["import:os", "call:eval"],
    },
    initialCode: `a, b = map(int, input().split())
print(a + b)
`,
    history: [{ no: 1, passed: 10, total: 10, isFinal: true }],
  },
  2: {
    description:
      "괄호로 이루어진 문자열이 올바른 괄호 문자열인지 판단하는 프로그램을 작성하세요.\n\n여는 괄호 `(` 가 나오면 반드시 대응하는 닫는 괄호 `)` 가 있어야 하며, 올바르게 중첩되어야 합니다.",
    inputFormat: "첫째 줄에 괄호로만 이루어진 문자열 S가 주어집니다.",
    constraints: "1 ≤ |S| ≤ 100,000",
    outputFormat: "올바른 괄호 문자열이면 `YES`, 아니면 `NO` 를 출력합니다.",
    sample: { input: "(())()", output: "YES" },
    meta: DEFAULT_META,
    scope: {
      description: "스택과 기본 제어문만 사용해 해결하세요.",
      deniedTags: ["import:re", "call:eval"],
    },
    initialCode: `def is_valid_parentheses(s):
    stack = []

    for char in s:
        if char == "(":
            stack.append(char)
        elif not stack:
            return False
        else:
            stack.pop()

    return len(stack) == 0

answer = is_valid_parentheses(input())
print("YES" if answer else "NO")
`,
    // 채점 중인 제출(#2)은 화면에서 제출 상태(RUNNING)를 보고 맨 위에 붙인다
    history: [{ no: 1, passed: 6, total: 10, isFinal: false }],
  },
  3: {
    description:
      "정점 `N`개, 간선 `M`개로 이루어진 가중치 그래프에서 1번 정점에서 `N`번 정점까지의 최단 거리를 구하세요.\n\n도달할 수 없다면 `-1` 을 출력합니다.",
    inputFormat:
      "첫째 줄에 N과 M, 이후 M개의 줄에 간선 정보 (u v w) 가 주어집니다.",
    constraints: "1 ≤ N ≤ 1,000, 0 ≤ M ≤ 10,000",
    outputFormat: "최단 거리를 한 줄에 출력합니다.",
    sample: { input: "3 3\n1 2 4\n2 3 1\n1 3 7", output: "5" },
    meta: [
      { label: "시간 제한", value: "2초" },
      { label: "메모리 제한", value: "256 MB" },
      { label: "배점", value: "100점" },
    ],
    scope: {
      description: "heapq 와 기본 자료구조를 사용할 수 있어요.",
      deniedTags: ["import:networkx", "call:eval"],
    },
    // 이미 제출한 상태(QUEUED)라서 제출한 코드가 들어 있다
    initialCode: `import heapq

n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))

dist = [float("inf")] * (n + 1)
dist[1] = 0
queue = [(0, 1)]
while queue:
    d, u = heapq.heappop(queue)
    if d > dist[u]:
        continue
    for v, w in graph[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(queue, (dist[v], v))

print(dist[n] if dist[n] != float("inf") else -1)
`,
    history: [],
  },
  4: {
    description:
      "우선순위 큐를 직접 구현하고, 입력된 명령을 차례로 처리해 결과를 출력하세요.\n\n`push x` 는 값을 넣고, `pop` 은 가장 작은 값을 꺼내 출력합니다.",
    inputFormat: "첫째 줄에 명령 수 Q, 이후 Q개의 줄에 명령이 주어집니다.",
    constraints: "1 ≤ Q ≤ 100,000",
    outputFormat:
      "`pop` 명령마다 꺼낸 값을 한 줄에 하나씩 출력합니다. 비어 있으면 `-1` 을 출력합니다.",
    sample: { input: "4\npush 3\npush 1\npop\npop", output: "1\n3" },
    meta: DEFAULT_META,
    scope: {
      description: "heapq 모듈 없이 직접 구현해 주세요.",
      deniedTags: ["import:heapq", "call:eval"],
    },
    initialCode: `# 여기에 코드를 작성하세요
`,
    history: [],
  },
};

/** 문제 id 로 목록 정보를 찾는다 */
export const findProblem = (id: number) => PROBLEMS.find((p) => p.id === id);

/**
 * 문제 상세를 돌려준다. 아직 상세 내용이 준비되지 않은 문제는
 * 목록 정보(제목·과목)로 기본 틀을 만들어 같은 화면이 그대로 보이게 한다.
 */
export function getProblemDetail(p: Problem): ProblemDetail {
  return (
    DETAILS[p.id] ?? {
      description: `${p.title} 문제입니다. 자세한 문제 설명은 서버 연동 후 표시돼요.`,
      inputFormat: "입력 형식은 서버 연동 후 표시돼요.",
      outputFormat: "출력 형식은 서버 연동 후 표시돼요.",
      sample: { input: "-", output: "-" },
      meta: DEFAULT_META,
      scope: {
        description: "허용 범위는 서버 연동 후 표시돼요.",
        deniedTags: ["call:eval"],
      },
      initialCode:
        p.status === "NONE"
          ? "# 여기에 코드를 작성하세요\n"
          : "# 제출한 코드는 서버 연동 후 표시돼요.\n",
      history: [],
    }
  );
}
