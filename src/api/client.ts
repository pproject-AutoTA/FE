import type { ApiFailure, ApiSuccess, FieldError } from "./types";
import { clearAuth, getToken } from "../auth/storage";

const BASE = import.meta.env.VITE_API_BASE_URL;

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

// 로그인 상태를 풀어야 하는 코드 (AUTH-003은 로그인 실패라 제외)
const SESSION_EXPIRED = ["AUTH-001", "AUTH-002", "COMMON-401"];

export async function request<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth, headers, ...rest } = init;
  const token = skipAuth ? null : getToken();

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/v1${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError("NETWORK", "서버에 연결할 수 없습니다", 0);
  }

  const body = (await res.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!body || !body.success) {
    const f = body as ApiFailure | null;
    if (f && SESSION_EXPIRED.includes(f.code)) {
      clearAuth();
      window.location.assign(
        window.location.pathname.startsWith("/admin")
          ? "/admin/login"
          : "/login",
      );
    }
    throw new ApiError(
      f?.code ?? "UNKNOWN",
      f?.message ?? "알 수 없는 오류",
      res.status,
      f?.errors ?? null,
    );
  }
  return body.data;
}
