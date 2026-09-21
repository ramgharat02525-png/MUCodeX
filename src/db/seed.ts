import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, pool } from "./index";
import {
  subjects,
  units,
  topics,
  codingProblems,
  quizzes,
  quizQuestions,
  achievements,
  pyqs,
  users,
  topicProgress,
  codingSubmissions,
  quizAttempts,
  userAchievements,
  notifications,
} from "./schema";
import { subjectsSeed } from "./seedData";
import { codingProblemsSeed, quizzesSeed, achievementsSeed, pyqsSeed } from "./seedExtras";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Seeding MUCodeX reference data...");

  await db.execute(sql`TRUNCATE TABLE
    notifications, user_achievements, quiz_attempts, coding_submissions, ai_chat_logs,
    pyqs, quiz_questions, quizzes, coding_problems, topic_progress, topics, units, subjects,
    sessions, users
    RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE achievements RESTART IDENTITY CASCADE`);

  const topicIdByTitle = new Map<string, number>();
  const unitIdByTitle = new Map<string, number>();
  const subjectIdByName = new Map<string, number>();
  const quizIdByKey = new Map<string, number>();
  const problemIdBySlug = new Map<string, number>();
  const achievementIdByCode = new Map<string, number>();

  for (const [sIndex, subject] of subjectsSeed.entries()) {
    const [insertedSubject] = await db
      .insert(subjects)
      .values({
        branch: subject.branch,
        semester: subject.semester,
        code: subject.code,
        name: subject.name,
        description: subject.description,
        icon: subject.icon,
        colorTheme: subject.colorTheme,
        comingSoon: subject.comingSoon ?? false,
        order: sIndex,
      })
      .returning();
    subjectIdByName.set(subject.name, insertedSubject.id);

    for (const [uIndex, unit] of subject.units.entries()) {
      const [insertedUnit] = await db
        .insert(units)
        .values({
          subjectId: insertedSubject.id,
          title: unit.title,
          description: unit.description,
          order: uIndex,
        })
        .returning();
      unitIdByTitle.set(unit.title, insertedUnit.id);

      for (const [tIndex, topic] of unit.topics.entries()) {
        const [insertedTopic] = await db
          .insert(topics)
          .values({
            unitId: insertedUnit.id,
            title: topic.title,
            order: tIndex,
            estimatedMinutes: topic.estimatedMinutes,
            objectives: topic.objectives,
            easyExplanation: topic.easyExplanation,
            technicalExplanation: topic.technicalExplanation,
            example: topic.example,
            codeExampleJava: topic.codeExampleJava,
            codeExamplePython: topic.codeExamplePython,
            visualType: topic.visualType,
            importantPoints: topic.importantPoints,
            commonMistakes: topic.commonMistakes,
            practiceQuestion: topic.practiceQuestion,
          })
          .returning();
        topicIdByTitle.set(topic.title, insertedTopic.id);
      }
    }
  }
  console.log(`Seeded ${subjectsSeed.length} subjects.`);

  for (const [pIndex, problem] of codingProblemsSeed.entries()) {
    const [insertedProblem] = await db
      .insert(codingProblems)
      .values({
        title: problem.title,
        slug: problem.slug,
        language: problem.language,
        difficulty: problem.difficulty,
        category: problem.category,
        statement: problem.statement,
        starterCodeJava: problem.starterCodeJava,
        starterCodePython: problem.starterCodePython,
        testCases: problem.testCases,
        sampleSolutionJava: problem.sampleSolutionJava,
        sampleSolutionPython: problem.sampleSolutionPython,
        order: pIndex,
      })
      .returning();
    problemIdBySlug.set(problem.slug, insertedProblem.id);
  }
  console.log(`Seeded ${codingProblemsSeed.length} coding problems.`);

  for (const quiz of quizzesSeed) {
    let topicId: number | null = null;
    let unitId: number | null = null;
    let subjectId: number | null = null;
    if (quiz.scope === "topic") topicId = topicIdByTitle.get(quiz.linkTitle) ?? null;
    if (quiz.scope === "unit") unitId = unitIdByTitle.get(quiz.linkTitle) ?? null;
    if (quiz.scope === "subject") subjectId = subjectIdByName.get(quiz.linkTitle) ?? null;

    const [insertedQuiz] = await db
      .insert(quizzes)
      .values({
        topicId,
        unitId,
        subjectId,
        title: quiz.title,
        difficulty: quiz.difficulty,
      })
      .returning();
    quizIdByKey.set(quiz.key, insertedQuiz.id);

    for (const [qIndex, question] of quiz.questions.entries()) {
      await db.insert(quizQuestions).values({
        quizId: insertedQuiz.id,
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        order: qIndex,
      });
    }
  }
  console.log(`Seeded ${quizzesSeed.length} quizzes.`);

  for (const achievement of achievementsSeed) {
    const [insertedAchievement] = await db.insert(achievements).values(achievement).returning();
    achievementIdByCode.set(achievement.code, insertedAchievement.id);
  }
  console.log(`Seeded ${achievementsSeed.length} achievements.`);

  for (const pyq of pyqsSeed) {
    const subjectId = subjectIdByName.get(pyq.subjectName);
    if (!subjectId) continue;
    const unitId = pyq.unitTitle ? unitIdByTitle.get(pyq.unitTitle) ?? null : null;
    await db.insert(pyqs).values({
      subjectId,
      unitId,
      year: pyq.year,
      question: pyq.question,
      marks: pyq.marks,
      type: pyq.type,
      difficulty: pyq.difficulty,
    });
  }
  console.log(`Seeded ${pyqsSeed.length} previous year questions.`);

  // ---------------- Demo student account ----------------
  // A fully populated demo account so the product can be shown end-to-end
  // instantly. Fresh sign-ups start at zero and build real progress live.
  const demoPasswordHash = await bcrypt.hash("MUCodeX@123", 10);
  const [demoUser] = await db
    .insert(users)
    .values({
      name: "Aarav Patil",
      email: "aarav.patil@mucodex.app",
      passwordHash: demoPasswordHash,
      avatarColor: "#2b62f0",
      branch: "Computer Engineering",
      semester: 3,
      programmingExperience: "beginner",
      preferredLanguage: "java",
      learningGoal: "Pass university exams & improve coding",
      onboarded: true,
      plan: "premium",
      xp: 840,
      streakDays: 12,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      role: "student",
    })
    .returning();

  const progressPlan: { title: string; status: string; percent: number }[] = [
    { title: "What is Object-Oriented Programming?", status: "completed", percent: 100 },
    { title: "Java Program Structure & JVM", status: "completed", percent: 100 },
    { title: "Variables, Data Types & Operators", status: "completed", percent: 100 },
    { title: "Classes and Objects", status: "completed", percent: 100 },
    { title: "Constructors in Java", status: "completed", percent: 100 },
    { title: "Method Overloading", status: "in_progress", percent: 40 },
    { title: "Arrays in Java", status: "in_progress", percent: 30 },
    { title: "String Handling", status: "available", percent: 0 },
    { title: "Introduction to Data Structures", status: "completed", percent: 100 },
    { title: "Arrays as a Data Structure", status: "in_progress", percent: 50 },
    { title: "Python Syntax & Variables", status: "completed", percent: 100 },
    { title: "Loops in Python", status: "in_progress", percent: 70 },
  ];
  for (const p of progressPlan) {
    const topicId = topicIdByTitle.get(p.title);
    if (!topicId) continue;
    await db.insert(topicProgress).values({
      userId: demoUser.id,
      topicId,
      status: p.status,
      progressPercent: p.percent,
    });
  }

  const submissionPlan: { slug: string; status: string; passed: number; total: number; lang: string }[] = [
    { slug: "sum-of-array", status: "passed", passed: 3, total: 3, lang: "java" },
    { slug: "reverse-string", status: "passed", passed: 3, total: 3, lang: "java" },
    { slug: "palindrome-number", status: "passed", passed: 3, total: 3, lang: "python" },
    { slug: "factorial-recursion", status: "passed", passed: 3, total: 3, lang: "java" },
    { slug: "bubble-sort", status: "passed", passed: 3, total: 3, lang: "java" },
    { slug: "rectangle-class", status: "passed", passed: 2, total: 2, lang: "java" },
    { slug: "fibonacci-series", status: "passed", passed: 1, total: 1, lang: "python" },
    { slug: "binary-search", status: "failed", passed: 1, total: 3, lang: "java" },
    { slug: "balanced-parentheses", status: "failed", passed: 1, total: 3, lang: "java" },
  ];
  for (const s of submissionPlan) {
    const problemId = problemIdBySlug.get(s.slug);
    if (!problemId) continue;
    await db.insert(codingSubmissions).values({
      userId: demoUser.id,
      problemId,
      language: s.lang,
      code: "// submitted solution",
      status: s.status,
      passedCount: s.passed,
      totalCount: s.total,
    });
  }

  const quizAttemptPlan: { key: string; score: number; total: number }[] = [
    { key: "quiz-classes-objects", score: 4, total: 5 },
    { key: "quiz-inheritance", score: 3, total: 5 },
    { key: "quiz-arrays", score: 3, total: 4 },
    { key: "quiz-loops-python", score: 4, total: 4 },
    { key: "quiz-oopm-mock", score: 6, total: 8 },
  ];
  for (const q of quizAttemptPlan) {
    const quizId = quizIdByKey.get(q.key);
    if (!quizId) continue;
    await db.insert(quizAttempts).values({
      userId: demoUser.id,
      quizId,
      score: q.score,
      totalQuestions: q.total,
      accuracy: Math.round((q.score / q.total) * 100),
      answers: [],
    });
  }

  const earnedAchievementCodes = [
    "first-steps",
    "semester-starter",
    "code-warrior",
    "quiz-whiz",
    "streak-7",
    "century-xp",
    "debug-master",
  ];
  for (const code of earnedAchievementCodes) {
    const achievementId = achievementIdByCode.get(code);
    if (!achievementId) continue;
    await db.insert(userAchievements).values({ userId: demoUser.id, achievementId });
  }

  await db.insert(notifications).values([
    {
      userId: demoUser.id,
      title: "12-day streak! 🔥",
      message: "You're on fire — keep your MUCodeX streak alive by completing a lesson today.",
      type: "success",
    },
    {
      userId: demoUser.id,
      title: "Quiz result available",
      message: "You scored 75% in the Inheritance & Polymorphism Quiz. Review 'super keyword' for a stronger score.",
      type: "info",
    },
    {
      userId: demoUser.id,
      title: "AI Tutor suggestion",
      message: "Based on your recent activity, MUCodeX AI Tutor recommends revising Binary Search before your next mock test.",
      type: "ai",
    },
    {
      userId: demoUser.id,
      title: "New achievement unlocked",
      message: "You earned the 'Code Warrior' badge for solving 5+ coding problems.",
      type: "success",
    },
  ]);

  console.log(`Seeded demo account: ${demoUser.email} / MUCodeX@123`);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
