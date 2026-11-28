# FE

AutoTA FE 레포지토리입니다.

AutoTA는 프로그래밍 과제를 자동으로 채점하는 서비스입니다. 화면을 만들기 전에 공통 컴포넌트를 먼저 정리했고, 그 위에 로그인 계열 화면과 학생 화면을 만들어 서버(API)와 연결했습니다. 교수·관리자 화면은 준비 중입니다.

## 프로젝트 문서

- 팀 노션: [AutoTA](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link) (기획서, 기능 명세서, API 명세서, 화면별 담당자와 진행 현황)
- 디자인: [AutoTA Figma Make](https://www.figma.com/make/OlfzBPA1OLLboDl6eOhRVD/AutoTA-Design)
- GitHub 조직: [pproject-AutoTA](https://github.com/pproject-AutoTA)

## 기술 스택

| 구분      | 사용                                                         |
| --------- | ------------------------------------------------------------ |
| 빌드      | Vite 5                                                       |
| UI        | React 18 + TypeScript 5                                      |
| 라우팅    | react-router-dom 6                                           |
| 스타일    | Tailwind CSS 4 (`@tailwindcss/vite`, 디자인 토큰은 `@theme`) |
| 아이콘    | lucide-react (stroke 1.75)                                   |
| 폰트      | Noto Sans KR (400 / 500 / 700), JetBrains Mono               |
| 서버 통신 | 브라우저 `fetch` (별도 라이브러리 없음)                      |

## 시작하기

```bash
git clone https://github.com/pproject-AutoTA/FE.git
cd FE
npm install
cp .env.example .env    # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

실행 후 `http://localhost:5173/login` 에서 시작합니다. 아래 표의 주소로 화면을 확인할 수 있고, 없는 주소는 로그인 화면으로 이동합니다.

```bash
npm run build   # 배포용 빌드 (타입 검사 포함)
```

### 서버 주소 설정

서버 주소는 `.env`의 `VITE_API_BASE_URL`에 적습니다. `.env.example`에 기본값(`http://localhost:8080`)이 들어 있습니다.

```
VITE_API_BASE_URL=http://localhost:8080
```

- 모든 요청은 이 주소의 `/api/v1` 아래로 보냅니다.
- `.env`는 커밋하지 않습니다. (`.gitignore`에 등록되어 있고, 값 없이 `.env.example`만 올립니다.) 값을 바꾼 뒤에는 `npm run dev`를 다시 실행합니다.
- 서버가 `http://localhost:5173`(개발 서버 주소)을 CORS로 허용해야 합니다.
- 테스트 계정, 참여 코드 같은 값은 코드나 문서에 적지 않고 BE 담당에게 따로 받습니다.

### 화면 주소

로그인이 필요한 화면은 로그인하지 않으면 로그인 화면으로 이동하고, 다른 역할의 화면 주소로 들어가면 본인 역할의 첫 화면으로 이동합니다.

| 주소                             | 화면                                                |
| -------------------------------- | --------------------------------------------------- |
| `/login`                         | 학생·교수 로그인                                    |
| `/admin/login`                   | 시스템 관리자 로그인                                |
| `/forgot-password`               | 비밀번호 찾기 (서버 API 없음)                       |
| `/contact-admin`                 | 관리자에게 문의 (서버 API 없음)                     |
| `/student`                       | 학생 홈                                             |
| `/student/join`                  | 수업 참여                                           |
| `/student/problems`              | 문제 목록                                           |
| `/student/submit`                | 코드 제출 (`?problem=문제ID`로 문제 선택)           |
| `/student/results`               | 제출 및 채점 결과 목록                              |
| `/student/results/:submissionId` | 채점 결과 상세                                      |
| `/student/notices`               | 전체 공지 (임시 데이터, `?notice=번호`로 공지 선택) |
| `/student/guide`                 | 학생 이용 가이드 (사이드바 도움말 카드에서 이동)    |
| `/professor`, `/admin`           | 교수·시스템 관리자 화면 (준비 중, 임시 화면)        |
| `/components`                    | 컴포넌트 갤러리                                     |
| `/showcase`                      | 서비스 화면 예시 (정식 화면으로 교체 예정)          |

## 폴더 구조

```
src/
├─ main.tsx                  # 진입점, 라우터, ToastProvider
├─ Showcase.tsx              # 서비스 화면 예시
├─ features.ts               # 서버가 아직 주지 않는 기능의 화면 표시 여부 (점수, 교수 평가, 공지)
├─ styles/
│  └─ tailwind.css           # Tailwind 불러오기 + @theme (색, 글꼴, 둥글기, 그림자, 애니메이션)
├─ api/                      # 서버 연동
│  ├─ client.ts              # 공통 요청 함수(request), 토큰 자동 첨부, 오류 문구(errorMessage)
│  ├─ types.ts               # 공통 응답 객체와 API 응답 타입
│  ├─ useLoad.ts             # 화면이 열릴 때 데이터를 불러오는 훅 (데이터·에러·로딩)
│  └─ auth / courses / enrollments / problems / submissions.ts   # 기능별 호출 함수
├─ auth/                     # 로그인 상태
│  ├─ storage.ts             # 토큰·사용자 저장, 삭제(로그아웃)
│  ├─ RequireAuth.tsx        # 로그인·역할 검사 후 화면 접근 제어
│  └─ home.ts                # 역할별 첫 화면 주소
├─ pages/
│  ├─ ComponentGallery.tsx   # 컴포넌트 갤러리
│  ├─ auth/                  # 로그인 계열: Login, AdminLogin, ForgotPassword, ContactAdmin
│  └─ student/               # 학생 화면
│     ├─ StudentLayout.tsx   # 학생 공통 틀 (사이드바, 상단바, 알림 패널, 로그아웃)
│     ├─ StudentHome / StudentJoin / StudentProblems / StudentSubmit
│     ├─ StudentResults / StudentResultDetail / StudentNotices / StudentGuide
│     ├─ courseData.ts       # 내 수업 + 과제·문제 목록을 화면용 목록으로 합침
│     └─ format.ts           # 서버 값(상태, 판정, 시각)을 화면 표시용으로 바꾸는 함수
└─ components/
   ├─ layout/                # 화면 뼈대: AppShell, AuthLayout, Sidebar, Topbar, PageHeader ...
   ├─ ui/                    # 범용 UI: Button, FormField, Select, Card, DataTable, Pagination, Toast ...
   └─ domain/                # 채점 서비스 전용: CodeEditor, ScoreDisplay, VerdictBadge, FlagCard ...
```

한 파일에 컴포넌트 하나를 두고, 각 폴더의 `index.ts`가 `export * from "./X"` 로 다시 내보냅니다. 따라서 어디서든 아래처럼 불러올 수 있습니다.

```tsx
import { Button, Card, ScoreDisplay } from "../components";
```

화면 폴더(`pages/auth`, `pages/student`, ...)도 `index.ts`로 화면을 다시 내보내고, 라우트는 `main.tsx`에 등록합니다. 학생 화면은 `/student` 아래에 `StudentLayout`을 두고 나머지 화면을 하위 라우트로 연결했습니다.

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

토스트는 연한 색 배경에 같은 색 테두리와 글자, 선 아이콘 모양입니다. 성공은 초록, 안내는 파랑, 오류는 빨강입니다. 알림 패널은 알림 한 건을 눌렀을 때의 동작(`onItemClick`)을 연결할 수 있고, 알림이 없으면 "새 알림이 없어요."를 보여 줍니다.

### Navigation & Layout

사이드바(로고, 역할 카드, 메뉴, 도움말 카드 `SidebarHelpCard`, 로그아웃), 상단바(`Topbar`, 검색창과 프로필), 페이지 헤더(`PageHeader`), 탭(pill / line), 스테퍼, 번호 목록(`NumberedSteps`).

`/components` 화면에는 없지만 같은 폴더에 있는 컴포넌트도 있습니다.

- `AuthLayout`: 로그인 계열 화면의 공통 틀. `/login` 등에서 확인합니다.
- `Pagination`: 페이지 이동. `/student/notices`에서 확인합니다.

### Data Display

카드(기본, 강조), 통계 카드(`StatCard`, 파랑·초록·보라·주황), 배지(톤별, 큰 크기), 판정 배지(AC / WA / TLE / MLE / RE / SKIPPED / FLAG, 기본형과 목록 왼쪽 칩), 제출 상태 배지(미제출 / 대기 / 채점 중 / 채점 완료 / 채점 실패), 점수 표시(`100 / 100 공개`, `공개 전`, `—`), 진행률 링, 번호 칩(`IndexChip`), 목록 행(`ListRow`).

데이터 테이블은 기본(행 클릭 가능), 로딩, 빈 상태, 오류 네 가지 상태를 지원합니다. 아이콘은 lucide 24px, stroke 1.75로 통일했습니다.

### Admin & Professor

관리자 화면의 시스템 운영 현황(통계 카드, 실시간 갱신 배지, 큐 적재량 막대 차트)과 교수 화면의 사이드바(숫자 배지), 수업 관리 표(선택된 행)를 맞춰 두었습니다.

### Domain (채점 서비스 전용)

코드 에디터(macOS 창 모양, FLAG 줄 강조, 하단 바 `footer`), 읽기 전용 코드 블록, FLAG 카드, 허용 범위 카드, 예제 입출력, 메타 통계(시간·메모리 제한, 배점), 인라인 코드, 태그 칩, 테스트케이스 그룹 카드, 점수 산출(`ScoreBreakdown`), 제출 이력, 수업 코드 박스.

## 학생 화면 동작

- **로그인과 접근 제어**: 로그인하면 서버가 준 역할로 첫 화면(학생 `/student`)으로 이동합니다. "로그인 상태 유지"를 체크하면 `localStorage`, 아니면 `sessionStorage`에 토큰과 사용자 정보를 저장합니다. 사이드바의 로그아웃은 서버 API가 없어서 저장된 값을 지우고 `/login`으로 이동합니다. 토큰이 만료되면(`AUTH-002` 등) 저장값을 지우고 로그인 화면으로 이동합니다.
- **사이드바 하이라이트**: 현재 주소와 가장 길게 일치하는 메뉴를 강조합니다. 홈은 `/student`일 때만 강조하고, 공지·이용 가이드 화면에서는 메뉴를 강조하지 않습니다.
- **수업 참여**: 참여 코드를 입력하면 수업에 참여합니다. 잘못된 코드나 이미 참여한 수업은 입력창 아래에 안내합니다.
- **문제 조회·제출**: `?problem=문제ID`로 문제 설명, 공개 테스트케이스, 제출 이력을 보여 주고, 마감 후이거나 재제출이 막힌 문제는 제출 버튼을 비활성화합니다. 임시 저장은 서버 API가 없어서 브라우저에 저장합니다.
- **채점 결과**: 대기·채점 중이면 2초마다 다시 조회하고 끝나면 멈춥니다. 연결이 끊기면 4초마다 다시 시도하고, 1분이 지나도 채점 중이면 지연 안내를 보여 줍니다. 마감 후에는 비공개 케이스도 "입출력 보기"로 펼칠 수 있습니다.
- **알림 → 공지 이동**: 상단바 알림을 누르면 읽음 처리 후 알림 패널이 닫히고 `/student/notices?notice=번호`로 이동해 해당 공지가 선택됩니다. (공지·알림 API가 없어서 현재는 숨김 상태입니다. 아래 "서버 연동 현황" 참고)
- **공지 목록**: 한 페이지에 4개씩 보여주며 `Pagination`으로 이동합니다. 주소의 `?notice=` 값이 다른 페이지의 공지를 가리키면 그 공지가 있는 페이지로 자동 이동합니다.
- **이용 가이드**: 사이드바 도움말 카드에서 `/student/guide`로 이동합니다. 관리자 문의는 `/contact-admin`으로 연결되고 돌아올 위치를 함께 넘깁니다.

## 서비스 규칙을 코드에 넣은 부분

- **점수 숨김**: `ScoreDisplay`가 점수 노출을 한곳에서 처리합니다. 교수가 공개하기 전(`released=false`)에는 점수가 전달되어도 숫자를 그리지 않고 "공개 전"으로 표시합니다. 미제출이면 "—"로 표시합니다. Must 범위에서는 서버가 점수를 주지 않아서 학생 화면의 점수 칸(열, 탭)은 `features.ts`로 숨겨 둡니다.
- **비공개 테스트케이스**: 마감 전에는 비공개 케이스를 통과 개수로만 알려 주고 입력·정답은 그리지 않습니다. 마감 후에는 서버가 비공개 케이스의 입출력까지 내려 주므로 "입출력 보기"로 펼칠 수 있습니다. 공개 케이스는 항상 입력·기대 출력·실제 출력을 보여 줍니다.
- **마감 판정**: 화면의 마감 표시는 안내용이고, 실제 마감 판정은 서버가 합니다. 서버 시각은 Asia/Seoul 기준에 오프셋이 없어서 `format.ts`의 `parseKst`로 읽습니다.
- **FLAG**: 허용되지 않은 요소를 사용한 경우의 표시입니다. 주황색으로 보여주며, 점수는 자동으로 깎지 않습니다. 서버는 FLAG 여부만 내려줍니다.

## 서버 연동 현황

기준은 팀 노션의 API 명세서(v1.8)와 BE 담당 답변입니다.

| 기능           | API       | 연결된 화면                       | 상태                     |
| -------------- | --------- | --------------------------------- | ------------------------ |
| 로그인         | AUTH-01   | `/login`, `/admin/login`          | 연동 완료 (서버 확인 전) |
| 수업 참여      | COURSE-02 | `/student/join`                   | 연동 완료 (서버 확인 전) |
| 내 수업 목록   | COURSE-03 | 학생 홈, 문제 목록, 결과 목록     | 연동 완료 (서버 확인 전) |
| 과제·문제 목록 | PROB-03   | 학생 홈, 문제 목록, 결과 목록     | 연동 완료 (서버 확인 전) |
| 문제 조회      | PROB-04   | `/student/submit`                 | 연동 완료 (서버 확인 전) |
| 내 제출 목록   | RES-01    | `/student/submit`, 채점 결과 상세 | 연동 완료 (서버 확인 전) |
| 코드 제출      | SUB-01    | `/student/submit`                 | 연동 완료 (서버 확인 전) |
| 제출 결과      | RES-02    | `/student/results/:submissionId`  | 연동 완료 (서버 확인 전) |

- 학생 홈·문제 목록·결과 목록은 내 제출 전체 목록이나 홈 요약 API가 따로 없어서, COURSE-03으로 내 수업을 받고 수업마다 PROB-03을 불러 `courseData.ts`에서 합칩니다.
- **서버에 없는 기능은 숨깁니다.** 점수, 교수 평가, 공지·알림은 서버 API가 없어서 `src/features.ts`의 `FEATURES`(`score`, `review`, `notices`)로 화면에서 뺐습니다. API가 생기면 값을 `true`로 바꾸면 이전 화면이 다시 나타납니다.
- 공지(`/student/notices`)와 이용 가이드처럼 서버가 필요 없거나 API가 없는 화면은 임시 데이터나 고정 문구로 동작합니다. 임시 데이터는 해당 화면 파일 위쪽에 있고, API로 바꿀 자리에는 `// TODO: API` 주석을 남겨 두었습니다.
- `mockProblems.ts`, `mockSubmissions.ts`는 연동 뒤 학생 화면에서 쓰지 않습니다. 정리는 따로 합니다.
- 교수·관리자 화면과 교수·관리자 API 연동은 은아님이 별도 이슈와 PR에서 진행합니다.

### API 사용 규칙

- 서버 호출은 `src/api`의 함수로만 하고, 화면에서 `fetch`를 직접 쓰지 않습니다. 공통 `request`가 토큰 첨부, 응답 검사(`success: false`이면 `ApiError`), 오류 처리를 맡습니다.
- 서버는 값이 없는 필드를 생략하지 않고 `null`로 내려주므로, 타입에는 `T | null`로 적고 화면에서 `null`을 처리합니다.
- 화면에 보여 줄 오류 문구는 `errorMessage`로 만듭니다. 연결 실패와 서버 오류(`COMMON-500`)는 "잠시 후 다시 시도해 주세요" 안내로, 나머지는 서버가 준 메시지를 그대로 보여 줍니다.
- 목록을 불러오는 화면은 `useLoad`로 데이터·에러·로딩을 받고, 불러오는 중에는 스켈레톤, 실패하면 "다시 시도" 안내를 보여 줍니다.

## 브랜치와 작업 방식

- 본인 포크(`origin`)의 기본 브랜치(`이름/main`)에서 기능별 `이름/작업이름` 브랜치를 만들어 작업합니다. 원본 레포는 `upstream`으로 등록해 둡니다. 예) `김채은/auth-api`, `김채은/student-api`
- PR은 원본 레포의 `이름/main` ← 포크의 `이름/작업이름` 으로 올리고, 본문에 `관련 이슈: #번호`와 화면 캡처를 넣습니다. 화면 캡처는 레포에 파일로 두지 않고 PR 본문에만 첨부합니다.
- 커밋 메시지는 `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:` 접두사를 씁니다.
- 공통 컴포넌트(`src/components`) 변경은 화면 PR에 섞지 않고 별도 PR로 올립니다.
- 토큰, 비밀번호, 서버 주소 같은 값은 코드·PR·이슈에 올리지 않습니다. `.env`는 커밋하지 않습니다.
- README 수정은 PR 없이 `main`에서 직접 합니다.
- 화면별 담당자와 진행 현황은 [팀 노션](https://app.notion.com/p/AutoTA-3d8606cfd1b080d19e55e8d4c212b502?source=copy_link) 문서에서 관리합니다.

## 개발 메모

- CSS import 오류가 나면 `src/vite-env.d.ts` 에 `/// <reference types="vite/client" />` 가 있는지 확인하세요.
- 폴더 이름은 `components` (복수형)입니다.
- 새 컴포넌트를 만들면 해당 폴더의 `index.ts`에 한 줄 추가하고, `/components` 화면에도 예시를 넣어 주세요.
- 색이나 둥글기를 바꾸고 싶다면 컴포넌트에 값을 직접 쓰지 말고 `tailwind.css`의 `@theme`에서 바꿉니다.
- 같은 화면의 레이아웃 높이가 페이지마다 흔들리지 않도록, 목록 화면은 한 페이지 항목 수를 고정하고 최소 높이를 지정해 두었습니다.
- 화면이 하얗게 나오면 브라우저 콘솔에서 `does not provide an export named` 오류를 먼저 확인하세요. 파일이 저장되지 않았거나 `index.ts`에 export가 빠진 경우가 많습니다.
- API 호출이 실패하면 개발자 도구의 Network 탭에서 요청 주소가 `.env`의 서버 주소로 나가는지, `Authorization: Bearer` 헤더가 붙는지 확인하세요. 서버 주소를 바꾼 뒤에는 `npm run dev`를 다시 실행해야 합니다.
