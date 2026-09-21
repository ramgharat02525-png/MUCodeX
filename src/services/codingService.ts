import "server-only";
import { db } from "@/db";
import { codingProblems, codingSubmissions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { seededRandom } from "@/lib/utils";
import { codingProblemsSeed } from "@/db/seedExtras";

export async function getAllProblems() {
  return db.select().from(codingProblems).orderBy(codingProblems.order);
}

export async function getProblemBySlug(slug: string) {
  const rows = await db.select().from(codingProblems).where(eq(codingProblems.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProblemById(id: number) {
  const rows = await db.select().from(codingProblems).where(eq(codingProblems.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUserSubmissionsForProblem(userId: number, problemId: number) {
  return db
    .select()
    .from(codingSubmissions)
    .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.problemId, problemId)))
    .orderBy(desc(codingSubmissions.createdAt));
}

export async function getSolvedProblemIds(userId: number) {
  const rows = await db
    .select()
    .from(codingSubmissions)
    .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.status, "passed")));
  return new Set(rows.map((r) => r.problemId));
}

// ---------------------------------------------------------------------------
// MOCK EXECUTION ENGINE
// ---------------------------------------------------------------------------
// This deterministically "judges" submitted code without executing it, so the
// MVP works without a sandboxed runtime. It inspects the code for required
// keywords/structure per problem and reports a believable, reproducible
// pass/fail result with per-test-case output and realistic error messages.
//
// TO CONNECT A REAL EXECUTION ENGINE LATER:
//   Replace `mockExecute()` below with a call to a sandboxed runner such as
//   Judge0 (https://judge0.com) or Piston (https://github.com/engineer-man/piston).
//   Keep the same input/output shape (`JudgeResult`) so the UI and API routes
//   above this service layer do not need to change.
// ---------------------------------------------------------------------------

export type JudgeTestResult = {
  description: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
};

export type JudgeResult = {
  status: "passed" | "failed" | "partial" | "compile_error";
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryKb: number;
  tests: JudgeTestResult[];
  compileError?: string;
  aiFeedback: string;
};

const JAVA_ERROR_BANK = [
  "error: ';' expected",
  "error: cannot find symbol",
  "error: incompatible types: possible lossy conversion from double to int",
  "error: reached end of file while parsing",
  "error: variable might not have been initialized",
];

const PYTHON_ERROR_BANK = [
  "IndentationError: expected an indented block",
  "NameError: name 'result' is not defined",
  "SyntaxError: invalid syntax",
  "TypeError: unsupported operand type(s)",
  "IndexError: list index out of range",
];

function hasBalancedBrackets(code: string) {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  for (const ch of code) {
    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

export function mockExecute(
  slug: string,
  language: "java" | "python",
  code: string,
): JudgeResult {
  const problemMeta = codingProblemsSeed.find((p) => p.slug === slug);
  const starter =
    language === "java" ? problemMeta?.starterCodeJava : problemMeta?.starterCodePython;
  const requiredKeywords =
    (language === "java" ? problemMeta?.requiredKeywordsJava : problemMeta?.requiredKeywordsPython) ??
    [];
  const testCases = problemMeta?.testCases ?? [];
  const trimmedCode = code.trim();
  const seed = `${slug}:${language}:${trimmedCode}`;
  const rand = seededRandom(seed);

  if (!trimmedCode || trimmedCode === (starter ?? "").trim()) {
    return {
      status: "failed",
      passedCount: 0,
      totalCount: testCases.length,
      runtimeMs: 0,
      memoryKb: 0,
      tests: testCases.map((t) => ({
        description: t.description,
        input: t.input,
        expectedOutput: t.expectedOutput,
        actualOutput: "(no output — starter code not modified)",
        passed: false,
      })),
      aiFeedback:
        "It looks like you haven't written your solution yet. Replace the '// write your logic here' section with your implementation, then run again.",
    };
  }

  if (language === "java" && !hasBalancedBrackets(trimmedCode)) {
    const err = JAVA_ERROR_BANK[Math.floor(rand * JAVA_ERROR_BANK.length)];
    return {
      status: "compile_error",
      passedCount: 0,
      totalCount: testCases.length,
      runtimeMs: 0,
      memoryKb: 0,
      tests: [],
      compileError: `Solution.java:${8 + Math.floor(rand * 6)}: ${err}`,
      aiFeedback:
        "Your code failed to compile. Check for mismatched braces/parentheses and make sure every statement ends with a semicolon.",
    };
  }

  if (language === "python") {
    const lines = trimmedCode.split("\n");
    const hasBadIndent = lines.some((l) => /:\s*$/.test(l)) && !/\n\s+\S/.test(trimmedCode) && lines.length < 3;
    if (hasBadIndent) {
      return {
        status: "compile_error",
        passedCount: 0,
        totalCount: testCases.length,
        runtimeMs: 0,
        memoryKb: 0,
        tests: [],
        compileError: PYTHON_ERROR_BANK[0],
        aiFeedback:
          "Python uses indentation to define code blocks. Make sure the lines after a ':' (like for/if/def) are indented consistently.",
      };
    }
  }

  const keywordMatches = requiredKeywords.filter((k) =>
    trimmedCode.toLowerCase().includes(k.toLowerCase()),
  ).length;
  const keywordRatio = requiredKeywords.length > 0 ? keywordMatches / requiredKeywords.length : 1;
  const lengthRatio = Math.min(
    1,
    trimmedCode.length / Math.max(60, (starter ?? "").length + 40),
  );
  const confidence = clamp01(keywordRatio * 0.75 + lengthRatio * 0.25);

  let passedCount = 0;
  const tests: JudgeTestResult[] = testCases.map((t, idx) => {
    const caseRand = seededRandom(`${seed}:${idx}`);
    const passed = confidence > 0.55 ? caseRand < confidence + 0.15 : caseRand < confidence - 0.1;
    if (passed) passedCount += 1;
    return {
      description: t.description,
      input: t.input,
      expectedOutput: t.expectedOutput,
      actualOutput: passed
        ? t.expectedOutput
        : language === "python"
          ? PYTHON_ERROR_BANK[Math.floor(caseRand * PYTHON_ERROR_BANK.length)]
          : "Output did not match expected result",
      passed,
    };
  });

  const totalCount = testCases.length;
  const status: JudgeResult["status"] =
    passedCount === totalCount ? "passed" : passedCount === 0 ? "failed" : "partial";

  let aiFeedback = "";
  if (status === "passed") {
    aiFeedback =
      "All test cases passed. Your solution correctly handles the given inputs — nice work! Try the next difficulty level to keep building momentum.";
  } else if (status === "partial") {
    aiFeedback = `You passed ${passedCount}/${totalCount} test cases. Check edge cases carefully — e.g. empty input, negative numbers, or off-by-one boundaries in loops.`;
  } else {
    aiFeedback = requiredKeywords.length
      ? `Your logic looks incomplete. This problem typically needs: ${requiredKeywords.join(", ")}. Review the topic explanation and try again.`
      : "None of the test cases passed yet. Re-check your logic against the problem statement and sample input/output.";
  }

  return {
    status,
    passedCount,
    totalCount,
    runtimeMs: Math.round(40 + rand * 120),
    memoryKb: Math.round(14000 + rand * 4000),
    tests,
    aiFeedback,
  };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export async function recordSubmission(
  userId: number,
  problemId: number,
  language: string,
  code: string,
  result: JudgeResult,
) {
  const [created] = await db
    .insert(codingSubmissions)
    .values({
      userId,
      problemId,
      language,
      code,
      status: result.status === "compile_error" ? "failed" : result.status,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
    })
    .returning();
  return created;
}
