import "server-only";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createNotification(
  userId: number,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "ai" = "info",
) {
  const [created] = await db
    .insert(notifications)
    .values({ userId, title, message, type })
    .returning();
  return created;
}

export async function getNotifications(userId: number, limit = 20) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: number) {
  const rows = await getNotifications(userId, 100);
  return rows.filter((n) => !n.read).length;
}

export async function markNotificationRead(userId: number, notificationId: number) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId));
}

export async function markAllRead(userId: number) {
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
}
