import "server-only";
import { db } from "@/db";
import {
  users,
  subjects,
  units,
  topics,
  topicProgress,
  codingSubmissions,
  codingProblems,
  quizAttempts,
  quizzes,
} from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { getSubjectsForSemester } from "./syllabusService";

export async function getDashboardSnapshot(userId: number, branch: string, semester: number) {
  const subjectRows = await getSubjectsForSemester(branch, semester);

  const subjectSummaries = await Promise.all(
    subjectRows.map(async (subject) => {
      const subjectUnits = await db.select().from(units).where(eq(units.subjectId, subject.id));
      const unitIds = subjectUnits.map((u) => u.id);
      if (unitIds.length === 0) {
        return { subject, totalTopics: 0, completedTopics: 0, percent: 0 };
      }
      const subjectTopics = await db
        .select()
        .from(topics)
        .where(sql`${topics.unitId} IN (${sql.join(unitIds, sql`, `)})`);
      const topicIds = subjectTopics.map((t) => t.id);
      let completed = 0;
      let percentSum = 0;
      if (topicIds.length > 0) {
        const progressRows = await db
          .select()
          .from(topicProgress)
          .where(
            and(
              eq(topicProgress.userId, userId),
              sql`${topicProgress.topicId} IN (${sql.join(topicIds, sql`, `)})`,
            ),
          );
        const byTopic = new Map(progressRows.map((p) => [p.topicId, p]));
        for (const t of subjectTopics) {
          const p = byTopic.get(t.id);
          if (p?.status === "completed") completed += 1;
          percentSum += p?.progressPercent ?? 0;
        }
      }
      const percent = subjectTopics.length > 0 ? Math.round(percentSum / subjectTopics.length) : 0;
      return { subject, totalTopics: subjectTopics.length, completedTopics: completed, percent };
    }),
  );

  const overallPercent = subjectSummaries.length
    ? Math.round(
        subjectSummaries.reduce((sum, s) => sum + s.percent, 0) / subjectSummaries.length,
      )
    : 0;

  const solvedProblems = await db
    .select({ count: sql<number>`count(distinct ${codingSubmissions.problemId})` })
    .from(codingSubmissions)
    .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.status, "passed")));

  const totalProblems = await db.select({ count: sql<number>`count(*)` }).from(codingProblems);

  const quizAttemptRows = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt));

  const avgAccuracy = quizAttemptRows.length
    ? Math.round(quizAttemptRows.reduce((s, q) => s + q.accuracy, 0) / quizAttemptRows.length)
    : 0;

  const userRow = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return {
    subjectSummaries,
    overallPercent,
    solvedProblemsCount: Number(solvedProblems[0]?.count ?? 0),
    totalProblemsCount: Number(totalProblems[0]?.count ?? 0),
    quizAttemptsCount: quizAttemptRows.length,
    avgQuizAccuracy: avgAccuracy,
    recentQuizAttempts: quizAttemptRows.slice(0, 5),
    user: userRow[0],
  };
}

export async function findContinueLearningTopic(userId: number, branch: string, semester: number) {
  const subjectRows = await getSubjectsForSemester(branch, semester);
  for (const subject of subjectRows) {
    const subjectUnits = await db
      .select()
      .from(units)
      .where(eq(units.subjectId, subject.id))
      .orderBy(units.order);
    for (const unit of subjectUnits) {
      const unitTopics = await db
        .select()
        .from(topics)
        .where(eq(topics.unitId, unit.id))
        .orderBy(topics.order);
      for (const topic of unitTopics) {
        const progressRows = await db
          .select()
          .from(topicProgress)
          .where(and(eq(topicProgress.userId, userId), eq(topicProgress.topicId, topic.id)))
          .limit(1);
        const progress = progressRows[0];
        if (!progress || progress.status !== "completed") {
          return { subject, unit, topic, progress: progress ?? null };
        }
      }
    }
  }
  return null;
}

export async function getTodaysActivityCounts(userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedTopicsToday = await db
    .select()
    .from(topicProgress)
    .where(and(eq(topicProgress.userId, userId), eq(topicProgress.status, "completed")));
  const lessonsToday = completedTopicsToday.filter((t) => t.updatedAt >= today).length;

  const submissionsToday = await db
    .select()
    .from(codingSubmissions)
    .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.status, "passed")));
  const problemsToday = submissionsToday.filter((s) => s.createdAt >= today).length;

  const quizzesTodayRows = await db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));
  const quizzesToday = quizzesTodayRows.filter((q) => q.createdAt >= today).length;

  return { lessonsToday, problemsToday, quizzesToday };
}

export type ActivityItem = {
  type: "lesson" | "coding" | "quiz";
  title: string;
  detail: string;
  date: Date;
};

export async function getRecentActivity(userId: number, limit = 6): Promise<ActivityItem[]> {
  const completedTopics = await db
    .select({ progress: topicProgress, topicTitle: topics.title })
    .from(topicProgress)
    .innerJoin(topics, eq(topicProgress.topicId, topics.id))
    .where(and(eq(topicProgress.userId, userId), eq(topicProgress.status, "completed")))
    .orderBy(desc(topicProgress.updatedAt))
    .limit(limit);

  const submissions = await db
    .select({ submission: codingSubmissions, problemTitle: codingProblems.title })
    .from(codingSubmissions)
    .innerJoin(codingProblems, eq(codingSubmissions.problemId, codingProblems.id))
    .where(eq(codingSubmissions.userId, userId))
    .orderBy(desc(codingSubmissions.createdAt))
    .limit(limit);

  const attempts = await db
    .select({ attempt: quizAttempts, quizTitle: quizzes.title })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt))
    .limit(limit);

  const items: ActivityItem[] = [
    ...completedTopics.map((c) => ({
      type: "lesson" as const,
      title: `Completed: ${c.topicTitle}`,
      detail: "Lesson marked complete",
      date: c.progress.updatedAt,
    })),
    ...submissions.map((s) => ({
      type: "coding" as const,
      title: s.problemTitle,
      detail: `${s.submission.status === "passed" ? "Solved" : "Attempted"} · ${s.submission.passedCount}/${s.submission.totalCount} tests`,
      date: s.submission.createdAt,
    })),
    ...attempts.map((a) => ({
      type: "quiz" as const,
      title: a.quizTitle,
      detail: `Scored ${a.attempt.score}/${a.attempt.totalQuestions} (${a.attempt.accuracy}%)`,
      date: a.attempt.createdAt,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

export async function getWeakTopics(userId: number) {
  // Topics linked to quizzes where the student scored below 70% accuracy.
  const rows = await db
    .select({
      quizId: quizAttempts.id,
      accuracy: quizAttempts.accuracy,
      topicId: quizzes.topicId,
      quizTitle: quizzes.title,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(eq(quizAttempts.userId, userId));

  const weak = rows.filter((r) => r.accuracy < 70 && r.topicId);
  const topicIds = [...new Set(weak.map((r) => r.topicId as number))];
  if (topicIds.length === 0) return [];
  const weakTopics = await db
    .select()
    .from(topics)
    .where(sql`${topics.id} IN (${sql.join(topicIds, sql`, `)})`);
  return weakTopics;
}
