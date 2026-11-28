import { defineConfig } from "vite";
import { randomBytes } from "node:crypto";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  DEMO_COURSE_ASSIGNMENTS,
  DEMO_PROBLEM_DETAILS,
  MY_COURSES_RESPONSE,
} from "./src/mocks/professor";
import {
  COURSE_CREATION_ENDPOINT,
  COURSE_SEMESTER_PATTERN,
  MY_COURSES_ENDPOINT,
  type CreatedCourse,
} from "./src/pages/professor/professorCoursesApi";
import {
  COURSE_ASSIGNMENTS_PATH,
  ASSIGNMENT_CREATION_PATH,
  type CourseAssignment,
  type CreatedAssignment,
} from "./src/pages/professor/professorCourseAssignmentsApi";
import type { FieldError } from "./src/api/types";
import { PROBLEM_DETAILS_PATH } from "./src/pages/professor/professorProblemDetailsApi";
import type { InspectionPolicy } from "./src/pages/professor/savedProblems";
import {
  PROBLEM_REGISTRATION_PATH,
  validateProblemRegistration,
  type RegisterProblemBody,
} from "./src/pages/professor/professorProblemRegistrationApi";

export default defineConfig({
  server: { port: 5173, strictPort: true },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "demo-professor-api",
      configureServer(server) {
        let nextProblemId = Math.max(0, ...DEMO_PROBLEM_DETAILS.keys()) + 1;
        let nextCourseId = Math.max(0, ...MY_COURSES_RESPONSE.data.map(({ id }) => id)) + 1;
        const joinCodes = new Set(MY_COURSES_RESPONSE.data.map(({ joinCode }) => joinCode));
        let nextAssignmentId = Math.max(
          0,
          ...Array.from(DEMO_COURSE_ASSIGNMENTS.values()).flatMap(({ data }) =>
            data.map(({ id }) => id),
          ),
        ) + 1000;
        server.middlewares.use(async (request, response, next) => {
          const path = request.url?.split("?", 1)[0] ?? "";
          const match = PROBLEM_REGISTRATION_PATH.exec(path);
          const createMatch = ASSIGNMENT_CREATION_PATH.exec(path);
          const creatingCourse = path === COURSE_CREATION_ENDPOINT;
          if (request.method !== "POST" || (!match && !createMatch && !creatingCourse)) {
            return next();
          }

          let value: unknown;
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of request) chunks.push(chunk);
            value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          } catch {
            value = null;
          }
          if (response.destroyed) return;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          function fail(status: number, code: string, message: string, errors: FieldError[] | null = null) {
            response.statusCode = status;
            response.end(JSON.stringify({
              success: false, code, message, data: null,
              timestamp: new Date().toISOString(), path, errors,
            }));
          }

          if (creatingCourse) {
            const form = value as { name?: unknown; semester?: unknown } | null;
            const name = typeof form?.name === "string" ? form.name.trim() : "";
            const semester = typeof form?.semester === "string" ? form.semester : "";
            const errors: FieldError[] = [];
            if (name.length < 1 || name.length > 50) {
              errors.push({
                field: "name",
                rejectedValue: form?.name ?? null,
                reason: "수업명은 1~50자로 입력해주세요.",
              });
            }
            if (!COURSE_SEMESTER_PATTERN.test(semester)) {
              errors.push({
                field: "semester",
                rejectedValue: form?.semester ?? null,
                reason: "학기를 YYYY-N 형식으로 입력해주세요.",
              });
            }
            if (errors.length) return fail(400, "COMMON-400", "입력값이 올바르지 않습니다", errors);

            let joinCode: string;
            do {
              const suffix = randomBytes(3).toString("hex").toUpperCase();
              joinCode = `CL-${suffix.slice(0, 4)}-${suffix.slice(4)}`;
            } while (joinCodes.has(joinCode));
            joinCodes.add(joinCode);

            const data: CreatedCourse = {
              id: nextCourseId++,
              name,
              semester,
              joinCode,
              studentCount: 0,
              createdAt: new Date().toISOString(),
            };
            MY_COURSES_RESPONSE.data.push({
              id: data.id,
              name,
              semester,
              joinCode,
              studentCount: 0,
              professorName: "박서연",
              assignmentCount: 0,
            });
            DEMO_COURSE_ASSIGNMENTS.set(data.id, {
              success: true,
              code: "COMMON-200",
              message: "요청에 성공했습니다.",
              data: [],
            });
            response.statusCode = 201;
            response.end(JSON.stringify({
              success: true, code: "COMMON-201", message: "요청에 성공했습니다.", data,
            }));
            return;
          }

          if (createMatch) {
            const courseId = Number(createMatch[1]);
            const list = DEMO_COURSE_ASSIGNMENTS.get(courseId);
            const course = MY_COURSES_RESPONSE.data.find((item) => item.id === courseId);
            if (!list || !course) return fail(404, "COURSE-001", "수업을 찾을 수 없습니다.");
            const form = value as { title?: unknown; dueAt?: unknown } | null;
            const title = typeof form?.title === "string" ? form.title.trim() : "";
            const dueAt = typeof form?.dueAt === "string" ? Date.parse(form.dueAt) : NaN;
            const errors: FieldError[] = [];
            if (!title) {
              errors.push({
                field: "title",
                rejectedValue: form?.title ?? null,
                reason: "과제명을 입력해주세요.",
              });
            }
            if (!(dueAt > Date.now())) {
              errors.push({
                field: "dueAt",
                rejectedValue: form?.dueAt ?? null,
                reason: "마감 시각은 현재 시각 이후여야 합니다.",
              });
            }
            if (errors.length) return fail(400, "COMMON-400", "입력값이 올바르지 않습니다", errors);

            const data: CreatedAssignment = {
              id: nextAssignmentId++,
              courseId,
              title,
              dueAt: new Date(dueAt).toISOString(),
              problemCount: 0,
            };
            const assignment: CourseAssignment = {
              id: data.id,
              title: data.title,
              dueAt: data.dueAt,
              studentCount: course.studentCount,
              problems: [],
            };
            list.data.push(assignment);
            course.assignmentCount = list.data.length;
            response.statusCode = 201;
            response.end(JSON.stringify({
              success: true, code: "COMMON-201", message: "요청에 성공했습니다.", data,
            }));
            return;
          }

          const assignmentId = Number(match?.[1]);
          const course = [...DEMO_COURSE_ASSIGNMENTS].find(([, list]) =>
            list.data.some((assignment) => assignment.id === assignmentId),
          );
          const assignment = course?.[1].data.find((item) => item.id === assignmentId);
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          if (!course || !assignment) {
            response.statusCode = 404;
            response.end(JSON.stringify({
              success: false,
              code: "ASSIGNMENT-001",
              message: "과제를 찾을 수 없습니다",
              data: null,
              timestamp: new Date().toISOString(),
              path,
              errors: null,
            }));
            return;
          }

          const errors = validateProblemRegistration(value);
          if (errors.length) {
            response.statusCode = 400;
            response.end(JSON.stringify({
              success: false,
              code: "COMMON-400",
              message: "입력값이 올바르지 않습니다",
              data: null,
              timestamp: new Date().toISOString(),
              path,
              errors,
            }));
            return;
          }

          const body = value as RegisterProblemBody & { demoInspectionPolicy?: InspectionPolicy };
          const policy = body.demoInspectionPolicy;
          if (policy !== undefined && (
            !policy || !["deny", "allow"].includes(policy.mode) ||
            ![policy.deniedTags, policy.allowedTags, policy.requiredTags].every(
              (tags) => Array.isArray(tags) && tags.every((tag) => typeof tag === "string"),
            )
          )) {
            return fail(400, "COMMON-400", "검사 정책 형식을 확인해주세요.");
          }
          const id = nextProblemId++;
          const testcaseCount = body.testcases.length;
          DEMO_PROBLEM_DETAILS.set(id, {
            id,
            assignmentId,
            courseId: course[0],
            title: body.title,
            description: body.description,
            inputFormat: body.inputFormat,
            outputFormat: body.outputFormat,
            timeLimitMs: body.timeLimitMs,
            memoryLimitMb: body.memoryLimitMb,
            resubmitAllowed: body.resubmitAllowed,
            demoInspectionPolicy: policy,
            dueAt: assignment.dueAt,
            testcases: body.testcases.map(({ input, expectedOutput, isPublic }, index) => ({
              no: index + 1,
              input,
              expectedOutput,
              isPublic,
            })),
          });
          assignment.problems.push({
            id,
            title: body.title,
            resubmitAllowed: body.resubmitAllowed,
            testcaseCount,
            submittedStudentCount: 0,
            mySubmission: null,
          });
          response.statusCode = 201;
          response.end(JSON.stringify({
            success: true,
            code: "COMMON-201",
            message: "요청에 성공했습니다.",
            data: { id, assignmentId, title: body.title, testcaseCount },
          }));
        });
        server.middlewares.use((request, response, next) => {
          if (request.method !== "GET" || !request.url) return next();
          const path = request.url.split("?", 1)[0];
          const assignmentMatch = COURSE_ASSIGNMENTS_PATH.exec(path);
          const problemMatch = PROBLEM_DETAILS_PATH.exec(path);
          if (path !== MY_COURSES_ENDPOINT && !assignmentMatch && !problemMatch) return next();

          const problem = problemMatch && DEMO_PROBLEM_DETAILS.get(Number(problemMatch[1]));
          const body = problemMatch
            ? problem && {
                success: true,
                code: "COMMON-200",
                message: "요청에 성공했습니다.",
                data: problem,
              }
            : assignmentMatch
              ? DEMO_COURSE_ASSIGNMENTS.get(Number(assignmentMatch[1]))
              : MY_COURSES_RESPONSE;

          if (!body) response.statusCode = 404;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(
            JSON.stringify(
              body ?? {
                success: false,
                code: problemMatch ? "PROBLEM-001" : "COURSE-001",
                message: problemMatch ? "문제를 찾을 수 없습니다" : "수업을 찾을 수 없습니다",
                data: null,
                timestamp: new Date().toISOString(),
                path,
                errors: null,
              },
            ),
          );
        });
      },
    },
  ],
});
