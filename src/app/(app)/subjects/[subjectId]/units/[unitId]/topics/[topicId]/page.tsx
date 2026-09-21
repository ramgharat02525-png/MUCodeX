import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireOnboardedUser } from "@/lib/auth";
import {
  getSubjectById,
  getUnitById,
  getTopicById,
  getTopicsForUnit,
  getTopicProgress,
  upsertTopicProgress,
} from "@/services/syllabusService";
import { TopicLearningClient } from "@/components/learning/TopicLearningClient";

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ subjectId: string; unitId: string; topicId: string }>;
}) {
  const user = await requireOnboardedUser();
  const { subjectId, unitId, topicId } = await params;

  const subject = await getSubjectById(Number(subjectId));
  const unit = await getUnitById(Number(unitId));
  const topic = await getTopicById(Number(topicId));
  if (!subject || !unit || !topic || unit.subjectId !== subject.id || topic.unitId !== unit.id) {
    notFound();
  }

  let progress = await getTopicProgress(user.id, topic.id);
  if (!progress) {
    progress = await upsertTopicProgress(user.id, topic.id, "in_progress", 20);
  }

  const unitTopics = await getTopicsForUnit(unit.id);
  const currentIndex = unitTopics.findIndex((t) => t.id === topic.id);
  const next = unitTopics[currentIndex + 1];
  const nextTopicHref = next ? `/subjects/${subject.id}/units/${unit.id}/topics/${next.id}` : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
        <Link href="/subjects" className="hover:text-accent-blue">My Learning</Link>
        <ChevronRight size={12} />
        <Link href={`/subjects/${subject.id}`} className="hover:text-accent-blue">{subject.name}</Link>
        <ChevronRight size={12} />
        <Link href={`/subjects/${subject.id}/units/${unit.id}`} className="hover:text-accent-blue">{unit.title}</Link>
        <ChevronRight size={12} />
        <span className="text-text">{topic.title}</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{topic.title}</h1>

      <TopicLearningClient
        topic={{
          id: topic.id,
          title: topic.title,
          estimatedMinutes: topic.estimatedMinutes,
          objectives: (topic.objectives as string[]) ?? [],
          easyExplanation: topic.easyExplanation,
          technicalExplanation: topic.technicalExplanation,
          example: topic.example,
          codeExampleJava: topic.codeExampleJava,
          codeExamplePython: topic.codeExamplePython,
          visualType: topic.visualType,
          importantPoints: (topic.importantPoints as string[]) ?? [],
          commonMistakes: (topic.commonMistakes as string[]) ?? [],
          practiceQuestion: topic.practiceQuestion,
        }}
        initialStatus={progress.status}
        initialPercent={progress.progressPercent}
        nextTopicHref={nextTopicHref}
      />
    </div>
  );
}
