export type Role = "STUDENT" | "PROFESSOR" | "ADMIN";

export interface FieldError {
  field: string;
  rejectedValue: unknown;
  reason: string;
}

export interface ApiSuccess<T> {
  success: true;
  code: string;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  code: string;
  message: string;
  data: null;
  timestamp: string;
  path: string;
  errors: FieldError[] | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  studentNo: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}
