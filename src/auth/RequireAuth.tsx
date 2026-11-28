import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../api/types";
import { HOME } from "./home";
import { getToken, getUser } from "./storage";

/**
 * 로그인한 사용자만, 그리고 맞는 역할의 화면에만 들어갈 수 있게 한다.
 * - 로그인하지 않았으면 로그인 화면(관리자 화면은 관리자 로그인)으로 보낸다.
 * - 다른 역할의 화면이면 본인 역할의 첫 화면으로 보낸다.
 */
export function RequireAuth({ role }: { role: Role }) {
  const user = getUser();
  if (!getToken() || !user) {
    return (
      <Navigate to={role === "ADMIN" ? "/admin/login" : "/login"} replace />
    );
  }
  if (user.role !== role) return <Navigate to={HOME[user.role]} replace />;
  return <Outlet />;
}
