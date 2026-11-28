import { ApiError, request } from "./client";
import type { LoginData, LoginRequest } from "./types";

// 로그인은 인증 불필요라 토큰을 붙이지 않는다 (남아 있는 만료 토큰 때문에 거부되는 것 방지)
export const login = (body: LoginRequest) =>
  request<LoginData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
  });

// 로그인 화면 두 곳에서 같이 쓰는 오류 변환
export function describeLoginError(err: unknown): {
  fields: { email?: string; password?: string };
  form?: string;
} {
  if (err instanceof ApiError) {
    if (err.code === "COMMON-400" && err.errors) {
      const fields: { email?: string; password?: string } = {};
      for (const e of err.errors) {
        if (e.field === "email" || e.field === "password")
          fields[e.field] = e.reason;
      }
      return Object.keys(fields).length
        ? { fields }
        : { fields, form: err.message };
    }
    if (err.code === "AUTH-003") return { fields: {}, form: err.message };
    if (err.code === "NETWORK")
      return {
        fields: {},
        form: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요",
      };
  }
  return { fields: {}, form: "잠시 후 다시 시도해 주세요" };
}
