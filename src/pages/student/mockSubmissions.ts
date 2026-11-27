import type { Verdict } from "../../components";

/** GRADING: 자동 채점 중 / REVIEWING: 교수 검토 중 / REVIEWED: 교수 평가 완료 */
export type Stage = "GRADING" | "REVIEWING" | "REVIEWED";

export interface Submission {
  id: number;
  /** 목록에 보이는 번호 */
  no: number;
  /** 문제 목록의 문제 번호 (눌렀을 때 그 문제 화면으로 이동) */
  problemId: number;
  title: string;
  course: string;
  /** 화면에 보여줄 제출 시각 */
  submittedAt: string;
  /** 자동 판정. 채점 중이면 null */
  verdict: Verdict | null;
  passed: number | null;
  total: number;
  score: number | null;
  /** 교수가 점수를 공개했는지. false면 점수 숫자를 보여주지 않는다 */
  released: boolean;
  stage: Stage;
}

/* TODO: 내 제출 목록 API 연결 후 서버 응답으로 교체 */
export const SUBMISSIONS: Submission[] = [
  {
    id: 1,
    no: 1,
    problemId: 2,
    title: "괄호 문자열 검사",
    course: "자료구조",
    submittedAt: "5월 22일 15:08",
    verdict: "WA",
    passed: 8,
    total: 10,
    score: null,
    released: false,
    stage: "REVIEWED",
  },
  {
    id: 2,
    no: 2,
    problemId: 1,
    title: "두 수의 합",
    course: "Python 기초",
    submittedAt: "5월 20일 14:32",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 100,
    released: true,
    stage: "REVIEWED",
  },
  {
    id: 3,
    no: 3,
    problemId: 8,
    title: "스택 수열",
    course: "자료구조",
    submittedAt: "5월 18일 21:18",
    verdict: "WA",
    passed: 6,
    total: 10,
    score: null,
    released: false,
    stage: "REVIEWING",
  },
  {
    id: 4,
    no: 4,
    problemId: 3,
    title: "최단 경로 찾기",
    course: "알고리즘",
    submittedAt: "오늘 11:24",
    verdict: null,
    passed: null,
    total: 10,
    score: null,
    released: false,
    stage: "GRADING",
  },
  {
    id: 5,
    no: 5,
    problemId: 5,
    title: "문자열 뒤집기",
    course: "Python 기초",
    submittedAt: "5월 12일 10:41",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 90,
    released: true,
    stage: "REVIEWED",
  },
  {
    id: 6,
    no: 6,
    problemId: 6,
    title: "피보나치 수열",
    course: "Python 기초",
    submittedAt: "5월 14일 09:55",
    verdict: "WA",
    passed: 8,
    total: 10,
    score: 80,
    released: true,
    stage: "REVIEWED",
  },
  {
    id: 7,
    no: 7,
    problemId: 7,
    title: "이진 탐색",
    course: "알고리즘",
    submittedAt: "5월 16일 18:20",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 85,
    released: false,
    stage: "REVIEWED",
  },
  {
    id: 8,
    no: 8,
    problemId: 9,
    title: "정렬 알고리즘",
    course: "알고리즘",
    submittedAt: "5월 25일 13:07",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 100,
    released: true,
    stage: "REVIEWED",
  },
  {
    id: 9,
    no: 9,
    problemId: 10,
    title: "큐 시뮬레이션",
    course: "자료구조",
    submittedAt: "5월 26일 16:44",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 95,
    released: false,
    stage: "REVIEWING",
  },
  {
    id: 10,
    no: 10,
    problemId: 11,
    title: "그래프 탐색 (BFS)",
    course: "알고리즘",
    submittedAt: "오늘 11:02",
    verdict: null,
    passed: null,
    total: 10,
    score: null,
    released: false,
    stage: "GRADING",
  },
  {
    id: 11,
    no: 11,
    problemId: 12,
    title: "동적 계획법 기초",
    course: "알고리즘",
    submittedAt: "오늘 10:15",
    verdict: null,
    passed: null,
    total: 10,
    score: null,
    released: false,
    stage: "GRADING",
  },
  {
    id: 12,
    no: 12,
    problemId: 14,
    title: "문자 빈도 세기",
    course: "Python 기초",
    submittedAt: "5월 27일 20:30",
    verdict: "AC",
    passed: 10,
    total: 10,
    score: 100,
    released: true,
    stage: "REVIEWED",
  },
];

/** 테스트케이스 한 건 */
export interface TestcaseRow {
  no: number;
  verdict: Verdict;
  timeSec: number;
  /** 공개 케이스만 입출력을 볼 수 있다. 비공개 케이스의 입출력은 데이터에도 넣지 않는다 */
  isPublic: boolean;
  input?: string;
  expected?: string;
}

export interface TestGroup {
  name: string;
  cases: TestcaseRow[];
}

/** 허용 요소 검사에서 걸린(FLAG) 코드 */
export interface FlagItem {
  line: number;
  tag: string;
  code: string;
}

export interface SubmissionDetail {
  /** 제출 번호 (예: SUB-20250522-1842) */
  code: string;
  groups: TestGroup[];
  flags: FlagItem[];
  info: {
    runtimeMs: number;
    memoryMb: number;
    language: string;
    codeBytes: number;
  };
  /** 같은 문제에 낸 제출들 (최신순). 마지막으로 낸 제출이 성적에 반영된다 */
  attempts: { no: number; at: string; verdict: Verdict; isFinal: boolean }[];
  /** 교수 평가. 아직 없으면 undefined */
  review?: { by: string; at: string; opinion: string };
}

const t = (
  no: number,
  verdict: Verdict,
  timeSec: number,
  isPublic: boolean,
  io?: [string, string],
): TestcaseRow => ({
  no,
  verdict,
  timeSec,
  isPublic,
  ...(isPublic && io ? { input: io[0], expected: io[1] } : {}),
});

/* TODO: 제출 상세 API 연결 후 서버 응답으로 교체 (제출 id로 조회) */
const DETAILS: Record<number, SubmissionDetail> = {
  1: {
    code: "SUB-20250522-1907",
    groups: [
      {
        name: "기본 입력",
        cases: [
          t(1, "AC", 0.02, true, ["(())()", "YES"]),
          t(2, "AC", 0.03, true, ["(()", "NO"]),
          t(3, "AC", 0.02, true, ["()()()", "YES"]),
          t(4, "WA", 0.04, true, [")(", "NO"]),
        ],
      },
      {
        name: "경계값",
        cases: [
          t(5, "AC", 0.04, false),
          t(6, "AC", 0.05, false),
          t(7, "TLE", 1.0, false),
        ],
      },
      {
        name: "큰 입력",
        cases: [
          t(8, "AC", 0.08, false),
          t(9, "AC", 0.09, false),
          t(10, "AC", 0.11, false),
        ],
      },
    ],
    flags: [{ line: 4, tag: "method:list.sort", code: "numbers.sort()" }],
    info: {
      runtimeMs: 84,
      memoryMb: 14.2,
      language: "Python 3.12",
      codeBytes: 428,
    },
    attempts: [
      { no: 3, at: "5월 22일 15:08", verdict: "WA", isFinal: true },
      { no: 2, at: "5월 22일 14:41", verdict: "TLE", isFinal: false },
      { no: 1, at: "5월 22일 14:20", verdict: "WA", isFinal: false },
    ],
    review: {
      by: "박서연 교수",
      at: "5월 23일 10:24 확정",
      opinion:
        "허용 범위를 벗어난 코드가 있어 검토했습니다. 점수는 공개 전까지 확정되지 않아요.",
    },
  },
  2: {
    code: "SUB-20250522-1842",
    groups: [
      {
        name: "기본 입력",
        cases: [
          t(1, "AC", 0.02, true, ["3 5", "8"]),
          t(2, "AC", 0.02, true, ["-4 4", "0"]),
          t(3, "AC", 0.03, true, ["100 200", "300"]),
          t(4, "AC", 0.02, true, ["0 0", "0"]),
        ],
      },
      {
        name: "경계값",
        cases: [
          t(5, "AC", 0.03, false),
          t(6, "AC", 0.03, false),
          t(7, "AC", 0.02, false),
        ],
      },
      {
        name: "큰 입력",
        cases: [
          t(8, "AC", 0.04, false),
          t(9, "AC", 0.04, false),
          t(10, "AC", 0.05, false),
        ],
      },
    ],
    flags: [],
    info: {
      runtimeMs: 31,
      memoryMb: 9.8,
      language: "Python 3.12",
      codeBytes: 62,
    },
    attempts: [{ no: 1, at: "5월 20일 14:32", verdict: "AC", isFinal: true }],
    review: {
      by: "박서연 교수",
      at: "5월 23일 10:24 확정",
      opinion:
        "모든 테스트케이스를 통과했고 코드 가독성도 좋습니다. 최종 점수를 100점으로 확정했습니다.",
    },
  },
};

/** 제출 id 로 목록 정보를 찾는다 */
export const findSubmission = (id: number) =>
  SUBMISSIONS.find((s) => s.id === id);

/**
 * 제출 상세를 돌려준다. 아직 상세 내용이 준비되지 않은 제출은
 * 목록 정보(통과 개수·판정)로 기본 틀을 만들어 같은 화면이 그대로 보이게 한다.
 */
export function getSubmissionDetail(s: Submission): SubmissionDetail {
  const ready = DETAILS[s.id];
  if (ready) return ready;

  const passed = s.passed ?? 0;
  const sizes = [4, 3, 3];
  let no = 0;
  const groups: TestGroup[] =
    s.passed === null
      ? []
      : ["기본 입력", "경계값", "큰 입력"].map((name, gi) => ({
          name,
          cases: Array.from({ length: sizes[gi] }, () => {
            no += 1;
            return t(no, no <= passed ? "AC" : "WA", 0.03, gi === 0, [
              "-",
              "-",
            ]);
          }),
        }));

  return {
    code: `SUB-${String(s.id).padStart(4, "0")}`,
    groups,
    flags: [],
    info: {
      runtimeMs: 40,
      memoryMb: 10,
      language: "Python 3.12",
      codeBytes: 200,
    },
    attempts: s.verdict
      ? [{ no: 1, at: s.submittedAt, verdict: s.verdict, isFinal: true }]
      : [],
    review:
      s.stage === "REVIEWED"
        ? {
            by: "박서연 교수",
            at: "평가 확정",
            opinion: "수고하셨습니다. 최종 점수가 확정되었습니다.",
          }
        : undefined,
  };
}
