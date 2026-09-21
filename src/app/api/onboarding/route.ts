import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { evaluateAchievements } from "@/services/gamificationService";
import { createNotification } from "@/services/notificationService";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { branch, semester, programmingExperience, preferredLanguage, learningGoal, name } = body ?? {};

  if (!branch || !semester || !programmingExperience || !preferredLanguage || !learningGoal) {
    return NextResponse.json({ error: "All onboarding fields are required." }, { status: 400 });
  }

  await db
    .update(users)
    .set({
      name: name?.trim() || user.name,
      branch,
      semester: Number(semester),
      programmingExperience,
      preferredLanguage,
      learningGoal,
      onboarded: true,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      streakDays: 1,
    })
    .where(eq(users.id, user.id));

  await createNotification(
    user.id,
    "Your learning path is ready 🎯",
    `We've personalized MUCodeX for ${branch}, Semester ${semester}. Head to your dashboard to start learning.`,
    "success",
  );
  await evaluateAchievements(user.id);

  return NextResponse.json({ ok: true });
}
