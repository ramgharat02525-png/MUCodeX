import "server-only";
import { db } from "@/db";
import { subjects, units, topics, topicProgress } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";

export async function getSubjectsForSemester(branch: string, semester: number) {
  return db
    .select()
    .from(subjects)
    .where(and(eq(subjects.branch, branch), eq(subjects.semester, semester)))
    .orderBy(asc(subjects.order));
}

export async function getAllSubjects() {
  return db.select().from(subjects).orderBy(asc(subjects.order));
}

export async function getSubjectById(id: number) {
  const rows = await db.select().from(subjects).where(eq(subjects.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUnitsForSubject(subjectId: number) {
  return db
    .select()
    .from(units)
    .where(eq(units.subjectId, subjectId))
    .orderBy(asc(units.order));
}

export async function getUnitById(id: number) {
  const rows = await db.select().from(units).where(eq(units.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getTopicsForUnit(unitId: number) {
  return db
    .select()
    .from(topics)
    .where(eq(topics.unitId, unitId))
    .orderBy(asc(topics.order));
}

export async function getTopicById(id: number) {
  const rows = await db.select().from(topics).where(eq(topics.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUserProgressMap(userId: number) {
  const rows = await db.select().from(topicProgress).where(eq(topicProgress.userId, userId));
  const map = new Map<number, (typeof rows)[number]>();
  for (const row of rows) map.set(row.topicId, row);
  return map;
}

export async function getTopicProgress(userId: number, topicId: number) {
  const rows = await db
    .select()
    .from(topicProgress)
    .where(and(eq(topicProgress.userId, userId), eq(topicProgress.topicId, topicId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertTopicProgress(
  userId: number,
  topicId: number,
  status: string,
  progressPercent: number,
) {
  const existing = await getTopicProgress(userId, topicId);
  if (existing) {
    const [updated] = await db
      .update(topicProgress)
      .set({ status, progressPercent, updatedAt: new Date() })
      .where(eq(topicProgress.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(topicProgress)
    .values({ userId, topicId, status, progressPercent })
    .returning();
  return created;
}

export async function getFullSubjectTree(subjectId: number) {
  const subject = await getSubjectById(subjectId);
  if (!subject) return null;
  const subjectUnits = await getUnitsForSubject(subjectId);
  const unitsWithTopics = await Promise.all(
    subjectUnits.map(async (unit) => ({
      ...unit,
      topics: await getTopicsForUnit(unit.id),
    })),
  );
  return { subject, units: unitsWithTopics };
}
