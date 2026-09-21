import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";
import { createNotification } from "@/services/notificationService";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const colors = ["#2b62f0", "#7047d6", "#ee9d1f", "#178a4c", "#c22a2a"];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash, avatarColor })
    .returning();

  await createNotification(
    created.id,
    "Welcome to MUCodeX! 👋",
    "Your account is ready. Complete a short onboarding to personalize your learning path.",
    "info",
  );

  await createSession(created.id);
  return NextResponse.json({ ok: true, onboarded: created.onboarded });
}
