import type { Role } from "../api/types";

export const HOME: Record<Role, string> = {
  STUDENT: "/student",
  PROFESSOR: "/professor",
  ADMIN: "/admin",
};
