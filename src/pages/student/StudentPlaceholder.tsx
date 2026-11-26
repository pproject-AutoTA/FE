import { EmptyState, PageHeader } from "../../components";

/** 아직 만들지 않은 학생 화면 자리. 화면을 만들면 main.tsx의 라우트만 교체한다. */
export function StudentPlaceholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader eyebrow="STUDENT" title={title} />
      <EmptyState
        title="화면을 준비 중이에요"
        description="이 화면은 곧 추가될 예정이에요."
      />
    </>
  );
}
