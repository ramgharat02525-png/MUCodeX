export type QuickAction =
  | "simple"
  | "technical"
  | "example"
  | "exam"
  | "practice"
  | "mistake"
  | "summarize"
  | "quiz";

export const QUICK_ACTION_LABELS: Record<QuickAction, string> = {
  simple: "Explain simply",
  technical: "Explain technically",
  example: "Give an example",
  exam: "Explain for exam",
  practice: "Give me a practice question",
  mistake: "Find my mistake",
  summarize: "Summarize",
  quiz: "Quiz me",
};
