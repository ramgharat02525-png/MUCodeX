import "server-only";
import { db } from "@/db";
import { feedbackEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createFeedback(
  userId: number | null,
  category: string,
  subject: string,
  description: string,
) {
  const [created] = await db
    .insert(feedbackEntries)
    .values({ userId, category, subject, description })
    .returning();
  return created;
}

export async function getUserFeedback(userId: number) {
  return db
    .select()
    .from(feedbackEntries)
    .where(eq(feedbackEntries.userId, userId))
    .orderBy(desc(feedbackEntries.createdAt));
}
