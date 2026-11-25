export type ClassInfo = { id: string; title: string; term: string; count: number; code: string; open: boolean };

/* TODO: 내 수업 목록 API 연결 후 서버 응답으로 교체 */
export const CLASSES: ClassInfo[] = [
  { id: "data-structures", title: "자료구조", term: "2025년 봄학기", count: 60, code: "DS-7K92-QX", open: true },
  { id: "algorithms", title: "알고리즘", term: "2025년 봄학기", count: 52, code: "AL-4P18-MN", open: true },
  { id: "python", title: "Python 프로그래밍", term: "2024년 가을학기", count: 48, code: "PY-9C31-LK", open: false },
  { id: "operating-systems", title: "운영체제", term: "2025년 봄학기", count: 45, code: "OS-2H64-TV", open: true },
  { id: "databases", title: "데이터베이스", term: "2025년 봄학기", count: 55, code: "DB-8R25-WE", open: true },
  { id: "networks", title: "컴퓨터네트워크", term: "2024년 가을학기", count: 40, code: "CN-3J77-ZA", open: false },
  { id: "software-engineering", title: "소프트웨어공학", term: "2024년 가을학기", count: 38, code: "SE-5M40-BD", open: false },
  { id: "ai-basics", title: "인공지능 기초", term: "2025년 봄학기", count: 62, code: "AI-6F13-YC", open: true },
];

/* TODO: 수강생 목록 API 연결 후 서버 응답으로 교체 */
export const STUDENT_NAMES = [
  "김민준", "최준서", "조채원", "임도윤", "박수빈", "강서현", "장예린", "이건우", "정다은", "한유진",
  "오지호", "신하은", "윤서진", "배지안", "서도현", "문가영", "류시우", "홍나연", "남지훈", "권소율",
];
export const DEPARTMENTS = ["컴퓨터공학과", "소프트웨어학과", "인공지능학과", "정보통신공학과"];
