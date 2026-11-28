# FE

AutoTA FE 레포지토리입니다.

AutoTA는 프로그래밍 과제를 자동으로 채점하는 서비스입니다. 화면을 만들기 전에 공통 컴포넌트를 먼저 정리했고, 그 위에 로그인 계열 화면, 학생 화면, 교수 화면, 시스템 관리자 화면을 만들었습니다. 서버(API) 연동은 단계별로 진행 중입니다. 로그인, 학생의 수업 참여·문제 조회·코드 제출·채점 결과, 교수의 수업·과제·문제 등록과 조회, 관리자의 시스템 현황·채점 실패 이력은 API로 연결했습니다. 교수·관리자 API는 개발용 모의 API로 먼저 확인했고, 나머지 화면은 아직 임시 데이터로 동작합니다. (연동 현황은 "임시 데이터와 API 연동 현황" 참고)

## 프로젝트 문서

- 팀 노션: [AutoTA](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link) (기획서, 기능 명세서, API 명세서, 화면별 담당자와 진행 현황)
- 디자인: [AutoTA Figma Make](https://www.figma.com/make/OlfzBPA1OLLboDl6eOhRVD/AutoTA-Design)
- GitHub 조직: [pproject-AutoTA](https://github.com/pproject-AutoTA)

## 기술 스택

| 구분   | 사용                                                         |
| ------ | ------------------------------------------------------------ |
| 빌드   | Vite 5                                                       |
| UI     | React 18 + TypeScript 5                                      |
| 라우팅 | react-router-dom 6                                           |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`, 디자인 토큰은 `@theme`) |
| 아이콘 | lucide-react (stroke 1.75)                                   |
| 폰트   | Noto Sans KR (400 / 500 / 700), JetBrains Mono               |

## 시작하기

```bash
git clone https://github.com/pproject-AutoTA/FE.git
cd FE
npm install
cp .env.example .env   # 서버 주소(VITE_API_BASE_URL)를 설정합니다
npm run dev
```

`.env`는 커밋하지 않습니다. 서버 주소는 BE 담당에게 확인하세요. `VITE_API_BASE_URL`을 비워 두면 개발 서버(5173)가 교수·관리자 API(수업·과제·문제, 시스템 현황, 채점 실패 이력)에 같은 경로로 모의 응답을 돌려줍니다(`vite.config.ts`, `src/mocks`). 모의 응답으로 만든 데이터는 개발 서버를 다시 시작하면 초기화됩니다. 로그인과 학생 화면(수업 참여, 코드 제출, 채점 결과)은 모의 API가 없어서 서버가 있어야 동작하고, 학생 홈·목록·공지는 임시 데이터입니다.

실행 후 `http://localhost:5173/login` 에서 시작합니다. 아래 표의 주소로 화면을 확인할 수 있고, 없는 주소는 로그인 화면으로 이동합니다.

```bash
npm run build   # 배포용 빌드 (타입 검사 포함)
```

### 화면 주소

| 주소                                  | 화면                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| `/login`                              | 학생·교수 로그인                                             |
| `/admin/login`                        | 시스템 관리자 로그인                                         |
| `/forgot-password`                    | 비밀번호 찾기                                                |
| `/contact-admin`                      | 관리자에게 문의                                              |
| `/student`                            | 학생 홈                                                      |
| `/student/join`                       | 수업 참여                                                    |
| `/student/problems`                   | 문제 목록                                                    |
| `/student/submit`                     | 코드 제출 (`?problem=문제ID`로 문제 선택, 서버의 문제 ID)    |
| `/student/results`                    | 제출 및 채점 결과 목록                                       |
| `/student/results/:submissionId`      | 채점 결과 상세 (서버의 제출 ID)                              |
| `/student/notices`                    | 전체 공지 (`?notice=번호`로 공지 선택, 알림 클릭 시 이 주소) |
| `/student/guide`                      | 학생 이용 가이드 (사이드바 도움말 카드에서 이동)             |
| `/professor`                          | 교수 홈                                                      |
| `/professor/classes`                  | 수업 관리: 내 수업 목록·수업 개설, 과제 생성·목록, 과제 상세 |
| `/professor/problems`                 | 과제 관리: 등록한 과제 목록                                  |
| `/professor/problems/new`             | 과제 등록 (3단계)                                            |
| `/professor/problems/:problemKey/edit` | 과제 수정 (3단계)                                           |
| `/professor/review`                   | 채점 검토                                                    |
| `/professor/scores`                   | 점수 공개 관리                                               |
| `/admin`                              | 시스템 운영 현황 (큐, 워커 소비자 수, 채점 실패 이력)        |
| `/admin/users`                        | 사용자·권한 (검색·필터, 역할 변경, 접근 범위, 자원 정책)     |
| `/components`                         | 컴포넌트 갤러리                                              |
| `/showcase`                           | 서비스 화면 예시 (정식 화면으로 교체 예정)                   |

로그인은 서버(`POST /auth/login`)와 연결되어 있습니다. 서버가 알려 준 역할(`user.role`)에 따라 학생은 `/student`, 교수는 `/professor`, 시스템 관리자는 `/admin`으로 이동합니다. 로그인하지 않고 `/student`, `/professor`, `/admin` 아래 주소로 들어가면 로그인 화면(`/admin` 아래는 `/admin/login`)으로 이동하고, 다른 역할의 주소로 들어가면 그 역할의 첫 화면으로 이동합니다. 교수·관리자 화면은 일부만 API로 연결되어 있습니다. (아래 연동 현황 참고)

> 교수·관리자 화면은 별도 PR로 올라와 있습니다. 교수 화면은 작업 브랜치에서 `/`에 교수 홈이 열리고 `/classes`, `/problems` 같은 주소를 썼지만, 팀 코드에 통합할 때 위 표의 `/professor/...` 주소로 옮깁니다. 통합할 때는 기존 로그인·학생 라우트를 유지합니다.

## 폴더 구조

```
src/
├─ main.tsx                  # 진입점, 라우터, ToastProvider
├─ api/                      # 서버 호출: client(공통 요청·오류), types(응답 타입), auth, enrollments, problems, submissions, admin, useLoad
├─ mocks/                    # 개발용 모의 API(교수·관리자): professor.ts, admin.ts (vite.config.ts에서 연결)
├─ auth/                     # 로그인 상태: storage(토큰·사용자 저장), home(역할별 첫 화면), RequireAuth(접근 제어)
├─ Showcase.tsx              # 서비스 화면 예시
├─ styles/
│  └─ tailwind.css           # Tailwind 불러오기 + @theme (색, 글꼴, 둥글기, 그림자, 애니메이션)
├─ pages/
│  ├─ ComponentGallery.tsx   # 컴포넌트 갤러리
│  ├─ auth/                  # 로그인 계열: Login, AdminLogin, ForgotPassword, ContactAdmin
│  ├─ professor/             # 교수 화면: ProfessorHome, ProfessorSidebar, 수업 관리, 과제 관리·등록·수정, 채점 검토, 점수 공개, 수업·과제·문제 API 호출 함수(professor*Api.ts)
│  ├─ admin/                 # 시스템 관리자 화면: AdminLayout, AdminHome(운영 현황), AdminUsers(사용자·권한)
│  └─ student/               # 학생 화면
│     ├─ StudentLayout.tsx   # 학생 공통 틀 (사이드바, 상단바, 알림 패널)
│     ├─ StudentHome / StudentJoin / StudentProblems / StudentSubmit
│     ├─ StudentResults / StudentResultDetail / StudentNotices / StudentGuide
│     ├─ format.ts           # 서버 상태·판정·마감 시각을 화면 표시용 값으로 바꾸는 함수
│     └─ mockProblems.ts, mockSubmissions.ts   # 서버 연동 전 임시 데이터(목록·홈 화면)
└─ components/
   ├─ layout/                # 화면 뼈대: AppShell, AuthLayout, Sidebar, Topbar, PageHeader ...
   ├─ ui/                    # 범용 UI: Button, FormField, Select, Card, DataTable, Pagination, Toast ...
   └─ domain/                # 채점 서비스 전용: CodeEditor, ScoreDisplay, VerdictBadge, FlagCard ...
```

한 파일에 컴포넌트 하나를 두고, 각 폴더의 `index.ts`가 `export * from "./X"` 로 다시 내보냅니다. 따라서 어디서든 아래처럼 불러올 수 있습니다.

```tsx
import { Button, Card, ScoreDisplay } from "../components";
```

화면 폴더(`pages/auth`, `pages/student`, `pages/professor`, `pages/admin`)도 `index.ts`로 화면을 다시 내보내고, 라우트는 `main.tsx`에 등록합니다. 학생 화면은 `/student` 아래에 `StudentLayout`을, 관리자 화면은 `/admin` 아래에 `AdminLayout`을 두고 나머지 화면을 하위 라우트로 연결했습니다.

## API 연동

서버 호출은 `src/api`, 로그인 상태는 `src/auth`에 있습니다. 새 API를 연결할 때도 같은 틀을 씁니다.

- **서버 주소**: `.env`의 `VITE_API_BASE_URL`이며, 모든 요청은 `/api/v1` 아래로 보냅니다. 비워 두면 교수·관리자 API는 개발 서버의 모의 응답을 받습니다.
- **요청**: `request<T>(경로, 옵션)`을 쓰면 `Authorization: Bearer {accessToken}`이 자동으로 붙습니다. 성공 응답은 `data`를, 실패 응답은 `ApiError`(`code`, `message`, `errors`)를 던집니다. 서버는 값이 없는 필드를 생략하지 않고 `null`로 내려주므로, 타입은 `T | null`로 정의합니다.
- **화면에서 쓰기**: `useLoad(() => getProblem(id), [id])`로 데이터·오류를 받고, `errorMessage(err)`로 화면에 보여 줄 문구를 만듭니다. 연결 실패와 서버 오류는 "잠시 후 다시 시도해 주세요"로, 그 외에는 서버가 준 메시지를 그대로 보여 줍니다.
- **로그인 상태**: `saveAuth`, `getToken`, `getUser`, `clearAuth`로 다룹니다. "로그인 상태 유지"를 선택하면 `localStorage`에, 아니면 `sessionStorage`에 저장합니다. 토큰이 만료되었거나 없으면(`AUTH-001`, `AUTH-002`, `COMMON-401`) 저장값을 지우고 로그인 화면으로 이동합니다. 리프레시 토큰과 로그아웃 API는 없어서, 로그아웃은 저장값을 지우고 로그인 화면으로 이동하는 것입니다.
- **접근 제어**: `<RequireAuth role="STUDENT" />`처럼 역할별 라우트를 감쌉니다. 사이드바와 상단바의 이름·역할은 `getUser()`로 가져옵니다.
- **서버 시각**: 오프셋 없는 KST 시각이라 학생 화면은 `format.ts`에서 `+09:00`으로 읽습니다. 관리자 채점 실패 이력의 `failedAt`도 오프셋이 없으면 한국 시간으로 해석합니다.
- **개발용 모의 API**: `src/mocks/professor.ts`, `src/mocks/admin.ts`가 명세 형식의 가짜 응답을 만들고 `vite.config.ts`가 개발 서버에 연결합니다. 실제 서버 응답이 아니므로, 모의 API로 확인한 화면도 서버가 열리면 다시 확인해야 합니다.

## 디자인 기준

- 디자인 원본: [AutoTA Figma Make](https://www.figma.com/make/OlfzBPA1OLLboDl6eOhRVD/AutoTA-Design?fullscreen=1&t=xaXvqQknl5TyDucg-1&code-node-id=0-6)
- Figma Make로 만든 AutoTA 화면(로그인, 학생, 교수·관리자 화면)에서 색과 크기를 뽑아 맞췄습니다.
- 색, 글꼴, 둥글기, 그림자, 애니메이션은 `src/styles/tailwind.css`의 `@theme`에서만 정의하고, 컴포넌트와 화면은 Tailwind 유틸리티 클래스로만 작성합니다. 별도 CSS 파일은 만들지 않습니다.
- 주요 색: 네이비 `#123B70`(사이드바), 파랑 `#1D6FF2`(포인트), 배경 `#F5F7FB`.
- 주요 크기: 사이드바 384px, 상단바 105px, 버튼 sm 42 / md 56 / lg 64, 입력창 58px, 카드 모서리 20px.
- 상태 색은 성공 초록, 오류 빨강, FLAG 주황, 안내 파랑, 보라, 중립 회색으로 나눠 쓰며, 모두 `@theme` 색 토큰으로 정의되어 있습니다.
- Tailwind의 기본 초기화(preflight)는 사용하지 않습니다. 그래서 버튼·입력창처럼 브라우저 기본 모양이 남는 요소는 컴포넌트에서 테두리와 여백을 직접 지정합니다.

## 컴포넌트 목록

모든 컴포넌트는 `npm run dev` 실행 후 `http://localhost:5173/components` 에서 한 번에 확인할 수 있습니다.

### Form

버튼(기본, 보조, 작은 크기, 아이콘, 로딩, 비활성), 텍스트 입력, 텍스트 영역, 오류 입력, 입력창 + 버튼(수업 코드), 셀렉트(직접 만든 드롭다운), 날짜·시간(`DateTimePicker`), 체크박스, 토글, 라디오 그룹, 역할 선택 카드(`SelectCard`), 태그 입력(`TagInput`).

### Overlay & Feedback

모달, 토스트, 배너, 알림 패널, 오류 메시지, 스켈레톤, 빈 상태.

토스트는 연한 색 배경에 같은 색 테두리와 글자, 선 아이콘 모양입니다. 성공은 초록, 안내는 파랑, 오류는 빨강입니다. 알림 패널은 알림 한 건을 눌렀을 때의 동작(`onItemClick`)을 연결할 수 있습니다.

### Navigation & Layout

사이드바(로고, 역할 카드, 메뉴, 도움말 카드 `SidebarHelpCard`, 로그아웃), 상단바(`Topbar`, 검색창과 프로필), 페이지 헤더(`PageHeader`), 탭(pill / line), 스테퍼, 번호 목록(`NumberedSteps`).

`/components` 화면에는 없지만 같은 폴더에 있는 컴포넌트도 있습니다.

- `AuthLayout`: 로그인 계열 화면의 공통 틀. `/login`, `/admin/login` 등에서 확인합니다.
- `Pagination`: 페이지 이동. `/student/notices`에서 확인합니다.

### Data Display

카드(기본, 강조), 통계 카드(`StatCard`, 파랑·초록·보라·주황), 배지(톤별, 큰 크기), 판정 배지(AC / WA / TLE / MLE / RE / FLAG, 기본형과 목록 왼쪽 칩), 제출 상태 배지(미제출 / 대기 / 채점 중 / 채점 완료), 점수 표시(`100 / 100 공개`, `공개 전`, `—`), 진행률 링, 번호 칩(`IndexChip`), 목록 행(`ListRow`).

데이터 테이블은 기본(행 클릭 가능), 로딩, 빈 상태, 오류 네 가지 상태를 지원합니다. 아이콘은 lucide 24px, stroke 1.75로 통일했습니다.

### Charts

큐 적재량 막대 차트(`BarChart`)와 판정 분포 도넛 차트(`DonutChart`)입니다. 컴포넌트 갤러리에서 확인할 수 있습니다. 시스템 운영 현황 화면은 서버 명세에 없는 시간대별 큐 추이와 판정 분포를 빼서 지금은 이 차트를 쓰지 않습니다.

### Admin & Professor

관리자 화면의 시스템 운영 현황(통계 카드, 큐별 대기·처리 중 건수, 채점 실패 이력 표)과 사용자·권한(역할 변경 모달), 교수 화면의 사이드바(숫자 배지), 수업 관리 표(선택된 행)를 맞춰 두었습니다.

### Domain (채점 서비스 전용)

코드 에디터(macOS 창 모양, FLAG 줄 강조, 하단 바 `footer`), 읽기 전용 코드 블록, FLAG 카드, 허용 범위 카드, 예제 입출력, 메타 통계(시간·메모리 제한, 배점), 인라인 코드, 태그 칩, 테스트케이스 그룹 카드, 점수 산출(`ScoreBreakdown`), 제출 이력, 수업 코드 박스.

## 학생 화면 동작

- **사이드바 하이라이트**: 현재 주소와 가장 길게 일치하는 메뉴를 강조합니다. 홈은 `/student`일 때만 강조하고, 공지·이용 가이드 화면에서는 메뉴를 강조하지 않습니다.
- **알림 → 공지 이동**: 상단바 알림을 누르면 읽음 처리 후 알림 패널이 닫히고 `/student/notices?notice=번호`로 이동해 해당 공지가 선택됩니다.
- **공지 목록**: 한 페이지에 4개씩 보여주며 `Pagination`으로 이동합니다. 주소의 `?notice=` 값이 다른 페이지의 공지를 가리키면 그 공지가 있는 페이지로 자동 이동합니다.
- **이용 가이드**: 사이드바 도움말 카드에서 `/student/guide`로 이동합니다. 관리자 문의는 `/contact-admin`으로 연결되고 돌아올 위치를 함께 넘깁니다.

### API로 연결된 학생 화면

- **수업 참여(`StudentJoin`)**: 참여 코드를 `POST /enrollments`로 보냅니다. 잘못된 코드·이미 참여한 수업은 입력창 아래에 서버 메시지로 보여 줍니다.
- **코드 제출(`StudentSubmit`)**: `?problem=문제ID`로 문제 상세와 내 제출 이력을 불러오고, 제출하면 채점 결과 화면으로 이동합니다. 마감 후이거나 재제출이 막힌 문제(직전 제출이 채점 실패면 가능)는 제출 버튼을 막습니다. 임시 저장은 서버 API가 없어서 브라우저에 저장합니다.
- **채점 결과 상세(`StudentResultDetail`)**: 제출이 대기 또는 채점 중이면 2초 간격으로 다시 조회하고 끝나면 멈춥니다. 공개 케이스만 입출력을 보여 주고 비공개 케이스는 통과 개수(마감 후에는 결과)만 보여 줍니다. 점수와 교수 평가는 API에 없어서 표시하지 않습니다.
- 학생 홈, 문제 목록, 결과 목록, 공지는 목록·집계 API가 나올 때까지 임시 데이터입니다. 그래서 임시 데이터의 ID로 문제·결과 화면에 들어가면 서버에서 "문제 없음", "제출 없음" 오류가 날 수 있습니다.

## 교수 화면 동작

교수 화면은 박은아가 구현했고 PR 리뷰 후 머지할 예정입니다.

- **교수 홈과 사이드바**: 교수 홈에서 수업 관리, 과제 관리, 채점 검토, 점수 공개 화면으로 이동합니다. `ProfessorSidebar`는 접고 펼칠 수 있습니다.
- **수업 관리**: 수업별 과제 목록과 과제 상세를 보고, 학생 제출 현황을 확인합니다.
- **과제 관리**: 등록한 과제 목록을 보여주고 등록·수정 화면으로 이동합니다. 등록한 과제는 목록에서 다시 열어 수정할 수 있습니다.
- **과제 등록·수정**: 과제 내용 및 실행 조건, 테스트케이스, 정책 설정(제출·공개·검사 정책)의 3단계로 나누어 입력합니다.
- **채점 검토와 점수 공개**: 학생 제출과 채점 결과를 검토하고, 점수 공개를 관리합니다.

### API로 연결된 교수 화면

개발용 모의 API로 등록·조회 흐름을 확인했고, 실제 서버와 교수 계정의 인증·권한은 확인 전입니다. 연결한 명세는 COURSE-01, COURSE-03, PROB-01, PROB-02, PROB-03, PROB-04입니다.

- **수업 조회와 개설(`ProfessorClasses`)**: 내 수업 목록에 수업명, 학기, 수강생 수, 참여 코드를 보여 줍니다. 수업명과 `YYYY-N` 형식의 학기를 검증한 뒤 수업을 개설하고, 개설하면 새 수업 상세로 이동해 서버가 준 참여 코드를 보여 줍니다. 요청 중에는 중복 제출을 막습니다.
- **과제 생성과 목록**: 선택한 수업의 과제 목록에 마감 시각과 문제별 제출 인원을 보여 줍니다. 과제명과 마감 시각으로 과제를 만들면 과제 상세로 이동하고, 과제 상세의 **문제 등록**을 누르면 수업과 과제가 선택된 상태로 등록 화면이 열립니다.
- **문제 등록과 상세(`ProblemEditor`, `ClassAssignmentDetails`)**: 문제 설명, 입출력 형식, 시간·메모리 제한, 재제출 여부, 공개·비공개 테스트케이스를 등록합니다. 마감 시각은 과제의 것을 씁니다. 확인 모달에서 확인한 뒤 요청을 보내고, 성공하면 문제 상세로 이동합니다. 교수 상세에서는 공개·비공개 테스트케이스의 입력과 기대 출력을 모두 볼 수 있습니다(학생 화면은 비공개 케이스를 숨깁니다).
- 과제 공개 예약과 문제별 검사 정책의 서버 저장은 명세가 없어 아직 연결하지 않았습니다.

## 관리자 화면 동작

관리자 화면도 박은아가 구현했고 PR 리뷰 후 머지할 예정입니다. 시스템 관리자 **로그인** 화면(`/admin/login`)은 로그인 계열이라 `pages/auth`에 있습니다.

- **관리자 로그인과 공통 틀**: 로그인하면 시스템 운영 현황으로 이동합니다. 관리자 공통 틀(`AdminLayout`)은 공용 `Sidebar`와 `Topbar`로 시스템 현황과 사용자·권한 메뉴를 구성합니다.
- **시스템 운영 현황(`/admin`, ADMIN-01)**: 큐별 대기·처리 중 건수, 채점·검사 워커 소비자 수, 오늘 채점 완료 건수, 평균 채점 시간을 보여 줍니다. `unacked`와 `avgJudgeTimeMs`가 `null`이면 "집계 없음"으로 표시하고, 평균 채점 시간은 밀리초를 초로 바꿔 보여 줍니다. 서버 명세에 없는 시간대별 큐 추이, 개별 워커 상세, 판정 분포는 운영 화면에서 뺐습니다. 새로고침을 누르면 두 API를 다시 호출합니다.
- **채점 실패 이력(ADMIN-02)**: 제출 ID, 문제 ID, 최종 실패 시각, 실패 원인, 재시도 횟수를 서버가 준 최신순으로 보여 줍니다. 서버 페이지네이션(페이지 크기 20)으로 페이지를 옮기고 전체 건수는 `totalCount`를 씁니다. 검색은 현재 페이지의 제출·문제 ID에만 적용합니다. 최종 실패 이력은 조회만 제공하고 재시도 버튼은 없앴습니다.
- 위 두 화면은 개발용 모의 API로 확인했고, 실제 서버의 관리자 인증과 권한은 확인 전입니다.
- **채점 실패 이력의 기준**: 시스템 문제만 표시합니다. 학생 코드 판정(TLE·MLE·RE)은 시스템 오류가 아니므로 제외합니다.
- **사용자·권한(`/admin/users`)**: 이름·이메일 검색과 역할·활성 상태 필터를 함께 쓸 수 있습니다. 역할 변경 버튼을 누르면 모달에서 새 역할을 고릅니다. 슈퍼 관리자 계정의 역할은 변경할 수 없습니다. 학생·교수·관리자별 접근 범위도 확인할 수 있습니다.
- **자원 정책 기본값**: 시간 제한 1~10초, 메모리 제한 64~512MB 범위에서 기본값을 정합니다. 저장한 값은 같은 브라우저에서 새 교수 문제를 만들 때 적용되고, 이미 만든 문제는 저장된 제한값을 유지합니다.

## 서비스 규칙을 코드에 넣은 부분

- **점수 숨김**: `ScoreDisplay`가 점수 노출을 한곳에서 처리합니다. 서버 연동을 마친 채점 결과 상세 화면은 점수 영역을 두지 않습니다. 교수가 공개하기 전(`released=false`)에는 점수가 전달되어도 숫자를 그리지 않고 "공개 전"으로 표시합니다. 미제출이면 "—"로 표시합니다. Must 범위에서는 점수 칸(열, 탭) 자체를 숨기기로 팀에서 정해 서버 연동 시 반영합니다.
- **비공개 테스트케이스**: `TestcaseGroupCard`와 채점 결과 상세 화면은 비공개 케이스의 입력과 정답을 절대 그리지 않습니다. 공개 케이스만 "입출력 보기"로 펼칠 수 있습니다.
- **FLAG**: 허용되지 않은 요소를 사용한 경우의 표시입니다. 주황색으로 보여주며, 점수는 자동으로 깎지 않습니다.
- **채점 실패 이력**: 관리자 화면은 시스템 문제로 실패한 제출만 보여줍니다. 학생 코드가 낸 RE·TLE·MLE는 제외합니다.

## 임시 데이터와 API 연동 현황

| 화면 | 상태 |
| --- | --- |
| 로그인·관리자 로그인, 접근 제어 | API 연동 |
| 학생: 수업 참여, 코드 제출, 채점 결과 상세 | API 연동 |
| 학생: 홈, 문제 목록, 결과 목록, 공지 | 임시 데이터 (목록·집계 API 명세 대기) |
| 교수: 수업 개설·목록, 과제 생성·목록, 문제 등록·상세 | API 연동 (개발용 모의 API로 확인) |
| 교수: 그 밖의 화면(과제 수정, 채점 검토, 점수 공개 등) | 임시 데이터 |
| 관리자: 시스템 운영 현황, 채점 실패 이력 | API 연동 (개발용 모의 API로 확인) |
| 관리자: 사용자·권한, 자원 정책 | 임시 데이터 (후속 API 명세 대기) |

교수·관리자 화면은 모의 API로만, 학생 화면은 타입 검사까지만 확인했습니다. 실제 서버 확인은 서버가 열리는 대로 진행합니다.

아래 임시 데이터는 API로 바꾸지 않은 화면에서 씁니다.

- 문제: `src/pages/student/mockProblems.ts`
- 제출·채점 결과: `src/pages/student/mockSubmissions.ts`
- 공지, 알림처럼 한 화면에서만 쓰는 데이터는 그 화면 파일 위쪽에 있습니다.
- API로 바꾸지 않은 교수 화면의 데이터는 브라우저의 `localStorage`에 저장합니다. 그래서 브라우저 저장 데이터를 지우면 등록한 내용이 사라질 수 있습니다.
- 관리자 화면의 사용자 목록은 임시 데이터입니다. 역할 변경과 자원 정책 기본값은 브라우저에 저장합니다.
- 교수·관리자 API의 모의 응답은 `src/mocks/professor.ts`, `src/mocks/admin.ts`에 있습니다. 서버 데이터가 아니라 명세를 본뜬 가짜 데이터입니다.

API로 바꿀 자리에는 `// TODO: API` 주석을 남겨 두었습니다. 서버가 준비되면 이 주석을 찾아 임시 데이터를 API 응답으로 교체합니다.

### 서버 연동 계획 (Must 범위)

[팀 노션](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link)의 API 명세서(Must 14개) 기준으로 아래 내용을 팀과 맞췄습니다. 서버 응답이 명세와 같다는 전제입니다.

- **교수 화면**: 수업 개설·조회, 과제 생성·조회, 문제 등록·상세는 연결했고(모의 API로 확인) 실제 서버로 확인하는 일이 남았습니다. 과제 수정·삭제, 채점 검토, 점수 공개는 명세가 나오면 `localStorage` 저장을 API 호출로 교체합니다. 교수·관리자 사이드바의 로그아웃과 프로필 표시는 `src/auth`의 `clearAuth`, `getUser`로 연결합니다.
- **관리자 화면**: 운영 현황은 시스템 현황과 채점 실패 이력 API를 연결했고(모의 API로 확인) 실제 서버로 확인하는 일이 남았습니다. 사용자·권한은 후속 API로 교체합니다. 사용자·권한 관리와 자원 정책은 Must 범위가 아니라 화면만 먼저 만들어 두었습니다.
- **점수**: Must 단계에서는 숨깁니다. 채점 결과 상세는 이미 점수 영역을 뺐고, 목록 화면의 점수 열과 탭은 목록 API를 연결할 때 뺍니다. 공개 기능은 이후 단계에서 붙입니다.
- **과제 목록**: `GET /courses/{courseId}/assignments` 응답(과제와 그 안의 문제)으로 `/student` 아래에 과제 목록 화면을 추가합니다. 교수 화면은 같은 API를 이미 씁니다.
- **목록 API 공통화**: 학생·교수 목록 API는 역할로 나누지 않고 공통으로 쓰며, 역할별 필드는 서버가 정합니다. 해당 없는 필드는 `null`로 내려오므로 화면에서 `null`을 처리합니다.
- **채점 상태 갱신**: 연결 완료. 제출 상태가 대기 또는 채점 중일 때만 2초 간격으로 다시 조회하고, 끝나면 멈춥니다.

## 브랜치와 작업 방식

- 팀 레포(`pproject-AutoTA/FE`)를 본인 계정으로 fork하고, 본인 fork(`origin`)의 기본 브랜치(`이름/main`)에서 기능별 `이름/작업이름` 브랜치를 만들어 작업합니다. 팀 레포는 `upstream`으로 등록해 둡니다. 예) `김채은/auth-api`, `김채은/student-api`
- PR은 본인 fork의 작업 브랜치에서 팀 레포의 `main`으로 올리고, 본문에 `관련 이슈: #번호`와 화면 캡처를 넣습니다. 화면 캡처는 레포에 파일로 두지 않고 PR 본문에만 첨부합니다.
- 커밋 메시지는 `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:` 접두사를 씁니다.
- 공통 컴포넌트(`src/components`) 변경은 화면 PR에 섞지 않고 별도 PR로 올립니다.
- README 수정은 PR 없이 `main`에서 직접 합니다.
- API 연동은 기능별 이슈(예: #12 로그인, #13 학생 화면, #17 교수 화면)를 만들고, 이슈마다 브랜치와 PR을 따로 올립니다. 서버 확인 전의 PR은 Draft로 올리고, 확인 후에 해제합니다. PR 본문에는 모의 API로 확인한 것과 실제 서버로 확인할 것을 나눠 적습니다.
- 화면별 담당: 로그인 계열·학생 화면은 김채은, 교수·시스템 관리자 화면은 박은아입니다.
- 화면별 담당자와 진행 현황은 [팀 노션](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link) 문서에서 관리합니다.

## 개발 메모

- CSS import 오류가 나면 `src/vite-env.d.ts` 에 `/// <reference types="vite/client" />` 가 있는지 확인하세요.
- 폴더 이름은 `components` (복수형)입니다.
- API 호출이 `Failed to fetch`로 실패하면 `.env`의 서버 주소와 서버의 CORS 허용 주소(`http://localhost:5173`)를 먼저 확인하세요. `.env`를 바꾼 뒤에는 `npm run dev`를 다시 시작해야 합니다.
- 로그인 상태를 직접 확인하려면 개발자 도구의 Application 탭에서 `localStorage`와 `sessionStorage`에 저장된 토큰을 보세요. 토큰이나 비밀번호는 이슈, PR, 디스코드에 그대로 올리지 마세요.
- 교수·관리자 화면을 실제 서버로 확인할 때는 `.env`에 서버 주소를 넣고 `npm run dev`를 다시 시작하세요. 주소가 비어 있으면 모의 응답이 나옵니다.
- 새 컴포넌트를 만들면 해당 폴더의 `index.ts`에 한 줄 추가하고, `/components` 화면에도 예시를 넣어 주세요.
- 색이나 둥글기를 바꾸고 싶다면 컴포넌트에 값을 직접 쓰지 말고 `tailwind.css`의 `@theme`에서 바꿉니다.
- 같은 화면의 레이아웃 높이가 페이지마다 흔들리지 않도록, 목록 화면은 한 페이지 항목 수를 고정하고 최소 높이를 지정해 두었습니다.
- 화면이 하얗게 나오면 브라우저 콘솔에서 `does not provide an export named` 오류를 먼저 확인하세요. 파일이 저장되지 않았거나 `index.ts`에 export가 빠진 경우가 많습니다.
