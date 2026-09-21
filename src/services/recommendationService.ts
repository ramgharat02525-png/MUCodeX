import "server-only";
import { getWeakTopics } from "./progressService";
import { getSolvedProblemIds, getAllProblems } from "./codingService";

export type Recommendation = {
  title: string;
  reason: string;
  actions: { label: string; href: string }[];
};

export async function getRecommendations(userId: number): Promise<Recommendation[]> {
  const recs: Recommendation[] = [];

  const weakTopics = await getWeakTopics(userId);
  for (const topic of weakTopics.slice(0, 2)) {
    recs.push({
      title: `We noticed you're struggling with ${topic.title}`,
      reason: "Your recent quiz accuracy on this topic was below 70%.",
      actions: [
        { label: "Review for 10 minutes", href: `/topics/${topic.id}` },
        { label: "Take a 5-question quiz", href: `/quiz` },
      ],
    });
  }

  const solvedIds = await getSolvedProblemIds(userId);
  const allProblems = await getAllProblems();
  const unsolvedEasy = allProblems.find((p) => p.difficulty === "easy" && !solvedIds.has(p.id));
  if (unsolvedEasy) {
    recs.push({
      title: `Try "${unsolvedEasy.title}"`,
      reason: "A quick win to build momentum in your coding streak today.",
      actions: [{ label: "Solve 3 beginner problems", href: `/practice/${unsolvedEasy.slug}` }],
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Great pace — keep going!",
      reason: "You're on track with the Semester 3 syllabus. Try a mock test to test exam-readiness.",
      actions: [{ label: "Start a mock test", href: "/exam-prep" }],
    });
  }

  return recs.slice(0, 3);
}
