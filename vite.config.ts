import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ADMIN_STATUS_PATH, JUDGE_FAILURES_PATH } from "./src/api/admin";
import type { ApiFailure, FieldError } from "./src/api/types";
import { DEMO_ADMIN_STATUS, DEMO_JUDGE_FAILURES } from "./src/mocks/admin";

export default defineConfig({
  server: { port: 5173, strictPort: true },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "demo-admin-api",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.method !== "GET" || !request.url) return next();
          const { pathname, searchParams } = new URL(request.url, "http://localhost");
          const statusPath = `/api/v1${ADMIN_STATUS_PATH}`;
          const failuresPath = `/api/v1${JUDGE_FAILURES_PATH}`;
          if (pathname !== statusPath && pathname !== failuresPath) return next();

          response.setHeader("Content-Type", "application/json; charset=utf-8");
          const success = (data: unknown) => response.end(JSON.stringify({
            success: true,
            code: "COMMON-200",
            message: "요청에 성공했습니다.",
            data,
          }));
          if (pathname === statusPath) return success(DEMO_ADMIN_STATUS);

          const inputPage = searchParams.get("page") ?? "1";
          const inputSize = searchParams.get("size") ?? "20";
          const page = Number(inputPage);
          const size = Number(inputSize);
          const errors: FieldError[] = [];
          if (!/^\d+$/.test(inputPage) || !Number.isSafeInteger(page) || page < 1) {
            errors.push({ field: "page", rejectedValue: inputPage, reason: "1 이상의 정수여야 합니다." });
          }
          if (!/^\d+$/.test(inputSize) || !Number.isInteger(size) || size < 1 || size > 100) {
            errors.push({ field: "size", rejectedValue: inputSize, reason: "1~100 사이의 정수여야 합니다." });
          }
          if (errors.length) {
            const body: ApiFailure = {
              success: false,
              code: "COMMON-400",
              message: "입력값이 올바르지 않습니다",
              data: null,
              timestamp: new Date().toISOString(),
              path: pathname,
              errors,
            };
            response.statusCode = 400;
            return response.end(JSON.stringify(body));
          }

          const offset = (page - 1) * size;
          return success({
            items: DEMO_JUDGE_FAILURES.slice(offset, offset + size),
            page,
            size,
            totalCount: DEMO_JUDGE_FAILURES.length,
          });
        });
      },
    },
  ],
});
