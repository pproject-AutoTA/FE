import { request } from "../../api/client";
import type { FieldError } from "../../api/types";
import type { InspectionPolicy } from "./savedProblems";

export const PROBLEM_REGISTRATION_PATH = /^\/api\/v1\/professor\/assignments\/(\d+)\/problems$/;

export type RegisterProblemBody = {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  resubmitAllowed: boolean;
  testcases: { input: string; expectedOutput: string; isPublic: boolean }[];
};

type RegisteredProblem = {
  id: number;
  assignmentId: number;
  title: string;
  testcaseCount: number;
};

export function registerProfessorProblem(
  assignmentId: number,
  body: RegisterProblemBody,
  demoInspectionPolicy?: InspectionPolicy,
) {
  return request<RegisteredProblem>(`/professor/assignments/${assignmentId}/problems`, {
    method: "POST",
    body: JSON.stringify({ ...body, demoInspectionPolicy }),
  });
}

export function validateProblemRegistration(value: unknown): FieldError[] {
  const body = (value && typeof value === "object" ? value : {}) as Partial<RegisterProblemBody>;
  const errors: FieldError[] = [];
  const add = (field: string, rejectedValue: unknown, reason: string) =>
    errors.push({ field, rejectedValue: rejectedValue ?? null, reason });

  if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 100) {
    add("title", body.title, "문제 제목은 1~100자로 입력해주세요.");
  }
  for (const [field, label] of [
    ["description", "문제 설명"],
    ["inputFormat", "입력 형식"],
    ["outputFormat", "출력 형식"],
  ] as const) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      add(field, body[field], `${label}을 입력해주세요.`);
    }
  }
  for (const [field, label, min, max] of [
    ["timeLimitMs", "시간 제한(ms)", 100, 10000],
    ["memoryLimitMb", "메모리 제한(MB)", 32, 512],
  ] as const) {
    const limit = body[field];
    if (typeof limit !== "number" || !Number.isInteger(limit) || limit < min || limit > max) {
      add(field, limit, `${label}을 ${min}~${max} 범위의 정수로 입력해주세요.`);
    }
  }
  if (typeof body.resubmitAllowed !== "boolean") {
    add("resubmitAllowed", body.resubmitAllowed, "재제출 허용 여부를 선택해주세요.");
  }
  if (!Array.isArray(body.testcases) || body.testcases.length === 0) {
    add("testcases", body.testcases, "테스트케이스를 한 개 이상 추가해주세요.");
  } else {
    body.testcases.forEach((testcase, index) => {
      for (const [field, type] of [
        ["input", "string"],
        ["expectedOutput", "string"],
        ["isPublic", "boolean"],
      ] as const) {
        if (typeof testcase?.[field] !== type) {
          add(`testcases[${index}].${field}`, testcase?.[field], "테스트케이스의 필수 항목입니다.");
        }
      }
    });
  }
  return errors;
}
