import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  unique,
} from "drizzle-orm/pg-core";

// ---------- USERS & AUTH ----------

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarColor: text("avatar_color").default("#1E3A8A"),
  branch: text("branch"),
  semester: integer("semester"),
  programmingExperience: text("programming_experience"),
  preferredLanguage: text("preferred_language"),
  learningGoal: text("learning_goal"),
  onboarded: boolean("onboarded").default(false).notNull(),
  plan: text("plan").default("free").notNull(),
  xp: integer("xp").default(0).notNull(),
  streakDays: integer("streak_days").default(0).notNull(),
  lastActiveDate: date("last_active_date"),
  role: text("role").default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- MU SYLLABUS ----------

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  branch: text("branch").notNull(),
  semester: integer("semester").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("code-2"),
  colorTheme: text("color_theme").default("indigo"),
  comingSoon: boolean("coming_soon").default(false).notNull(),
  order: integer("order").default(0),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").default(0),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").default(0),
  estimatedMinutes: integer("estimated_minutes").default(15),
  objectives: jsonb("objectives").$type<string[]>().default([]),
  easyExplanation: text("easy_explanation"),
  technicalExplanation: text("technical_explanation"),
  example: text("example"),
  codeExampleJava: text("code_example_java"),
  codeExamplePython: text("code_example_python"),
  visualType: text("visual_type").default("none"),
  importantPoints: jsonb("important_points").$type<string[]>().default([]),
  commonMistakes: jsonb("common_mistakes").$type<string[]>().default([]),
  practiceQuestion: text("practice_question"),
});

export const topicProgress = pgTable(
  "topic_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    status: text("status").default("available").notNull(),
    progressPercent: integer("progress_percent").default(0).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.topicId)],
);

// ---------- CODING PRACTICE ----------

export const codingProblems = pgTable("coding_problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  language: text("language").default("both"),
  difficulty: text("difficulty").default("easy"),
  category: text("category").notNull(),
  relatedTopicId: integer("related_topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  statement: text("statement").notNull(),
  starterCodeJava: text("starter_code_java"),
  starterCodePython: text("starter_code_python"),
  testCases: jsonb("test_cases").$type<
    { input: string; expectedOutput: string; description: string }[]
  >().default([]),
  sampleSolutionJava: text("sample_solution_java"),
  sampleSolutionPython: text("sample_solution_python"),
  order: integer("order").default(0),
});

export const codingSubmissions = pgTable("coding_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  problemId: integer("problem_id")
    .notNull()
    .references(() => codingProblems.id, { onDelete: "cascade" }),
  language: text("language").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(),
  passedCount: integer("passed_count").default(0),
  totalCount: integer("total_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- QUIZZES ----------

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  unitId: integer("unit_id").references(() => units.id, {
    onDelete: "set null",
  }),
  subjectId: integer("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  difficulty: text("difficulty").default("mixed"),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation"),
  order: integer("order").default(0),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  accuracy: integer("accuracy").notNull(),
  answers: jsonb("answers").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- GAMIFICATION ----------

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").default("award"),
  xpReward: integer("xp_reward").default(50),
  category: text("category").default("general"),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: integer("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.achievementId)],
);

// ---------- NOTIFICATIONS / FEEDBACK / PYQ ----------

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackEntries = pgTable("feedback_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pyqs = pgTable("pyqs", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  unitId: integer("unit_id").references(() => units.id, {
    onDelete: "set null",
  }),
  year: integer("year").notNull(),
  question: text("question").notNull(),
  marks: integer("marks").default(5),
  type: text("type").default("theory"),
  difficulty: text("difficulty").default("medium"),
});

export const aiChatLogs = pgTable("ai_chat_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  contextTopicId: integer("context_topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
