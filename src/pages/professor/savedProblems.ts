export type TestCase = {
  id: number;
  input: string;
  expectedOutput: string;
  visibility: "public" | "private";
};

export type ProblemStatus = "공개" | "초안" | "공개 예약";

export type InspectionPolicy = {
  mode: "deny" | "allow";
  deniedTags: string[];
  allowedTags: string[];
  requiredTags: string[];
};

export type SavedProblem = {
  sampleId?: number;
  classId?: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit: string;
  memoryLimit: string;
  deadline: string;
  resubmission: boolean;
  trackLeave: boolean;
  status: ProblemStatus;
  publishAt?: string;
  testCases: TestCase[];
  inspectionPolicy?: InspectionPolicy;
};

const storageKey = "autota.professor.problems";

export function readSavedProblems(): SavedProblem[] {
  return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
}

export function saveProblem(problem: SavedProblem, existingIndex?: number) {
  const problems = readSavedProblems();
  if (existingIndex === undefined) {
    problems.push(problem);
  } else {
    if (!problems[existingIndex]) throw new Error("Problem not found");
    problems[existingIndex] = problem;
  }
  window.localStorage.setItem(storageKey, JSON.stringify(problems));
}
