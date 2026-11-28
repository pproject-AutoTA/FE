import type { AuthUser } from "../api/types";

const TOKEN_KEY = "autota.token";
const USER_KEY = "autota.user";

// persist=true면 localStorage(로그인 상태 유지), false면 sessionStorage(탭 닫으면 삭제)
export function saveAuth(token: string, user: AuthUser, persist: boolean) {
  clearAuth();
  const store = persist ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw =
    sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  for (const s of [sessionStorage, localStorage]) {
    s.removeItem(TOKEN_KEY);
    s.removeItem(USER_KEY);
  }
}
