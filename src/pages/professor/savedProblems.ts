export type TestCase = {
  id: number;
  input: string;
  expectedOutput: string;
  visibility: "public" | "private";
};

export type ProblemStatus = "PUBLISHED" | "DRAFT" | "SCHEDULED";

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
  const legacyStatuses = { 공개: "PUBLISHED", 초안: "DRAFT", "공개 예약": "SCHEDULED" } as const;
  type StoredProblem = Omit<SavedProblem, "status"> & {
    status: ProblemStatus | keyof typeof legacyStatuses;
  };
  const problems: StoredProblem[] = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
  return problems.map(({ status, ...problem }) => ({
    ...problem,
    status:
      status in legacyStatuses
        ? legacyStatuses[status as keyof typeof legacyStatuses]
        : (status as ProblemStatus),
  }));
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
