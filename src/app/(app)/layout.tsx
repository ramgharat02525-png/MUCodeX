import type { ReactNode } from "react";
import { requireOnboardedUser } from "@/lib/auth";
import { StudentShell } from "@/components/layout/StudentShell";
import { getNotifications } from "@/services/notificationService";
import { touchStreak } from "@/services/gamificationService";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireOnboardedUser();
  await touchStreak(user.id);
  const notifications = await getNotifications(user.id, 15);

  return (
    <StudentShell
      user={{
        name: user.name,
        email: user.email,
        avatarColor: user.avatarColor,
        plan: user.plan,
        xp: user.xp,
        streakDays: user.streakDays,
      }}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type ?? "info",
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      }))}
    >
      {children}
    </StudentShell>
  );
}
