/**
 * 서버(API 명세 v1.8, Must 범위)가 아직 주지 않는 기능의 화면 표시 여부.
 * 서버에 해당 API가 생기면 true로 바꾸면 화면이 다시 나타난다.
 */
export const FEATURES = {
  /** 점수·공개 점수 (S2·S3) */
  score: false,
  /** 교수 평가 상태 (S3) */
  review: false,
  /** 공지·알림 (API 없음) */
  notices: false,
} as const;
