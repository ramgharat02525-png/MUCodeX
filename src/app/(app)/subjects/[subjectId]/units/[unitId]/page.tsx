import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2, PlayCircle, Circle, Clock } from "lucide-react";
import { requireOnboardedUser } from "@/lib/auth";
import { Card, Badge, SectionHeading } from "@/components/ui/Primitives";
import { getSubjectById, getUnitById, getTopicsForUnit, getUserProgressMap } from "@/services/syllabusService";

export const dynamic = "force-dynamic";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ subjectId: string; unitId: string }>;
}) {
  const user = await requireOnboardedUser();
  const { subjectId, unitId } = await params;
  const subject = await getSubjectById(Number(subjectId));
  const unit = await getUnitById(Number(unitId));
  if (!subject || !unit || unit.subjectId !== subject.id) notFound();

  const topics = await getTopicsForUnit(unit.id);
  const progressMap = await getUserProgressMap(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
        <Link href="/subjects" className="hover:text-accent-blue">My Learning</Link>
        <ChevronRight size={12} />
        <Link href={`/subjects/${subject.id}`} className="hover:text-accent-blue">{subject.name}</Link>
        <ChevronRight size={12} />
        <span className="text-text">{unit.title}</span>
      </div>

      <SectionHeading eyebrow={subject.name} title={unit.title} description={unit.description ?? undefined} />

      <div className="space-y-3">
        {topics.map((topic, idx) => {
          const progress = progressMap.get(topic.id);
          const status = progress?.status ?? "available";
          return (
            <Link key={topic.id} href={`/subjects/${subject.id}/units/${unit.id}/topics/${topic.id}`}>
              <Card className="flex items-center justify-between gap-4 transition hover:border-accent-blue hover:shadow-md">
                <div className="flex items-center gap-4">
                  {status === "completed" ? (
                    <CheckCircle2 size={20} className="shrink-0 text-success" />
                  ) : status === "in_progress" ? (
                    <PlayCircle size={20} className="shrink-0 text-accent-blue" />
                  ) : (
                    <Circle size={20} className="shrink-0 text-text-muted" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-text">
                      {idx + 1}. {topic.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                      <Clock size={11} /> {topic.estimatedMinutes} min
                    </p>
                  </div>
                </div>
                <Badge
                  tone={status === "completed" ? "success" : status === "in_progress" ? "blue" : "neutral"}
                >
                  {status === "completed" ? "Completed" : status === "in_progress" ? `${progress?.progressPercent ?? 0}%` : "Start"}
                </Badge>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
