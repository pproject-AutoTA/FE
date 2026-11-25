import type { ProblemStatus, TestCase } from "./savedProblems";

export type Assignment = {
  id: number;
  editKey?: string;
  classId?: string;
  title: string;
  due: string;
  deadline?: string;
  submitted: number;
  total: number;
  flags: number;
  status: ProblemStatus;
  publishAt?: string;
};

/* TODO: 과제 목록 API 연결 후 서버 응답으로 교체. 마감 일시(deadline)가 지나면 화면에서 "종료"로 보인다 */
export const ASSIGNMENTS: Omit<Assignment, "flags">[] = [
  { id: 1, classId: "algorithms", title: "두 수의 합", due: "11월 10일 · 마감", submitted: 50, total: 52, status: "공개" },
  { id: 2, classId: "data-structures", title: "괄호 문자열 검사", due: "12월 2일", submitted: 43, total: 60, status: "공개" },
  { id: 3, classId: "algorithms", title: "최단 경로 찾기", due: "12월 5일", submitted: 38, total: 52, status: "공개" },
  { id: 4, classId: "data-structures", title: "우선순위 큐 구현", due: "12월 9일", submitted: 0, total: 60, status: "초안" },
  { id: 5, classId: "data-structures", title: "스택 수열", due: "11월 18일 · 마감", submitted: 57, total: 60, status: "공개" },
  { id: 6, classId: "operating-systems", title: "프로세스 스케줄링", due: "12월 3일", submitted: 31, total: 45, status: "공개" },
  { id: 7, classId: "databases", title: "SQL 조인 쿼리", due: "12월 7일", submitted: 29, total: 55, status: "공개" },
  { id: 8, classId: "networks", title: "소켓 통신 구현", due: "11월 20일 · 마감", submitted: 38, total: 40, status: "공개" },
  { id: 9, classId: "databases", title: "정규화 연습", due: "12월 12일", submitted: 0, total: 55, status: "초안" },
  { id: 10, classId: "python", title: "리스트 컴프리헨션", due: "11월 12일 · 마감", submitted: 47, total: 48, status: "공개" },
  { id: 11, classId: "data-structures", title: "이진 탐색 트리", due: "12월 15일", submitted: 12, total: 60, status: "공개" },
  { id: 12, classId: "algorithms", title: "동적 계획법 기초", due: "12월 18일", submitted: 9, total: 52, status: "공개" },
  { id: 13, classId: "ai-basics", title: "선형회귀 구현", due: "12월 10일", submitted: 20, total: 62, status: "공개" },
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

const tc = (id: number, input: string, expectedOutput: string, visibility: TestCase["visibility"] = "private"): TestCase => ({ id, input, expectedOutput, visibility });

/* TODO: 문제 상세 API 연결 후 서버 응답으로 교체 */
export const PROBLEM_DETAILS: Record<number, ProblemDetail> = {
  1: { description: "입력으로 주어진 두 정수의 합을 출력하세요.", deadline: "2026-11-10T23:59", inputFormat: "공백으로 구분된 두 정수 a, b", outputFormat: "a + b", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "1 2", "3", "public"), tc(2, "-5 5", "0")] },
  2: { description: "주어진 문자열의 괄호가 올바르게 짝지어져 있는지 검사하세요.", deadline: "2026-12-02T23:59", inputFormat: "'(' 와 ')' 로만 이루어진 문자열 한 줄", outputFormat: "올바르면 YES, 아니면 NO", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "(())", "YES", "public"), tc(2, "(()", "NO", "public"), tc(3, ")(", "NO")] },
  3: { description: "그래프에서 출발 정점부터 각 정점까지의 최단 거리를 구하세요.", deadline: "2026-12-05T23:59", inputFormat: "정점 수 N, 간선 수 M, 이어서 M개의 (u, v, w)", outputFormat: "정점 1부터 N까지의 최단 거리", timeLimit: "2", memoryLimit: "256", testCases: [tc(1, "3 2\n1 2 4\n2 3 1", "0 4 5", "public")] },
  4: { description: "우선순위에 따라 원소를 삽입하고 꺼내는 큐를 구현하세요.", deadline: "2026-12-09T23:59", inputFormat: "명령어 push p v / pop", outputFormat: "pop 한 값", timeLimit: "1", memoryLimit: "128", testCases: [] },
  5: { description: "1부터 n까지의 수를 스택에 넣고 빼서 주어진 수열을 만들 수 있는지 판단하세요.", deadline: "2026-11-18T23:59", inputFormat: "n 과 길이 n 의 수열", outputFormat: "가능하면 연산 순서, 불가능하면 NO", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "4\n4 3 2 1", "++++----", "public")] },
  6: { description: "라운드 로빈 방식으로 프로세스를 스케줄링했을 때 평균 대기 시간을 구하세요.", deadline: "2026-12-03T23:59", inputFormat: "프로세스 수, 시간 할당량, 각 프로세스의 도착·실행 시간", outputFormat: "평균 대기 시간(소수점 둘째 자리)", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "3 2\n0 5\n1 3\n2 1", "4.00", "public")] },
  7: { description: "두 테이블을 조인해 학생별 수강 과목 수를 조회하는 SQL 쿼리를 작성하세요.", deadline: "2026-12-07T23:59", inputFormat: "students, enrollments 테이블", outputFormat: "학생 이름과 수강 과목 수", timeLimit: "2", memoryLimit: "256", testCases: [] },
  8: { description: "TCP 소켓으로 에코 서버와 클라이언트를 구현하세요.", deadline: "2026-11-20T23:59", inputFormat: "클라이언트가 보내는 문자열", outputFormat: "서버가 돌려보낸 같은 문자열", timeLimit: "3", memoryLimit: "256", testCases: [tc(1, "hello", "hello", "public")] },
  9: { description: "주어진 릴레이션을 제3정규형까지 정규화하세요.", deadline: "2026-12-12T23:59", inputFormat: "속성과 함수 종속성 목록", outputFormat: "분해된 릴레이션 목록", timeLimit: "1", memoryLimit: "128", testCases: [] },
  10: { description: "리스트 컴프리헨션으로 1부터 n까지 짝수의 제곱 리스트를 만드세요.", deadline: "2026-11-12T23:59", inputFormat: "정수 n", outputFormat: "공백으로 구분한 제곱 값", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "6", "4 16 36", "public")] },
  11: { description: "이진 탐색 트리에 값을 삽입하고 중위 순회 결과를 출력하세요.", deadline: "2026-12-15T23:59", inputFormat: "삽입할 정수 목록", outputFormat: "중위 순회 결과", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "5 3 8 1", "1 3 5 8", "public")] },
  12: { description: "계단을 한 번에 1칸 또는 2칸 오를 때 n번째 계단까지 오르는 방법의 수를 구하세요.", deadline: "2026-12-18T23:59", inputFormat: "정수 n", outputFormat: "방법의 수", timeLimit: "1", memoryLimit: "128", testCases: [tc(1, "4", "5", "public")] },
  13: { description: "경사하강법으로 단순 선형회귀 모델의 기울기와 절편을 구하세요.", deadline: "2026-12-10T23:59", inputFormat: "(x, y) 데이터 쌍 목록", outputFormat: "기울기와 절편", timeLimit: "3", memoryLimit: "256", testCases: [] },
};
