import type { ApiFailure, ApiSuccess, FieldError } from "./types";
import { getToken } from "../auth/storage";

export class ApiError extends Error {
  code: string;
  status: number;
  errors: FieldError[] | null;
  constructor(
    code: string,
    message: string,
    status: number,
    errors: FieldError[] | null = null,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export async function request<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth, headers, ...rest } = init;
  const base = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const token = skipAuth ? null : getToken();
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("Accept")) requestHeaders.set("Accept", "application/json");
  if (typeof rest.body === "string" && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${base}/api/v1${path}`, {
      ...rest,
      headers: requestHeaders,
    });
  } catch (error) {
    if (rest.signal?.aborted) throw error;
    throw new ApiError("NETWORK", "서버에 연결할 수 없습니다", 0);
  }

  const body = (await res.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!res.ok || body?.success !== true) {
    const f = body?.success === false ? body : null;
    throw new ApiError(
      f?.code ?? "UNKNOWN",
      f?.message ?? "알 수 없는 오류",
      res.status,
      f?.errors ?? null,
    );
  }
  return body.data;
}

/** 화면에 보여줄 오류 문구. 서버가 준 message를 그대로 쓰고, 연결이 안 되는 경우만 안내 문구를 쓴다 */
export function errorMessage(err: unknown, fallback = "잠시 후 다시 시도해 주세요."): string {
  if (err instanceof ApiError) {
    if (err.code === "NETWORK")
      return "서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.";
    if (err.code === "COMMON-500")
      return "서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
    return err.message;
  }
  return err instanceof Error ? err.message : fallback;
}
