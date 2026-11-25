import type { Tone } from "../../components";

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
  { id: 1, tag: "채점", tone: "info", date: "2025. 05. 22", author: "AutoTA 운영팀", title: "FLAG 검토 및 점수 확정 기준 안내", preview: "FLAG 제출의 검토와 점수 조정 방법이 정리되었습니다.", body: "FLAG는 허용 범위를 벗어난 요소를 알려주는 검토 정보이며 자동 점수에 영향을 주지 않습니다. 점수를 조정하려면 사유를 입력해야 하고, 검토하지 않은 제출은 점수 공개 시점에 자동 채점 점수로 일괄 확정됩니다.", showFlagRule: true },
  { id: 2, tag: "시스템", tone: "flag", date: "2025. 05. 21", author: "AutoTA 운영팀", title: "서버 정기 점검 일정 안내", preview: "5월 25일 새벽 서비스 점검이 예정되어 있습니다.", body: "5월 25일 02:00부터 약 30분간 서비스 정기 점검이 진행됩니다. 점검 중에는 채점과 점수 공개 예약 기능이 제한될 수 있으니, 마감이 가까운 과제는 미리 확인해 주세요." },
  { id: 3, tag: "과제", tone: "neutral", date: "2025. 05. 20", author: "AutoTA 운영팀", title: "자료구조 과제 마감 임박 안내", preview: "괄호 문자열 검사 과제가 2일 뒤 마감됩니다.", body: "괄호 문자열 검사 과제의 제출 마감이 2일 남았습니다. 현재 제출 43건 중 FLAG 3건이 검토를 기다리고 있으니 마감 전에 채점 검토 화면에서 확인해 주세요." },
  { id: 4, tag: "수업", tone: "neutral", date: "2025. 05. 18", author: "AutoTA 운영팀", title: "Python 실행 환경 업데이트", preview: "채점 환경이 Python 3.12로 업데이트되었습니다.", body: "채점 환경이 Python 3.12로 업데이트되었습니다. 이미 채점된 제출은 영향을 받지 않으며, 새로 제출되는 코드부터 변경된 환경에서 채점됩니다." },
  { id: 5, tag: "시스템", tone: "flag", date: "2025. 05. 17", author: "AutoTA 운영팀", title: "테스트케이스 등록 용량 제한 안내", preview: "테스트케이스 입력·출력은 파일당 최대 1MB입니다.", body: "테스트케이스의 입력값과 기대 출력값은 각각 최대 1MB까지 등록할 수 있습니다. 용량을 넘으면 저장이 거절되니 대용량 입력은 나누어 등록해 주세요." },
  { id: 6, tag: "채점", tone: "info", date: "2025. 05. 16", author: "AutoTA 운영팀", title: "부분 점수 계산 방식 안내", preview: "테스트케이스 그룹별 통과 비율로 점수가 계산됩니다.", body: "부분 점수는 테스트케이스 그룹별 통과 비율에 배점을 곱해 계산합니다. 비공개 테스트케이스의 입출력은 학생에게 공개되지 않고 그룹별 통과 개수만 보여집니다." },
  { id: 7, tag: "수업", tone: "neutral", date: "2025. 05. 15", author: "AutoTA 운영팀", title: "수업 참여 코드 재발급 안내", preview: "재발급하면 이전 코드로는 참여할 수 없습니다.", body: "수업 참여 코드를 재발급하면 이전 코드는 즉시 사용할 수 없게 됩니다. 이미 참여한 학생은 그대로 유지되며, 새 코드는 수업 관리 화면에서 확인할 수 있습니다." },
  { id: 8, tag: "과제", tone: "neutral", date: "2025. 05. 14", author: "AutoTA 운영팀", title: "점수 공개 예약 기능 안내", preview: "점수 공개를 원하는 날짜와 시간으로 예약할 수 있습니다.", body: "점수 공개 화면에서 지금 바로 공개하거나 날짜와 시간을 지정해 예약 공개를 선택할 수 있습니다. 공개 시점에 확정되지 않은 제출은 자동 채점 점수로 확정됩니다." },
  { id: 9, tag: "시스템", tone: "flag", date: "2025. 05. 12", author: "AutoTA 운영팀", title: "비밀번호 변경 권장 안내", preview: "보안을 위해 비밀번호를 주기적으로 변경해 주세요.", body: "계정 보안을 위해 비밀번호를 주기적으로 변경하는 것을 권장합니다. 비밀번호를 잊으셨다면 로그인 화면의 비밀번호 찾기를 이용해 주세요." },
];
