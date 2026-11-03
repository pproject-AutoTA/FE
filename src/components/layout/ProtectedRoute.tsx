import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "./Sidebar";

export interface ProtectedRouteProps {
  /** 현재 로그인한 역할. 로그인 전이면 null */
  role: Role | null;
  allowedRoles: Role[];
  /** 접근 권한이 없을 때 보여줄 화면(기본: 로그인으로 이동) */
  forbidden?: ReactNode;
}
export function ProtectedRoute({ role, allowedRoles, forbidden }: ProtectedRouteProps) {
  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <>{forbidden ?? <Navigate to="/" replace />}</>;
  return <Outlet />;
}
