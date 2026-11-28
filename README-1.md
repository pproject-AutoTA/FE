# FE

AutoTA FE 레포지토리입니다.

AutoTA는 프로그래밍 과제를 자동으로 채점하는 서비스입니다. 화면을 만들기 전에 공통 컴포넌트를 먼저 정리했고, 그 위에 로그인 계열 화면, 학생 화면, 교수 화면을 만들었습니다. 시스템 관리자 화면은 준비 중입니다.

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
npm run dev
```

실행 후 `http://localhost:5173/login` 에서 시작합니다. 아래 표의 주소로 화면을 확인할 수 있고, 없는 주소는 로그인 화면으로 이동합니다.

```bash
npm run build   # 배포용 빌드 (타입 검사 포함)
```

### 화면 주소

| 주소                                   | 화면                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `/login`                               | 학생·교수 로그인                                             |
| `/admin/login`                         | 시스템 관리자 로그인                                         |
| `/forgot-password`                     | 비밀번호 찾기                                                |
| `/contact-admin`                       | 관리자에게 문의                                              |
| `/student`                             | 학생 홈                                                      |
| `/student/join`                        | 수업 참여                                                    |
| `/student/problems`                    | 문제 목록                                                    |
| `/student/submit`                      | 코드 제출 (`?problem=번호`로 문제 선택)                      |
| `/student/results`                     | 제출 및 채점 결과 목록                                       |
| `/student/results/:submissionId`       | 채점 결과 상세                                               |
| `/student/notices`                     | 전체 공지 (`?notice=번호`로 공지 선택, 알림 클릭 시 이 주소) |
| `/student/guide`                       | 학생 이용 가이드 (사이드바 도움말 카드에서 이동)             |
| `/professor`                           | 교수 홈                                                      |
| `/professor/classes`                   | 수업 관리: 수업별 과제 목록, 과제 상세, 학생 제출 현황       |
| `/professor/problems`                  | 과제 관리: 등록한 과제 목록                                  |
| `/professor/problems/new`              | 과제 등록 (3단계)                                            |
| `/professor/problems/:problemKey/edit` | 과제 수정 (3단계)                                            |
| `/professor/review`                    | 채점 검토                                                    |
| `/professor/scores`                    | 점수 공개 관리                                               |
| `/professor/guide`                     | 교수 이용 가이드 (사이드바 도움말 카드에서 이동)             |
| `/professor/notices`                   | 전체 공지 (`?notice=번호`로 공지 선택, 알림 클릭 시 이 주소) |
| `/admin`                               | 시스템 관리자 화면 (준비 중, 임시 화면)                      |
| `/components`                          | 컴포넌트 갤러리                                              |
| `/showcase`                            | 서비스 화면 예시 (정식 화면으로 교체 예정)                   |

로그인은 아직 서버와 연결되어 있지 않습니다. 로그인 화면에서 학생을 선택하고 로그인하면 `/student`로 이동합니다.

> 로그인 이후 교수 화면으로 이동하는 흐름은 서버 연동 때 연결합니다. 지금은 위 주소로 직접 들어가서 확인합니다.

## 폴더 구조

```
src/
├─ main.tsx                  # 진입점, 라우터, ToastProvider
├─ Showcase.tsx              # 서비스 화면 예시
├─ styles/
│  └─ tailwind.css           # Tailwind 불러오기 + @theme (색, 글꼴, 둥글기, 그림자, 애니메이션)
├─ pages/
│  ├─ ComponentGallery.tsx   # 컴포넌트 갤러리
│  ├─ auth/                  # 로그인 계열: Login, AdminLogin, ForgotPassword, ContactAdmin
│  ├─ professor/             # 교수 화면: ProfessorHome, 수업 관리, 과제 관리·등록·수정, 채점 검토, 점수 공개, 이용 가이드, 전체 공지
│  └─ student/               # 학생 화면
│     ├─ StudentLayout.tsx   # 학생 공통 틀 (사이드바, 상단바, 알림 패널)
│     ├─ StudentHome / StudentJoin / StudentProblems / StudentSubmit
│     ├─ StudentResults / StudentResultDetail / StudentNotices / StudentGuide
│     └─ mockProblems.ts, mockSubmissions.ts   # 서버 연동 전 임시 데이터
└─ components/
   ├─ layout/                # 화면 뼈대: AppShell, AuthLayout, Sidebar, Topbar, PageHeader ...
   ├─ ui/                    # 범용 UI: Button, FormField, Select, Card, DataTable, Pagination, Toast ...
   └─ domain/                # 채점 서비스 전용: CodeEditor, ScoreDisplay, VerdictBadge, FlagCard ...
```

교수 화면 공통 틀(`ProfessorLayout`, `ProfessorSidebar`)은 `components/layout/`에 있습니다.

한 파일에 컴포넌트 하나를 두고, 각 폴더의 `index.ts`가 `export * from "./X"` 로 다시 내보냅니다. 따라서 어디서든 아래처럼 불러올 수 있습니다.

```tsx
import { Button, Card, ScoreDisplay } from "../components";
```

화면 폴더(`pages/auth`, `pages/student`, `pages/professor`, ...)도 `index.ts`로 화면을 다시 내보내고, 라우트는 `main.tsx`에 등록합니다. 학생 화면은 `/student` 아래에 `StudentLayout`을 두고 나머지 화면을 하위 라우트로 연결했습니다.

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

- `AuthLayout`: 로그인 계열 화면의 공통 틀. `/login` 등에서 확인합니다.
- `Pagination`: 페이지 이동. `/student/notices`에서 확인합니다.

### Data Display

카드(기본, 강조), 통계 카드(`StatCard`, 파랑·초록·보라·주황), 배지(톤별, 큰 크기), 판정 배지(AC / WA / TLE / MLE / RE / FLAG, 기본형과 목록 왼쪽 칩), 제출 상태 배지(미제출 / 대기 / 채점 중 / 채점 완료), 점수 표시(`100 / 100 공개`, `공개 전`, `—`), 진행률 링, 번호 칩(`IndexChip`), 목록 행(`ListRow`).

데이터 테이블은 기본(행 클릭 가능), 로딩, 빈 상태, 오류 네 가지 상태를 지원합니다. 아이콘은 lucide 24px, stroke 1.75로 통일했습니다.

### Admin & Professor

관리자 화면의 시스템 운영 현황(통계 카드, 실시간 갱신 배지, 큐 적재량 막대 차트)과 교수 화면의 사이드바(숫자 배지), 수업 관리 표(선택된 행)를 맞춰 두었습니다.

### Domain (채점 서비스 전용)

코드 에디터(macOS 창 모양, FLAG 줄 강조, 하단 바 `footer`), 읽기 전용 코드 블록, FLAG 카드, 허용 범위 카드, 예제 입출력, 메타 통계(시간·메모리 제한, 배점), 인라인 코드, 태그 칩, 테스트케이스 그룹 카드, 점수 산출(`ScoreBreakdown`), 제출 이력, 수업 코드 박스.

## 학생 화면 동작

- **사이드바 하이라이트**: 현재 주소와 가장 길게 일치하는 메뉴를 강조합니다. 홈은 `/student`일 때만 강조하고, 공지·이용 가이드 화면에서는 메뉴를 강조하지 않습니다.
- **알림 → 공지 이동**: 상단바 알림을 누르면 읽음 처리 후 알림 패널이 닫히고 `/student/notices?notice=번호`로 이동해 해당 공지가 선택됩니다.
- **공지 목록**: 한 페이지에 4개씩 보여주며 `Pagination`으로 이동합니다. 주소의 `?notice=` 값이 다른 페이지의 공지를 가리키면 그 공지가 있는 페이지로 자동 이동합니다.
- **이용 가이드**: 사이드바 도움말 카드에서 `/student/guide`로 이동합니다. 관리자 문의는 `/contact-admin`으로 연결되고 돌아올 위치를 함께 넘깁니다.

## 교수 화면 동작

교수 화면은 박은아가 구현했고 팀 코드에 통합했습니다. 교수 홈에서 수업 관리, 과제 관리, 채점 검토, 점수 공개 화면으로 이동하며, `ProfessorSidebar`는 접고 펼칠 수 있고 "채점 검토" 옆 숫자로 검토할 제출 수를 알려 줍니다. 상단바 알림(FLAG 검토 요청, 마감 임박 등)을 누르면 읽음 처리 후 `/professor/notices?notice=번호`로 이동해 해당 공지가 선택되고, 공지 목록은 한 페이지에 4개씩 보여줍니다. 사이드바 도움말 카드를 누르면 `/professor/guide`의 이용 가이드가 열립니다.

수업 관리에서는 수업 목록을 보고 수업 코드 발급·재발급과 신규 참여 열림·닫힘을 설정합니다. 코드를 재발급하면 이전 코드로는 참여할 수 없고 이미 참여한 학생은 그대로 유지됩니다. 수업 상세에서는 과제 목록과 학생 제출 현황을 확인하고, 학생을 고르면 제출 코드와 채점 정보를 오른쪽에서 바로 봅니다. 과제 관리는 등록한 과제 목록을 보여주고 등록·수정 화면으로 이동하며, 등록한 과제는 목록에서 다시 열어 수정할 수 있습니다. 과제 등록·수정은 과제 내용 및 실행 조건, 테스트케이스, 정책 설정(제출·공개·검사 정책)의 3단계로 나누어 입력하고, 제출 정책에서 "화면 이탈 기록 사용"을 켜고 끌 수 있습니다.

채점 검토는 FLAG나 조정이 필요한 제출을 과제별로 모아 6건씩 보여줍니다. 상세 화면에서는 같은 과제의 다른 학생 답안으로 바로 옮겨 가며 비교하고, 허용 요소 검사(FLAG 근거)와 화면 이탈 기록을 함께 확인합니다. 점수 공개는 과제별 확정 현황을 5건씩 보여주고 즉시 공개 또는 예약 공개를 고릅니다. 미확정 제출은 공개 시점에 자동 채점 점수로 확정된다고 확인 창에서 안내하며, 확인 창(`ConfirmModal`)의 설명은 줄바꿈(`\n`)을 그대로 보여주므로 문장이 끝날 때마다 다음 줄로 나누어 쓸 수 있습니다.

## 서비스 규칙을 코드에 넣은 부분

- **점수 숨김**: `ScoreDisplay`가 점수 노출을 한곳에서 처리합니다. 교수가 공개하기 전(`released=false`)에는 점수가 전달되어도 숫자를 그리지 않고 "공개 전"으로 표시합니다. 미제출이면 "—"로 표시합니다. Must 범위에서는 점수 칸(열, 탭) 자체를 숨기기로 팀에서 정해 서버 연동 시 반영합니다.
- **비공개 테스트케이스**: `TestcaseGroupCard`와 채점 결과 상세 화면은 비공개 케이스의 입력과 정답을 절대 그리지 않습니다. 공개 케이스만 "입출력 보기"로 펼칠 수 있습니다.
- **FLAG**: 허용되지 않은 요소를 사용한 경우의 표시입니다. 주황색으로 보여주며, 점수는 자동으로 깎지 않습니다.
- **화면 이탈 기록**: 교수가 문제 등록 3단계의 제출 정책에서 "화면 이탈 기록 사용"을 켜면, 학생이 외부 창을 띄워 화면 활성이 풀린 횟수와 벗어난 시간을 기록합니다. 채점 검토 상세 화면에서 교수에게만 참고용으로 보여주며, 점수에는 반영하지 않습니다.

## 서버 연동 전 임시 데이터

서버(API)가 아직 없어서 학생·교수 화면은 임시 데이터로 동작합니다.

- 문제: `src/pages/student/mockProblems.ts`
- 제출·채점 결과: `src/pages/student/mockSubmissions.ts`
- 공지, 알림처럼 한 화면에서만 쓰는 데이터는 그 화면 파일 위쪽에 있습니다.
- 교수 화면의 수업·과제 데이터는 임시 데이터로 동작하며 브라우저의 `localStorage`에 저장합니다. 그래서 브라우저 저장 데이터를 지우면 등록한 과제가 사라집니다.

API로 바꿀 자리에는 `// TODO: API` 주석을 남겨 두었습니다. 서버가 준비되면 이 주석을 찾아 임시 데이터를 API 응답으로 교체합니다.

### 서버 연동 계획 (Must 범위)

[팀 노션](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link)의 API 명세서(Must 14개) 기준으로 아래 내용을 팀과 맞췄습니다. 서버 응답이 명세와 같다는 전제입니다.

- **교수 화면**: 서버 연동 후 `localStorage` 저장을 API 호출로 교체하고, 로그인 이후 교수 화면으로 이동하는 흐름을 연결합니다.
- **점수**: Must 단계에서는 숨깁니다. 점수 열과 탭은 화면에서 빼고, 공개 기능은 이후 단계에서 붙입니다.
- **과제 목록**: `GET /courses/{courseId}/assignments` 응답(과제와 그 안의 문제)으로 `/student` 아래에 과제 목록 화면을 추가합니다.
- **목록 API 공통화**: 학생·교수 목록 API는 역할로 나누지 않고 공통으로 쓰며, 역할별 필드는 서버가 정합니다. 해당 없는 필드는 `null`로 내려오므로 화면에서 `null`을 처리합니다.
- **채점 상태 갱신**: 제출 상태가 대기 또는 채점 중일 때만 2초 간격으로 다시 조회하고, 끝나면 멈춥니다.

## 브랜치와 작업 방식

- 본인 포크(`origin`)의 기본 브랜치(`이름/main`)에서 기능별 `이름/작업이름` 브랜치를 만들어 작업합니다. 원본 레포는 `upstream`으로 등록해 둡니다. 예) `김채은/auth`, `김채은/student`
- PR은 `이름/main` ← `이름/작업이름` 으로 올리고, 본문에 `관련 이슈: #번호`와 화면 캡처를 넣습니다. 화면 캡처는 레포에 파일로 두지 않고 PR 본문에만 첨부합니다.
- 커밋 메시지는 `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:` 접두사를 씁니다.
- 공통 컴포넌트(`src/components`) 변경은 화면 PR에 섞지 않고 별도 PR로 올립니다.
- README 수정은 PR 없이 `main`에서 직접 합니다.
- 화면별 담당: 로그인 계열·학생 화면은 김채은, 교수·시스템 관리자 화면은 박은아입니다.
- 화면별 담당자와 진행 현황은 [팀 노션](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link) 문서에서 관리합니다.

## 개발 메모

- CSS import 오류가 나면 `src/vite-env.d.ts` 에 `/// <reference types="vite/client" />` 가 있는지 확인하세요.
- 폴더 이름은 `components` (복수형)입니다.
- 새 컴포넌트를 만들면 해당 폴더의 `index.ts`에 한 줄 추가하고, `/components` 화면에도 예시를 넣어 주세요.
- 색이나 둥글기를 바꾸고 싶다면 컴포넌트에 값을 직접 쓰지 말고 `tailwind.css`의 `@theme`에서 바꿉니다.
- 같은 화면의 레이아웃 높이가 페이지마다 흔들리지 않도록, 목록 화면은 한 페이지 항목 수를 고정하고 최소 높이를 지정해 두었습니다.
- 화면이 하얗게 나오면 브라우저 콘솔에서 `does not provide an export named` 오류를 먼저 확인하세요. 파일이 저장되지 않았거나 `index.ts`에 export가 빠진 경우가 많습니다.
