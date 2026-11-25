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
  exits: number;
  awaySeconds: number;
  times: string[];
  groupA: number;
  groupATotal: number;
  groupB: number;
  groupBTotal: number;
};

/* TODO: 검토 대기 제출 API 연결 후 서버 응답으로 교체 */
export const REVIEWS: ReviewItem[] = [
  { id: 1, assignmentKey: "sample-2", name: "김민준", studentId: "20240123", problem: "괄호 문자열 검사", score: 80, flagCount: 1, tag: "call:sorted", line: 12, code: "result = sorted(numbers)", fullCode: "def solve(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if numbers[mid] == target:\n            return mid\n        if numbers[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    result = sorted(numbers)\n    return -1", exits: 2, awaySeconds: 102, times: ["14:32:08 이탈 · 14:32:41 복귀 · 33초", "14:36:12 이탈 · 14:37:21 복귀 · 69초"], groupA: 30, groupATotal: 30, groupB: 50, groupBTotal: 70 },
  { id: 2, assignmentKey: "sample-2", name: "이서현", studentId: "20240156", problem: "괄호 문자열 검사", score: 85, flagCount: 2, tag: "import:re", line: 1, code: "import re", fullCode: "import re\ndef check_parentheses(text):\n    return re.fullmatch(r'[()]+', text) is not None", exits: 0, awaySeconds: 0, times: [], groupA: 30, groupATotal: 30, groupB: 55, groupBTotal: 70 },
  { id: 3, assignmentKey: "sample-2", name: "정다은", studentId: "20240177", problem: "괄호 문자열 검사", score: 70, flagCount: 1, tag: "call:eval", line: 3, code: "    return eval(text) is not None", fullCode: "def check(text):\n    try:\n        return eval(text) is not None\n    except Exception:\n        return False", exits: 1, awaySeconds: 41, times: ["15:02:10 이탈 · 15:02:51 복귀 · 41초"], groupA: 25, groupATotal: 30, groupB: 45, groupBTotal: 70 },
  { id: 4, assignmentKey: "sample-3", name: "최지우", studentId: "20240204", problem: "최단 경로 찾기", score: 90, flagCount: 1, tag: "call:heapify", line: 4, code: "    heapq.heapify(queue)", fullCode: "import heapq\ndef build_queue(values):\n    queue = list(values)\n    heapq.heapify(queue)\n    return queue", exits: 1, awaySeconds: 24, times: ["13:08:10 이탈 · 13:08:34 복귀 · 24초"], groupA: 30, groupATotal: 30, groupB: 60, groupBTotal: 70 },
  { id: 5, assignmentKey: "sample-3", name: "정도윤", studentId: "20240098", problem: "최단 경로 찾기", score: 95, flagCount: 2, tag: "call:sorted", line: 4, code: "    return sorted(items)", fullCode: "def sort_items(items):\n    if not items:\n        return []\n    return sorted(items)", exits: 0, awaySeconds: 0, times: [], groupA: 30, groupATotal: 30, groupB: 65, groupBTotal: 70 },
  { id: 6, assignmentKey: "sample-1", name: "박지민", studentId: "20240311", problem: "두 수의 합", score: 72, flagCount: 1, tag: "import:math", line: 1, code: "import math", fullCode: "import math\ndef add_pair(a, b):\n    return a + b", exits: 3, awaySeconds: 218, times: ["10:14:07 이탈 · 10:15:18 복귀 · 71초", "10:16:02 이탈 · 10:17:33 복귀 · 91초", "10:19:00 이탈 · 10:19:56 복귀 · 56초"], groupA: 22, groupATotal: 30, groupB: 50, groupBTotal: 70 },
  { id: 7, assignmentKey: "sample-6", name: "강서현", studentId: "20240412", problem: "프로세스 스케줄링", score: 88, flagCount: 1, tag: "import:queue", line: 1, code: "import queue", fullCode: "import queue\n\ndef schedule(procs, quantum):\n    q = queue.Queue()\n    for p in procs:\n        q.put(p)\n    return q.qsize()", exits: 0, awaySeconds: 0, times: [], groupA: 28, groupATotal: 30, groupB: 60, groupBTotal: 70 },
  { id: 8, assignmentKey: "sample-6", name: "임도윤", studentId: "20240433", problem: "프로세스 스케줄링", score: 76, flagCount: 2, tag: "call:sorted", line: 2, code: "    procs = sorted(procs)", fullCode: "def schedule(procs, quantum):\n    procs = sorted(procs)\n    return sum(p[1] for p in procs) / len(procs)", exits: 2, awaySeconds: 95, times: ["11:20:00 이탈 · 11:20:40 복귀 · 40초", "11:25:10 이탈 · 11:26:05 복귀 · 55초"], groupA: 24, groupATotal: 30, groupB: 52, groupBTotal: 70 },
  { id: 9, assignmentKey: "sample-7", name: "한유진", studentId: "20240501", problem: "SQL 조인 쿼리", score: 92, flagCount: 1, tag: "import:sqlite3", line: 1, code: "import sqlite3", fullCode: "import sqlite3\n\nQUERY = \"SELECT s.name, COUNT(e.id) FROM students s JOIN enrollments e ON s.id = e.student_id GROUP BY s.id\"", exits: 0, awaySeconds: 0, times: [], groupA: 30, groupATotal: 30, groupB: 62, groupBTotal: 70 },
  { id: 10, assignmentKey: "sample-7", name: "조채원", studentId: "20240522", problem: "SQL 조인 쿼리", score: 68, flagCount: 2, tag: "import:pandas", line: 1, code: "import pandas as pd", fullCode: "import pandas as pd\n\ndef solve(students, enrollments):\n    return students.merge(enrollments).groupby('name').size()", exits: 4, awaySeconds: 260, times: ["09:40:00 이탈 · 09:41:10 복귀 · 70초", "09:45:30 이탈 · 09:46:40 복귀 · 70초", "09:50:00 이탈 · 09:51:30 복귀 · 90초", "09:55:00 이탈 · 09:55:30 복귀 · 30초"], groupA: 20, groupATotal: 30, groupB: 48, groupBTotal: 70 },
];
