import "server-only";
import { db } from "@/db";
import {
  users,
  achievements,
  userAchievements,
  codingSubmissions,
  quizAttempts,
  topicProgress,
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createNotification } from "./notificationService";

export async function addXp(userId: number, amount: number) {
  const [updated] = await db
    .update(users)
    .set({ xp: sql`${users.xp} + ${amount}` })
    .where(eq(users.id, userId))
    .returning();
  return updated;
}

export async function touchStreak(userId: number) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = rows[0];
  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  if (user.lastActiveDate === today) return user;

  let newStreak = 1;
  if (user.lastActiveDate) {
    const last = new Date(user.lastActiveDate);
    const diffDays = Math.round((new Date(today).getTime() - last.getTime()) / 86400000);
    if (diffDays === 1) newStreak = user.streakDays + 1;
    else if (diffDays <= 0) newStreak = user.streakDays;
    else newStreak = 1;
  }

  const [updated] = await db
    .update(users)
    .set({ streakDays: newStreak, lastActiveDate: today })
    .where(eq(users.id, userId))
    .returning();

  if (newStreak === 7 || newStreak === 14 || newStreak === 30) {
    await createNotification(
      userId,
      `${newStreak}-day streak! 🔥`,
      `Incredible consistency — you've studied on MUCodeX for ${newStreak} days in a row.`,
      "success",
    );
  }

  return updated;
}

const ACHIEVEMENT_CHECKS: Record<string, (userId: number) => Promise<boolean>> = {
  "first-steps": async (userId) => {
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(topicProgress)
      .where(and(eq(topicProgress.userId, userId), eq(topicProgress.status, "completed")));
    return Number(rows[0]?.count ?? 0) >= 1;
  },
  "code-warrior": async (userId) => {
    const rows = await db
      .select({ count: sql<number>`count(distinct ${codingSubmissions.problemId})` })
      .from(codingSubmissions)
      .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.status, "passed")));
    return Number(rows[0]?.count ?? 0) >= 5;
  },
  "problem-solver-pro": async (userId) => {
    const rows = await db
      .select({ count: sql<number>`count(distinct ${codingSubmissions.problemId})` })
      .from(codingSubmissions)
      .where(and(eq(codingSubmissions.userId, userId), eq(codingSubmissions.status, "passed")));
    return Number(rows[0]?.count ?? 0) >= 20;
  },
  "quiz-whiz": async (userId) => {
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.accuracy, 100)));
    return Number(rows[0]?.count ?? 0) >= 1;
  },
  "streak-7": async (userId) => {
    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return (rows[0]?.streakDays ?? 0) >= 7;
  },
  "century-xp": async (userId) => {
    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return (rows[0]?.xp ?? 0) >= 500;
  },
  "mock-test-taker": async (userId) => {
    const rows = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), sql`${quizAttempts.totalQuestions} >= 8`));
    return Number(rows[0]?.count ?? 0) >= 1;
  },
};

export async function evaluateAchievements(userId: number) {
  const catalog = await db.select().from(achievements);
  const already = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));
  const earnedCodes = new Set(already.map((a) => a.achievementId));
  const newlyEarned: (typeof catalog)[number][] = [];

  for (const achievement of catalog) {
    if (earnedCodes.has(achievement.id)) continue;
    const check = ACHIEVEMENT_CHECKS[achievement.code];
    if (!check) continue;
    const passed = await check(userId).catch(() => false);
    if (passed) {
      await db.insert(userAchievements).values({ userId, achievementId: achievement.id }).onConflictDoNothing();
      await addXp(userId, achievement.xpReward ?? 25);
      await createNotification(
        userId,
        "New achievement unlocked 🏆",
        `You earned "${achievement.title}" (+${achievement.xpReward} XP) — ${achievement.description}`,
        "success",
      );
      newlyEarned.push(achievement);
    }
  }
  return newlyEarned;
}
