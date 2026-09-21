import "server-only";
import { db } from "@/db";
import { topics, aiChatLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { seededRandom } from "@/lib/utils";
import { QUICK_ACTION_LABELS, type QuickAction } from "@/lib/aiQuickActions";
export type { QuickAction };
export { QUICK_ACTION_LABELS };

// ---------------------------------------------------------------------------
// MUCodeX AI Tutor & AI Debugger — MOCK SERVICE
// ---------------------------------------------------------------------------
// This module assembles realistic, structured tutoring responses from the
// syllabus content already stored in the database (per-topic explanations,
// examples, code, common mistakes) so answers stay grounded in the MU
// curriculum instead of sounding like a generic chatbot.
//
// TO CONNECT A REAL LLM LATER:
//   Swap the body of `getTutorResponse()` / `getDebugResponse()` with a call
//   to an LLM provider (e.g. OpenAI/Anthropic) using process.env.OPENAI_API_KEY,
//   keeping the same TutorResponse / DebugResponse shape so the UI is unaffected.
//   For OFFLINE / LOW-CONNECTIVITY MODE, this same mock layer can be shipped as
//   a bundled fallback ("MUCodeX Offline AI") when no network connection or
//   remote model is reachable.
// ---------------------------------------------------------------------------

export type TutorResponse = {
  heading: string;
  sections: { label: string; content: string }[];
  quickActions: QuickAction[];
  relatedTopicId?: number;
};

function findTopicByKeyword(allTopics: (typeof topics.$inferSelect)[], text: string) {
  const lower = text.toLowerCase();
  let best: (typeof topics.$inferSelect) | null = null;
  let bestScore = 0;
  for (const t of allTopics) {
    const words = t.title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    let score = 0;
    for (const w of words) {
      if (lower.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return bestScore > 0 ? best : null;
}

export async function getTutorResponse(
  message: string,
  contextTopicId: number | null,
  action: QuickAction | null,
): Promise<TutorResponse> {
  let topic = contextTopicId
    ? (await db.select().from(topics).where(eq(topics.id, contextTopicId)).limit(1))[0]
    : null;

  if (!topic) {
    const allTopics = await db.select().from(topics);
    topic = findTopicByKeyword(allTopics, message) ?? null;
  }

  if (!topic) {
    return {
      heading: "I need a bit more context",
      sections: [
        {
          label: "MUCodeX Tutor",
          content:
            "I couldn't match that to a specific MU topic yet. Try asking about a concept from your syllabus — e.g. \"Explain inheritance in Java\", \"What is a stack?\", or open a topic page and ask from there so I can tailor my answer to exactly what you're studying.",
        },
      ],
      quickActions: ["simple", "example", "practice"],
    };
  }

  const importantPoints = (topic.importantPoints as string[] | null) ?? [];
  const commonMistakes = (topic.commonMistakes as string[] | null) ?? [];
  const code = topic.codeExampleJava ?? topic.codeExamplePython ?? "";

  const chosenAction = action ?? "simple";

  const baseSections: Record<QuickAction, { label: string; content: string }[]> = {
    simple: [{ label: "Simple explanation", content: topic.easyExplanation ?? "" }],
    technical: [{ label: "Technical explanation", content: topic.technicalExplanation ?? "" }],
    example: [{ label: "Real-world example", content: topic.example ?? "" }],
    exam: [
      {
        label: "How MU exams usually frame this",
        content: `Expect this topic to appear as a 5–10 mark theory or coding question. Structure your answer as: (1) definition, (2) key characteristics/keywords, (3) a short code snippet or diagram, (4) one real-world example. Examiners specifically reward correctly used terminology like "${importantPoints[0] ?? topic.title}".`,
      },
      { label: "Key points to mention", content: importantPoints.join(" • ") },
    ],
    practice: [
      { label: "Practice question", content: topic.practiceQuestion ?? "Try re-implementing the example above with your own data." },
    ],
    mistake: [
      {
        label: "Common mistakes students make here",
        content: commonMistakes.length ? commonMistakes.join(" \n") : "No common mistakes recorded for this topic yet.",
      },
    ],
    summarize: [
      {
        label: "Summary",
        content: `${topic.title} — ${topic.easyExplanation?.slice(0, 180) ?? ""}${
          (topic.easyExplanation?.length ?? 0) > 180 ? "..." : ""
        }`,
      },
      { label: "Remember", content: importantPoints.slice(0, 3).join(" • ") },
    ],
    quiz: [
      {
        label: "Quick check",
        content: topic.practiceQuestion ?? "Head to the Quiz section for a full MCQ set on this topic.",
      },
    ],
  };

  const sections =
    action != null
      ? baseSections[chosenAction]
      : [
          { label: "Simple explanation", content: topic.easyExplanation ?? "" },
          { label: "Technical explanation", content: topic.technicalExplanation ?? "" },
          { label: "Example", content: topic.example ?? "" },
          ...(code ? [{ label: "Code", content: code }] : []),
          { label: "Key points", content: importantPoints.join(" • ") },
          {
            label: "Common mistake",
            content: commonMistakes[0] ?? "Review the topic page for detailed common mistakes.",
          },
          { label: "Practice question", content: topic.practiceQuestion ?? "" },
        ];

  return {
    heading: topic.title,
    sections: sections.filter((s) => s.content && s.content.trim().length > 0),
    quickActions: ["simple", "technical", "example", "exam", "practice", "mistake", "summarize", "quiz"],
    relatedTopicId: topic.id,
  };
}

export async function logChatMessage(
  userId: number,
  role: "user" | "assistant",
  content: string,
  contextTopicId: number | null,
) {
  await db.insert(aiChatLogs).values({ userId, role, content, contextTopicId });
}

export async function getChatHistory(userId: number, limit = 30) {
  const rows = await db
    .select()
    .from(aiChatLogs)
    .where(eq(aiChatLogs.userId, userId))
    .orderBy(desc(aiChatLogs.createdAt))
    .limit(limit);
  return rows.reverse();
}

// ---------------------------------------------------------------------------
// AI Code Debugger
// ---------------------------------------------------------------------------

export type DebugResponse = {
  state: "error_found" | "no_error" | "multiple_errors";
  errors: {
    line: number;
    error: string;
    explanation: string;
    why: string;
  }[];
  correctedCode: string;
  improvementSuggestion: string;
  relatedConcept: string;
  practiceRecommendation: string;
};

const DEBUG_RULES: {
  match: RegExp;
  language: "java" | "python" | "any";
  error: string;
  explanation: string;
  why: string;
  fix: (code: string) => string;
  concept: string;
}[] = [
  {
    match: /System\.out\.println\([^)]*$/m,
    language: "java",
    error: "Missing closing parenthesis",
    explanation: "A System.out.println(...) call was opened but never closed.",
    why: "Java requires every opening parenthesis to have a matching closing one before the statement ends with a semicolon.",
    fix: (code) => code.replace(/System\.out\.println\(([^)]*)$/m, "System.out.println($1);"),
    concept: "Java syntax & statements",
  },
  {
    match: /if\s*\([^)]*\)[^{;]*\n(?!\s*\{)/,
    language: "java",
    error: "Missing braces around if-block",
    explanation: "The if-condition is followed by more than one statement without enclosing braces.",
    why: "Without { }, Java only treats the very next line as part of the if — later lines silently execute unconditionally, causing hard-to-spot logic bugs.",
    fix: (code) => code,
    concept: "Control flow (if / else)",
  },
  {
    match: /=\s*=|[^=!<>]==[^=]/,
    language: "any",
    error: "Suspicious comparison operator usage",
    explanation: "Detected an '==' comparison — make sure this is intentional and not a typo for assignment '='.",
    why: "Using '==' to compare objects/Strings in Java compares references, not content — use .equals() for value comparison. In Python, '==' is correct for value comparison, but confusing it with '=' is a frequent typo.",
    fix: (code) => code,
    concept: "Comparison vs assignment operators",
  },
  {
    match: /for\s*\(.*;.*<=\s*\w+\.length.*;.*\)/,
    language: "java",
    error: "Off-by-one loop bound (<=  with .length)",
    explanation: "The loop condition uses '<= array.length', which will run one iteration too many.",
    why: "Valid array indices go from 0 to length - 1. Using '<=' with '.length' causes ArrayIndexOutOfBoundsException on the final iteration.",
    fix: (code) => code.replace(/<=\s*(\w+)\.length/g, "< $1.length"),
    concept: "Arrays & loop boundaries",
  },
  {
    match: /def\s+\w+\([^)]*\):\s*\n(?!\s+)/,
    language: "python",
    error: "Missing indentation after function definition",
    explanation: "The line after 'def function():' is not indented.",
    why: "Python uses indentation (not braces) to define a function's body — an unindented line after a colon causes an IndentationError.",
    fix: (code) => code,
    concept: "Python syntax & indentation",
  },
  {
    match: /print\s[^(]/,
    language: "python",
    error: "Python 2 style print statement",
    explanation: "Detected 'print' used without parentheses, which is Python 2 syntax.",
    why: "In Python 3, print is a function and requires parentheses: print(\"text\") instead of print \"text\".",
    fix: (code) => code.replace(/print\s+([^\n(]+)/g, 'print($1)'),
    concept: "Python 3 syntax",
  },
];

export function mockDebug(code: string, language: "java" | "python"): DebugResponse {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      state: "no_error",
      errors: [],
      correctedCode: code,
      improvementSuggestion: "Paste some code first, then click 'Debug with MUCodeX AI'.",
      relatedConcept: "—",
      practiceRecommendation: "Try debugging one of the Coding Practice starter templates.",
    };
  }

  const matches = DEBUG_RULES.filter(
    (rule) => (rule.language === "any" || rule.language === language) && rule.match.test(code),
  );

  if (matches.length === 0) {
    const rand = seededRandom(code);
    if (rand > 0.65) {
      return {
        state: "no_error",
        errors: [],
        correctedCode: code,
        improvementSuggestion:
          "No obvious errors detected. Consider adding comments and checking edge cases (empty input, zero, negative numbers) to make your solution more robust.",
        relatedConcept: "Code quality & edge cases",
        practiceRecommendation: "Try submitting this in Coding Practice to validate it against test cases.",
      };
    }
    return {
      state: "error_found",
      errors: [
        {
          line: Math.max(1, code.split("\n").length - 1),
          error: language === "java" ? "cannot find symbol" : "NameError: name is not defined",
          explanation: "A variable or method referenced here may not be declared/defined before use.",
          why: "This usually happens due to a typo in a variable name, or using a variable outside the scope it was declared in.",
        },
      ],
      correctedCode: code,
      improvementSuggestion:
        "Double-check variable names for typos and confirm every variable is declared before it's used.",
      relatedConcept: language === "java" ? "Variable scope in Java" : "Variable scope in Python",
      practiceRecommendation: "Revisit the 'Variables, Data Types & Operators' topic for a quick refresher.",
    };
  }

  const errors = matches.map((rule, idx) => ({
    line: Math.min(code.split("\n").length, idx + 2),
    error: rule.error,
    explanation: rule.explanation,
    why: rule.why,
  }));

  let corrected = code;
  for (const rule of matches) corrected = rule.fix(corrected);

  return {
    state: matches.length > 1 ? "multiple_errors" : "error_found",
    errors,
    correctedCode: corrected,
    improvementSuggestion:
      "After fixing the highlighted issues, re-run your code and check it against the provided test cases before submitting.",
    relatedConcept: matches[0].concept,
    practiceRecommendation: `Review the "${matches[0].concept}" topic and attempt a related practice problem to reinforce this.`,
  };
}
