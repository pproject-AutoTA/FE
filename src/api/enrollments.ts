import { request } from "./client";
import type { JoinData } from "./types";

/** 참여 코드로 수업에 들어간다 (COURSE-02). 대소문자는 서버가 구분하지 않는다 */
export const joinCourse = (joinCode: string) =>
  request<JoinData>("/enrollments", {
    method: "POST",
    body: JSON.stringify({ joinCode }),
  });
