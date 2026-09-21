import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { upsertTopicProgress, getTopicById } from "@/services/syllabusService";
import { addXp, touchStreak, evaluateAchievements } from "@/services/gamificationService";
import { createNotification } from "@/services/notificationService";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const topic = await getTopicById(Number(id));
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  await upsertTopicProgress(user.id, topic.id, "completed", 100);
  await addXp(user.id, 15);
  await touchStreak(user.id);
  const newAchievements = await evaluateAchievements(user.id);

  await createNotification(
    user.id,
    "Lesson completed ✅",
    `Great job finishing "${topic.title}". +15 XP added to your profile.`,
    "success",
  );

  return NextResponse.json({ ok: true, newAchievements: newAchievements.map((a) => a.title) });
}
