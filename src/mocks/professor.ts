import type { Tone } from "../components";
import type { ProblemStatus, TestCase } from "../pages/professor/savedProblems";
import type { MyCoursesResponse } from "../pages/professor/professorCoursesApi";
import type { CourseAssignmentsResponse } from "../pages/professor/professorCourseAssignmentsApi";
import type { ProfessorProblemDetails } from "../pages/professor/professorProblemDetailsApi";

export type Assignment = {
  id: number;
  editKey?: string;
  classId?: string;
  title: string;
  deadline?: string;
  submitted: number;
  total: number;
  flags: number;
  status: ProblemStatus;
  publishAt?: string;
};

/* TODO: 과제 목록 API 연결 후 서버 응답으로 교체. 마감 일시(deadline)가 지나면 화면에서 "종료"로 보인다 */
export const ASSIGNMENTS: Omit<Assignment, "flags">[] = [
  {
    id: 1,
    classId: "algorithms",
    title: "두 수의 합",
    submitted: 50,
    total: 52,
    status: "PUBLISHED",
  },
  {
    id: 2,
    classId: "data-structures",
    title: "괄호 문자열 검사",
    submitted: 43,
    total: 60,
    status: "PUBLISHED",
  },
  {
    id: 3,
    classId: "algorithms",
    title: "최단 경로 찾기",
    submitted: 38,
    total: 52,
    status: "PUBLISHED",
  },
  {
    id: 4,
    classId: "data-structures",
    title: "우선순위 큐 구현",
    submitted: 0,
    total: 60,
    status: "DRAFT",
  },
  {
    id: 5,
    classId: "data-structures",
    title: "스택 수열",
    submitted: 57,
    total: 60,
    status: "PUBLISHED",
  },
  {
    id: 6,
    classId: "operating-systems",
    title: "프로세스 스케줄링",
    submitted: 31,
    total: 45,
    status: "PUBLISHED",
  },
  {
    id: 7,
    classId: "databases",
    title: "SQL 조인 쿼리",
    submitted: 29,
    total: 55,
    status: "PUBLISHED",
  },
  {
    id: 8,
    classId: "networks",
    title: "소켓 통신 구현",
    submitted: 38,
    total: 40,
    status: "PUBLISHED",
  },
  { id: 9, classId: "databases", title: "정규화 연습", submitted: 0, total: 55, status: "DRAFT" },
  {
    id: 10,
    classId: "python",
    title: "리스트 컴프리헨션",
    submitted: 47,
    total: 48,
    status: "PUBLISHED",
  },
  {
    id: 11,
    classId: "data-structures",
    title: "이진 탐색 트리",
    submitted: 12,
    total: 60,
    status: "PUBLISHED",
  },
  {
    id: 12,
    classId: "algorithms",
    title: "동적 계획법 기초",
    submitted: 9,
    total: 52,
    status: "PUBLISHED",
  },
  {
    id: 13,
    classId: "ai-basics",
    title: "선형회귀 구현",
    submitted: 20,
    total: 62,
    status: "PUBLISHED",
  },
];

export type ProblemDetail = {
  description: string;
  deadline: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit: string;
  memoryLimit: string;
  testCases: TestCase[];
};

const tc = (
  id: number,
  input: string,
  expectedOutput: string,
  visibility: TestCase["visibility"] = "private",
): TestCase => ({ id, input, expectedOutput, visibility });

/* TODO: 문제 상세 API 연결 후 서버 응답으로 교체 */
export const PROBLEM_DETAILS: Record<number, ProblemDetail> = {
  1: {
    description: "입력으로 주어진 두 정수의 합을 출력하세요.",
    deadline: "2026-11-10T23:59",
    inputFormat: "공백으로 구분된 두 정수 a, b",
    outputFormat: "a + b",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "1 2", "3", "public"), tc(2, "-5 5", "0")],
  },
  2: {
    description: "주어진 문자열의 괄호가 올바르게 짝지어져 있는지 검사하세요.",
    deadline: "2026-12-02T23:59",
    inputFormat: "'(' 와 ')' 로만 이루어진 문자열 한 줄",
    outputFormat: "올바르면 YES, 아니면 NO",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "(())", "YES", "public"), tc(2, "(()", "NO", "public"), tc(3, ")(", "NO")],
  },
  3: {
    description: "그래프에서 출발 정점부터 각 정점까지의 최단 거리를 구하세요.",
    deadline: "2026-12-05T23:59",
    inputFormat: "정점 수 N, 간선 수 M, 이어서 M개의 (u, v, w)",
    outputFormat: "정점 1부터 N까지의 최단 거리",
    timeLimit: "2",
    memoryLimit: "256",
    testCases: [tc(1, "3 2\n1 2 4\n2 3 1", "0 4 5", "public")],
  },
  4: {
    description: "우선순위에 따라 원소를 삽입하고 꺼내는 큐를 구현하세요.",
    deadline: "2026-12-09T23:59",
    inputFormat: "명령어 push p v / pop",
    outputFormat: "pop 한 값",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [],
  },
  5: {
    description: "1부터 n까지의 수를 스택에 넣고 빼서 주어진 수열을 만들 수 있는지 판단하세요.",
    deadline: "2026-11-18T23:59",
    inputFormat: "n 과 길이 n 의 수열",
    outputFormat: "가능하면 연산 순서, 불가능하면 NO",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "4\n4 3 2 1", "++++----", "public")],
  },
  6: {
    description: "라운드 로빈 방식으로 프로세스를 스케줄링했을 때 평균 대기 시간을 구하세요.",
    deadline: "2026-12-03T23:59",
    inputFormat: "프로세스 수, 시간 할당량, 각 프로세스의 도착·실행 시간",
    outputFormat: "평균 대기 시간(소수점 둘째 자리)",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "3 2\n0 5\n1 3\n2 1", "4.00", "public")],
  },
  7: {
    description: "두 테이블을 조인해 학생별 수강 과목 수를 조회하는 SQL 쿼리를 작성하세요.",
    deadline: "2026-12-07T23:59",
    inputFormat: "students, enrollments 테이블",
    outputFormat: "학생 이름과 수강 과목 수",
    timeLimit: "2",
    memoryLimit: "256",
    testCases: [],
  },
  8: {
    description: "TCP 소켓으로 에코 서버와 클라이언트를 구현하세요.",
    deadline: "2026-11-20T23:59",
    inputFormat: "클라이언트가 보내는 문자열",
    outputFormat: "서버가 돌려보낸 같은 문자열",
    timeLimit: "3",
    memoryLimit: "256",
    testCases: [tc(1, "hello", "hello", "public")],
  },
  9: {
    description: "주어진 릴레이션을 제3정규형까지 정규화하세요.",
    deadline: "2026-12-12T23:59",
    inputFormat: "속성과 함수 종속성 목록",
    outputFormat: "분해된 릴레이션 목록",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [],
  },
  10: {
    description: "리스트 컴프리헨션으로 1부터 n까지 짝수의 제곱 리스트를 만드세요.",
    deadline: "2026-11-12T23:59",
    inputFormat: "정수 n",
    outputFormat: "공백으로 구분한 제곱 값",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "6", "4 16 36", "public")],
  },
  11: {
    description: "이진 탐색 트리에 값을 삽입하고 중위 순회 결과를 출력하세요.",
    deadline: "2026-12-15T23:59",
    inputFormat: "삽입할 정수 목록",
    outputFormat: "중위 순회 결과",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "5 3 8 1", "1 3 5 8", "public")],
  },
  12: {
    description: "계단을 한 번에 1칸 또는 2칸 오를 때 n번째 계단까지 오르는 방법의 수를 구하세요.",
    deadline: "2026-12-18T23:59",
    inputFormat: "정수 n",
    outputFormat: "방법의 수",
    timeLimit: "1",
    memoryLimit: "128",
    testCases: [tc(1, "4", "5", "public")],
  },
  13: {
    description: "경사하강법으로 단순 선형회귀 모델의 기울기와 절편을 구하세요.",
    deadline: "2026-12-10T23:59",
    inputFormat: "(x, y) 데이터 쌍 목록",
    outputFormat: "기울기와 절편",
    timeLimit: "3",
    memoryLimit: "256",
    testCases: [],
  },
};

export type ClassInfo = {
  id: string;
  title: string;
  term: string;
  count: number;
  code: string;
  open: boolean;
};

export const CLASSES: ClassInfo[] = [
  {
    id: "data-structures",
    title: "자료구조",
    term: "2025년 봄학기",
    count: 60,
    code: "DS-7K92-QX",
    open: true,
  },
  {
    id: "algorithms",
    title: "알고리즘",
    term: "2025년 봄학기",
    count: 52,
    code: "AL-4P18-MN",
    open: true,
  },
  {
    id: "python",
    title: "Python 프로그래밍",
    term: "2024년 가을학기",
    count: 48,
    code: "PY-9C31-LK",
    open: false,
  },
  {
    id: "operating-systems",
    title: "운영체제",
    term: "2025년 봄학기",
    count: 45,
    code: "OS-2H64-TV",
    open: true,
  },
  {
    id: "databases",
    title: "데이터베이스",
    term: "2025년 봄학기",
    count: 55,
    code: "DB-8R25-WE",
    open: true,
  },
  {
    id: "networks",
    title: "컴퓨터네트워크",
    term: "2024년 가을학기",
    count: 40,
    code: "CN-3J77-ZA",
    open: false,
  },
  {
    id: "software-engineering",
    title: "소프트웨어공학",
    term: "2024년 가을학기",
    count: 38,
    code: "SE-5M40-BD",
    open: false,
  },
  {
    id: "ai-basics",
    title: "인공지능 기초",
    term: "2025년 봄학기",
    count: 62,
    code: "AI-6F13-YC",
    open: true,
  },
];

// Keep demo links and assignments tied to their existing course IDs.
export const DEMO_COURSE_IDS = new Map<number, string>([
  [3, "data-structures"],
  [4, "algorithms"],
  [5, "python"],
  [6, "operating-systems"],
  [7, "databases"],
  [8, "networks"],
  [9, "software-engineering"],
  [10, "ai-basics"],
]);

export const DEMO_COURSE_ASSIGNMENTS = new Map(
  Array.from(DEMO_COURSE_IDS, ([courseId, demoId]) => {
    const response: CourseAssignmentsResponse = {
      success: true,
      code: "COMMON-200",
      message: "요청에 성공했습니다.",
      data: ASSIGNMENTS.filter((item) => item.classId === demoId && item.status !== "DRAFT").map(
        (item) => ({
          id: item.id,
          title: item.title,
          dueAt: PROBLEM_DETAILS[item.id].deadline,
          studentCount: item.total,
          problems: [
            {
              id: item.id,
              title: item.title,
              resubmitAllowed: true,
              testcaseCount: PROBLEM_DETAILS[item.id].testCases.length,
              submittedStudentCount: item.submitted,
              mySubmission: null,
            },
          ],
        }),
      ),
    };
    return [courseId, response] as const;
  }),
);

export const MY_COURSES_RESPONSE: MyCoursesResponse = {
  success: true,
  code: "COMMON-200",
  message: "요청에 성공했습니다.",
  data: Array.from(DEMO_COURSE_IDS, ([id, demoId]) => {
    const course = CLASSES.find((item) => item.id === demoId)!;
    return {
      id,
      name: course.title,
      semester: course.term === "2025년 봄학기" ? "2025-1" : "2024-2",
      professorName: "박서연",
      joinCode: course.code,
      studentCount: course.count,
      assignmentCount: DEMO_COURSE_ASSIGNMENTS.get(id)?.data.length ?? 0,
    };
  }),
};

export const DEMO_PROBLEM_DETAILS = new Map(
  Array.from(DEMO_COURSE_ASSIGNMENTS).flatMap(([courseId, response]) =>
    response.data.flatMap((assignment) =>
      assignment.problems.map(({ id, title, resubmitAllowed }) => {
        const source = PROBLEM_DETAILS[id];
        const details: ProfessorProblemDetails = {
          id,
          assignmentId: assignment.id,
          courseId,
          title,
          description: source.description,
          inputFormat: source.inputFormat,
          outputFormat: source.outputFormat,
          timeLimitMs: Number(source.timeLimit) * 1000,
          memoryLimitMb: Number(source.memoryLimit),
          resubmitAllowed,
          dueAt: assignment.dueAt,
          testcases: source.testCases.map((testCase, index) => ({
            no: index + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            isPublic: testCase.visibility === "public",
          })),
        };
        return [id, details] as const;
      }),
    ),
  ),
);

/* TODO: 수강생 목록 API 연결 후 서버 응답으로 교체 */
export const STUDENT_NAMES = [
  "김민준",
  "최준서",
  "조채원",
  "임도윤",
  "박수빈",
  "강서현",
  "장예린",
  "이건우",
  "정다은",
  "한유진",
  "오지호",
  "신하은",
  "윤서진",
  "배지안",
  "서도현",
  "문가영",
  "류시우",
  "홍나연",
  "남지훈",
  "권소율",
];
export const DEPARTMENTS = ["컴퓨터공학과", "소프트웨어학과", "인공지능학과", "정보통신공학과"];

export interface Notice {
  id: number;
  tag: string;
  tone: Tone;
  title: string;
  preview: string;
  date: string;
  author: string;
  body: string;
  /** FLAG 처리 원칙 안내 박스를 같이 보여줄지 */
  showFlagRule?: boolean;
}

/* TODO: 공지 API 연결 후 서버 응답으로 교체 */
export const NOTICES: Notice[] = [
  {
    id: 1,
    tag: "채점",
    tone: "info",
    date: "2025. 05. 22",
    author: "AutoTA 운영팀",
    title: "FLAG 검토 및 점수 확정 기준 안내",
    preview: "FLAG 제출의 검토와 점수 조정 방법이 정리되었습니다.",
    body: "FLAG는 허용 범위를 벗어난 요소를 알려주는 검토 정보이며 자동 점수에 영향을 주지 않습니다. 점수를 조정하려면 사유를 입력해야 하고, 검토하지 않은 제출은 점수 공개 시점에 자동 채점 점수로 일괄 확정됩니다.",
    showFlagRule: true,
  },
  {
    id: 2,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 21",
    author: "AutoTA 운영팀",
    title: "서버 정기 점검 일정 안내",
    preview: "5월 25일 새벽 서비스 점검이 예정되어 있습니다.",
    body: "5월 25일 02:00부터 약 30분간 서비스 정기 점검이 진행됩니다. 점검 중에는 채점과 점수 공개 예약 기능이 제한될 수 있으니, 마감이 가까운 과제는 미리 확인해 주세요.",
  },
  {
    id: 3,
    tag: "과제",
    tone: "neutral",
    date: "2025. 05. 20",
    author: "AutoTA 운영팀",
    title: "자료구조 과제 마감 임박 안내",
    preview: "괄호 문자열 검사 과제가 2일 뒤 마감됩니다.",
    body: "괄호 문자열 검사 과제의 제출 마감이 2일 남았습니다. 현재 제출 43건 중 FLAG 3건이 검토를 기다리고 있으니 마감 전에 채점 검토 화면에서 확인해 주세요.",
  },
  {
    id: 4,
    tag: "수업",
    tone: "neutral",
    date: "2025. 05. 18",
    author: "AutoTA 운영팀",
    title: "Python 실행 환경 업데이트",
    preview: "채점 환경이 Python 3.12로 업데이트되었습니다.",
    body: "채점 환경이 Python 3.12로 업데이트되었습니다. 이미 채점된 제출은 영향을 받지 않으며, 새로 제출되는 코드부터 변경된 환경에서 채점됩니다.",
  },
  {
    id: 5,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 17",
    author: "AutoTA 운영팀",
    title: "테스트케이스 등록 용량 제한 안내",
    preview: "테스트케이스 입력·출력은 파일당 최대 1MB입니다.",
    body: "테스트케이스의 입력값과 기대 출력값은 각각 최대 1MB까지 등록할 수 있습니다. 용량을 넘으면 저장이 거절되니 대용량 입력은 나누어 등록해 주세요.",
  },
  {
    id: 6,
    tag: "채점",
    tone: "info",
    date: "2025. 05. 16",
    author: "AutoTA 운영팀",
    title: "부분 점수 계산 방식 안내",
    preview: "테스트케이스 그룹별 통과 비율로 점수가 계산됩니다.",
    body: "부분 점수는 테스트케이스 그룹별 통과 비율에 배점을 곱해 계산합니다. 비공개 테스트케이스의 입출력은 학생에게 공개되지 않고 그룹별 통과 개수만 보여집니다.",
  },
  {
    id: 7,
    tag: "수업",
    tone: "neutral",
    date: "2025. 05. 15",
    author: "AutoTA 운영팀",
    title: "수업 참여 코드 재발급 안내",
    preview: "재발급하면 이전 코드로는 참여할 수 없습니다.",
    body: "수업 참여 코드를 재발급하면 이전 코드는 즉시 사용할 수 없게 됩니다. 이미 참여한 학생은 그대로 유지되며, 새 코드는 수업 관리 화면에서 확인할 수 있습니다.",
  },
  {
    id: 8,
    tag: "과제",
    tone: "neutral",
    date: "2025. 05. 14",
    author: "AutoTA 운영팀",
    title: "점수 공개 예약 기능 안내",
    preview: "점수 공개를 원하는 날짜와 시간으로 예약할 수 있습니다.",
    body: "점수 공개 화면에서 지금 바로 공개하거나 날짜와 시간을 지정해 예약 공개를 선택할 수 있습니다. 공개 시점에 확정되지 않은 제출은 자동 채점 점수로 확정됩니다.",
  },
  {
    id: 9,
    tag: "시스템",
    tone: "flag",
    date: "2025. 05. 12",
    author: "AutoTA 운영팀",
    title: "비밀번호 변경 권장 안내",
    preview: "보안을 위해 비밀번호를 주기적으로 변경해 주세요.",
    body: "계정 보안을 위해 비밀번호를 주기적으로 변경하는 것을 권장합니다. 비밀번호를 잊으셨다면 로그인 화면의 비밀번호 찾기를 이용해 주세요.",
  },
];

export type ReviewItem = {
  id: number;
  /** 과제 목록의 editKey (sample-과제번호) */
  assignmentKey: string;
  name: string;
  studentId: string;
  problem: string;
  /** 자동 채점 점수 */
  score: number;
  flagCount: number;
  tag: string;
  line: number;
  /** FLAG 가 난 줄의 코드 */
  code: string;
  fullCode: string;
  departures: { leftAt: string; returnedAt: string; seconds: number }[];
  groupA: number;
  groupATotal: number;
  groupB: number;
  groupBTotal: number;
};

/* TODO: 검토 대기 제출 API 연결 후 서버 응답으로 교체 */
export const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    assignmentKey: "sample-2",
    name: "김민준",
    studentId: "20240123",
    problem: "괄호 문자열 검사",
    score: 80,
    flagCount: 1,
    tag: "call:sorted",
    line: 12,
    code: "result = sorted(numbers)",
    fullCode:
      "def solve(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if numbers[mid] == target:\n            return mid\n        if numbers[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    result = sorted(numbers)\n    return -1",
    departures: [
      { leftAt: "14:32:08", returnedAt: "14:32:41", seconds: 33 },
      { leftAt: "14:36:12", returnedAt: "14:37:21", seconds: 69 },
    ],
    groupA: 30,
    groupATotal: 30,
    groupB: 50,
    groupBTotal: 70,
  },
  {
    id: 2,
    assignmentKey: "sample-2",
    name: "이서현",
    studentId: "20240156",
    problem: "괄호 문자열 검사",
    score: 85,
    flagCount: 2,
    tag: "import:re",
    line: 1,
    code: "import re",
    fullCode:
      "import re\ndef check_parentheses(text):\n    return re.fullmatch(r'[()]+', text) is not None",
    departures: [],
    groupA: 30,
    groupATotal: 30,
    groupB: 55,
    groupBTotal: 70,
  },
  {
    id: 3,
    assignmentKey: "sample-2",
    name: "정다은",
    studentId: "20240177",
    problem: "괄호 문자열 검사",
    score: 70,
    flagCount: 1,
    tag: "call:eval",
    line: 3,
    code: "    return eval(text) is not None",
    fullCode:
      "def check(text):\n    try:\n        return eval(text) is not None\n    except Exception:\n        return False",
    departures: [{ leftAt: "15:02:10", returnedAt: "15:02:51", seconds: 41 }],
    groupA: 25,
    groupATotal: 30,
    groupB: 45,
    groupBTotal: 70,
  },
  {
    id: 4,
    assignmentKey: "sample-3",
    name: "최지우",
    studentId: "20240204",
    problem: "최단 경로 찾기",
    score: 90,
    flagCount: 1,
    tag: "call:heapify",
    line: 4,
    code: "    heapq.heapify(queue)",
    fullCode:
      "import heapq\ndef build_queue(values):\n    queue = list(values)\n    heapq.heapify(queue)\n    return queue",
    departures: [{ leftAt: "13:08:10", returnedAt: "13:08:34", seconds: 24 }],
    groupA: 30,
    groupATotal: 30,
    groupB: 60,
    groupBTotal: 70,
  },
  {
    id: 5,
    assignmentKey: "sample-3",
    name: "정도윤",
    studentId: "20240098",
    problem: "최단 경로 찾기",
    score: 95,
    flagCount: 2,
    tag: "call:sorted",
    line: 4,
    code: "    return sorted(items)",
    fullCode:
      "def sort_items(items):\n    if not items:\n        return []\n    return sorted(items)",
    departures: [],
    groupA: 30,
    groupATotal: 30,
    groupB: 65,
    groupBTotal: 70,
  },
  {
    id: 6,
    assignmentKey: "sample-1",
    name: "박지민",
    studentId: "20240311",
    problem: "두 수의 합",
    score: 72,
    flagCount: 1,
    tag: "import:math",
    line: 1,
    code: "import math",
    fullCode: "import math\ndef add_pair(a, b):\n    return a + b",
    departures: [
      { leftAt: "10:14:07", returnedAt: "10:15:18", seconds: 71 },
      { leftAt: "10:16:02", returnedAt: "10:17:33", seconds: 91 },
      { leftAt: "10:19:00", returnedAt: "10:19:56", seconds: 56 },
    ],
    groupA: 22,
    groupATotal: 30,
    groupB: 50,
    groupBTotal: 70,
  },
  {
    id: 7,
    assignmentKey: "sample-6",
    name: "강서현",
    studentId: "20240412",
    problem: "프로세스 스케줄링",
    score: 88,
    flagCount: 1,
    tag: "import:queue",
    line: 1,
    code: "import queue",
    fullCode:
      "import queue\n\ndef schedule(procs, quantum):\n    q = queue.Queue()\n    for p in procs:\n        q.put(p)\n    return q.qsize()",
    departures: [],
    groupA: 28,
    groupATotal: 30,
    groupB: 60,
    groupBTotal: 70,
  },
  {
    id: 8,
    assignmentKey: "sample-6",
    name: "임도윤",
    studentId: "20240433",
    problem: "프로세스 스케줄링",
    score: 76,
    flagCount: 2,
    tag: "call:sorted",
    line: 2,
    code: "    procs = sorted(procs)",
    fullCode:
      "def schedule(procs, quantum):\n    procs = sorted(procs)\n    return sum(p[1] for p in procs) / len(procs)",
    departures: [
      { leftAt: "11:20:00", returnedAt: "11:20:40", seconds: 40 },
      { leftAt: "11:25:10", returnedAt: "11:26:05", seconds: 55 },
    ],
    groupA: 24,
    groupATotal: 30,
    groupB: 52,
    groupBTotal: 70,
  },
  {
    id: 9,
    assignmentKey: "sample-7",
    name: "한유진",
    studentId: "20240501",
    problem: "SQL 조인 쿼리",
    score: 92,
    flagCount: 1,
    tag: "import:sqlite3",
    line: 1,
    code: "import sqlite3",
    fullCode:
      'import sqlite3\n\nQUERY = "SELECT s.name, COUNT(e.id) FROM students s JOIN enrollments e ON s.id = e.student_id GROUP BY s.id"',
    departures: [],
    groupA: 30,
    groupATotal: 30,
    groupB: 62,
    groupBTotal: 70,
  },
  {
    id: 10,
    assignmentKey: "sample-7",
    name: "조채원",
    studentId: "20240522",
    problem: "SQL 조인 쿼리",
    score: 68,
    flagCount: 2,
    tag: "import:pandas",
    line: 1,
    code: "import pandas as pd",
    fullCode:
      "import pandas as pd\n\ndef solve(students, enrollments):\n    return students.merge(enrollments).groupby('name').size()",
    departures: [
      { leftAt: "09:40:00", returnedAt: "09:41:10", seconds: 70 },
      { leftAt: "09:45:30", returnedAt: "09:46:40", seconds: 70 },
      { leftAt: "09:50:00", returnedAt: "09:51:30", seconds: 90 },
      { leftAt: "09:55:00", returnedAt: "09:55:30", seconds: 30 },
    ],
    groupA: 20,
    groupATotal: 30,
    groupB: 48,
    groupBTotal: 70,
  },
];

/* TODO: 과제별 학생 제출 답안 API 연결 후 서버 응답으로 교체. 키는 과제 목록의 editKey */
export const SAMPLE_ANSWERS: Record<string, [string, string]> = {
  "sample-1": [
    "a, b = map(int, input().split())\nprint(a + b)",
    "values = list(map(int, input().split()))\nprint(sum(values))",
  ],
  "sample-2": [
    "balance = 0\nfor char in input():\n    balance += 1 if char == '(' else -1\n    if balance < 0:\n        break\nprint('YES' if balance == 0 else 'NO')",
    "stack = []\nvalid = True\nfor char in input():\n    if char == '(':\n        stack.append(char)\n    elif stack:\n        stack.pop()\n    else:\n        valid = False\n        break\nprint('YES' if valid and not stack else 'NO')",
  ],
  "sample-3": [
    "from heapq import heappop, heappush\n\ndef shortest_paths(graph, start):\n    distances = {start: 0}\n    queue = [(0, start)]\n    while queue:\n        distance, node = heappop(queue)\n        if distances[node] != distance:\n            continue\n        for neighbor, weight in graph[node]:\n            candidate = distance + weight\n            if candidate < distances.get(neighbor, float('inf')):\n                distances[neighbor] = candidate\n                heappush(queue, (candidate, neighbor))\n    return distances",
    "def shortest_paths(graph, start):\n    distances = {start: 0}\n    for _ in graph:\n        for node, edges in graph.items():\n            for neighbor, weight in edges:\n                candidate = distances.get(node, float('inf')) + weight\n                if candidate < distances.get(neighbor, float('inf')):\n                    distances[neighbor] = candidate\n    return distances",
  ],
  "sample-4": [
    "from heapq import heappop, heappush\n\nqueue = []\n\ndef push(priority, value):\n    heappush(queue, (priority, value))\n\ndef pop():\n    return heappop(queue)[1]",
    "queue = []\n\ndef push(priority, value):\n    queue.append((priority, value))\n\ndef pop():\n    item = min(queue)\n    queue.remove(item)\n    return item[1]",
  ],
};

/** 위에 없는 과제에 쓰는 기본 답안 */
export const DEFAULT_ANSWERS: [string, string] = [
  "def solve(data):\n    return sum(data)",
  "def solve(data):\n    total = 0\n    for value in data:\n        total += value\n    return total",
];

export const HOME_COURSES = [
  { id: "data-structures", tone: "blue" },
  { id: "algorithms", tone: "purple" },
  { id: "python", tone: "neutral" },
] as const;
export const HOME_GRADING = [
  { id: 2, grading: 4 },
  { id: 6, grading: 2 },
  { id: 3, grading: 3 },
  { id: 7, grading: 3 },
];

/* TODO: 알림 API 연결 후 서버 응답으로 교체 */
export const PROFESSOR_NOTIFICATIONS = [
  {
    id: 1,
    unread: true,
    time: "2시간 전",
    title: "FLAG 검토 및 점수 확정 기준 안내",
    body: "FLAG 제출의 검토와 점수 조정 방법이 정리됐어요.",
  },
  {
    id: 2,
    unread: true,
    time: "어제",
    title: "서버 점검 일정 안내",
    body: "5월 25일 02:00부터 약 30분간 진행됩니다.",
  },
  {
    id: 3,
    unread: true,
    time: "2일 전",
    title: "자료구조 과제 마감 임박",
    body: "괄호 문자열 검사 마감까지 2일 남았어요.",
  },
];

/** 알림 id → 공지 id (TODO: API 연결 후 알림 응답의 noticeId 사용) */
export const PROFESSOR_NOTICE_FOR_NOTIFICATION: Record<string | number, number> = {
  1: 1,
  2: 2,
  3: 3,
};

export function getMockSubmissionMetadata(index: number) {
  return {
    submittedAt: new Date(2026, 10, 20 - (index % 6), 9 + (index % 11), (index * 7) % 60),
    runtimeSeconds: 0.04 + (index % 5) * 0.03,
    memoryMegabytes: 12 + (index % 4) * 2,
    finalScore: [100, 85, 90, 75][index % 4],
  };
}
