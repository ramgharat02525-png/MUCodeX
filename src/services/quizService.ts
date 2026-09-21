import "server-only";
import { db } from "@/db";
import { quizzes, quizQuestions, quizAttempts, topics, units, subjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllQuizzes() {
  const rows = await db
    .select({
      quiz: quizzes,
      topicTitle: topics.title,
      unitTitle: units.title,
      subjectName: subjects.name,
    })
    .from(quizzes)
    .leftJoin(topics, eq(quizzes.topicId, topics.id))
    .leftJoin(units, eq(quizzes.unitId, units.id))
    .leftJoin(subjects, eq(quizzes.subjectId, subjects.id));
  return rows;
}

export async function getQuizById(id: number) {
  const rows = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getQuizQuestions(quizId: number) {
  return db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(quizQuestions.order);
}

export async function submitQuizAttempt(
  userId: number,
  quizId: number,
  answers: number[],
) {
  const questions = await getQuizQuestions(quizId);
  let score = 0;
  const feedback = questions.map((q, idx) => {
    const chosen = answers[idx];
    const correct = chosen === q.correctIndex;
    if (correct) score += 1;
    return {
      question: q.question,
      options: q.options as string[],
      chosen,
      correctIndex: q.correctIndex,
      correct,
      explanation: q.explanation,
    };
  });
  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const [attempt] = await db
    .insert(quizAttempts)
    .values({ userId, quizId, score, totalQuestions, accuracy, answers })
    .returning();

  return { attempt, feedback, score, totalQuestions, accuracy };
}

export async function getUserQuizAttempts(userId: number) {
  return db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt));
}

export async function getLatestAttempt(userId: number, quizId: number) {
  const rows = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt));
  return rows.find((r) => r.quizId === quizId) ?? null;
}
