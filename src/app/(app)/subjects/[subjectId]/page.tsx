import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, ListChecks } from "lucide-react";
import { requireOnboardedUser } from "@/lib/auth";
import { Card, Badge, ProgressBar, SectionHeading, EmptyState } from "@/components/ui/Primitives";
import { getSubjectById, getUnitsForSubject, getTopicsForUnit, getUserProgressMap } from "@/services/syllabusService";

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const user = await requireOnboardedUser();
  const { subjectId } = await params;
  const subject = await getSubjectById(Number(subjectId));
  if (!subject) notFound();

  const units = await getUnitsForSubject(subject.id);
  const progressMap = await getUserProgressMap(user.id);

  const unitStats = await Promise.all(
    units.map(async (unit) => {
      const topics = await getTopicsForUnit(unit.id);
      const completed = topics.filter((t) => progressMap.get(t.id)?.status === "completed").length;
      const percent = topics.length
        ? Math.round(
            topics.reduce((sum, t) => sum + (progressMap.get(t.id)?.progressPercent ?? 0), 0) / topics.length,
          )
        : 0;
      return { unit, topics, completed, percent };
    }),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/subjects" className="hover:text-accent-blue">My Learning</Link>
        <ChevronRight size={12} />
        <span className="text-text">{subject.name}</span>
      </div>

      <SectionHeading
        eyebrow={subject.code}
        title={subject.name}
        description={subject.description ?? undefined}
      />

      {subject.comingSoon ? (
        <EmptyState
          icon={<ListChecks size={28} />}
          title="This subject's full module is coming soon"
          description="Our team is curating AI explanations, coding support and quizzes for this subject. In the meantime, explore OOPM (Java), Data Structures or Python Foundations."
          action={
            <Link href="/subjects" className="text-sm font-medium text-accent-blue hover:underline">
              Back to My Learning
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {unitStats.map(({ unit, topics, completed, percent }, idx) => (
            <Link key={unit.id} href={`/subjects/${subject.id}/units/${unit.id}`}>
              <Card className="flex flex-col gap-3 transition hover:border-accent-blue hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue-soft text-sm font-semibold text-accent-blue">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text sm:text-base">{unit.title}</h3>
                    <p className="mt-1 text-xs text-text-muted sm:max-w-lg">{unit.description}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {completed}/{topics.length} topics completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:w-48">
                  <ProgressBar value={percent} height="h-2" />
                  <Badge tone={percent === 100 ? "success" : "blue"}>{percent}%</Badge>
                  <ArrowRight size={16} className="hidden shrink-0 text-text-muted sm:block" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
