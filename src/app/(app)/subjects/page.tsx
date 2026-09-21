import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { requireOnboardedUser } from "@/lib/auth";
import { SectionHeading, Card, Badge, ProgressBar } from "@/components/ui/Primitives";
import { getSubjectsForSemester, getUnitsForSubject, getTopicsForUnit, getUserProgressMap } from "@/services/syllabusService";
import { ICONS } from "@/components/subject-icon";
import { Code2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const user = await requireOnboardedUser();
  const branch = user.branch ?? "Computer Engineering";
  const semester = user.semester ?? 3;

  const subjects = await getSubjectsForSemester(branch, semester);
  const progressMap = await getUserProgressMap(user.id);

  const subjectStats = await Promise.all(
    subjects.map(async (subject) => {
      const units = await getUnitsForSubject(subject.id);
      const topicsByUnit = await Promise.all(units.map((u) => getTopicsForUnit(u.id)));
      const allTopics = topicsByUnit.flat();
      const completed = allTopics.filter((t) => progressMap.get(t.id)?.status === "completed").length;
      const percent = allTopics.length
        ? Math.round(
            allTopics.reduce((sum, t) => sum + (progressMap.get(t.id)?.progressPercent ?? 0), 0) /
              allTopics.length,
          )
        : 0;
      return { subject, unitCount: units.length, topicCount: allTopics.length, completed, percent };
    }),
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="MU Syllabus"
        title="My Learning"
        description={`${branch} · Semester ${semester} — the full Mumbai University syllabus tree, from subject down to topic.`}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjectStats.map(({ subject, unitCount, topicCount, completed, percent }) => {
          const Icon = ICONS[subject.icon ?? "code-2"] ?? Code2;
          const content = (
            <Card
              className={`h-full transition ${
                subject.comingSoon ? "opacity-70" : "hover:-translate-y-0.5 hover:border-accent-blue hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl p-2.5" style={{ background: "var(--surface-2)" }}>
                  <Icon size={22} className="text-text" />
                </div>
                {subject.comingSoon ? (
                  <Badge tone="neutral"><Lock size={11} /> Coming soon</Badge>
                ) : (
                  <Badge tone="blue">{subject.code}</Badge>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-text">{subject.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-text-muted">{subject.description}</p>

              {!subject.comingSoon && (
                <>
                  <div className="mt-4 flex items-center gap-2">
                    <ProgressBar value={percent} height="h-1.5" />
                    <span className="shrink-0 text-xs font-medium text-text-muted">{percent}%</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {unitCount} units · {topicCount} topics
                    </span>
                    <span className="flex items-center gap-1 font-medium text-accent-blue">
                      Open <ArrowRight size={12} />
                    </span>
                  </div>
                </>
              )}
            </Card>
          );
          return subject.comingSoon ? (
            <div key={subject.id} className="cursor-not-allowed">
              {content}
            </div>
          ) : (
            <Link key={subject.id} href={`/subjects/${subject.id}`}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
