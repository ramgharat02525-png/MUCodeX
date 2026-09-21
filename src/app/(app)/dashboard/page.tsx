import Link from "next/link";
import {
  Flame,
  Zap,
  BookOpen,
  Code2,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Trophy,
  Target,
} from "lucide-react";
import { requireOnboardedUser } from "@/lib/auth";
import { Card, Badge, ProgressBar, SectionHeading, StatCard } from "@/components/ui/Primitives";
import { LinkButton } from "@/components/ui/Button";
import {
  getDashboardSnapshot,
  findContinueLearningTopic,
  getTodaysActivityCounts,
  getRecentActivity,
  getWeakTopics,
} from "@/services/progressService";
import { getRecommendations } from "@/services/recommendationService";
import { evaluateAchievements } from "@/services/gamificationService";
import { levelFromXp, timeAgo } from "@/lib/utils";
import { ICONS } from "@/components/subject-icon";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  await evaluateAchievements(user.id);

  const branch = user.branch ?? "Computer Engineering";
  const semester = user.semester ?? 3;

  const [snapshot, continueLearning, todaysActivity, recentActivity, weakTopics, recommendations] =
    await Promise.all([
      getDashboardSnapshot(user.id, branch, semester),
      findContinueLearningTopic(user.id, branch, semester),
      getTodaysActivityCounts(user.id),
      getRecentActivity(user.id, 6),
      getWeakTopics(user.id),
      getRecommendations(user.id),
    ]);

  const { level, currentXp, neededXp } = levelFromXp(user.xp);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const goals = [
    { label: "Complete 1 lesson", done: todaysActivity.lessonsToday >= 1 },
    { label: "Solve 3 coding problems", done: todaysActivity.problemsToday >= 3, progress: `${Math.min(todaysActivity.problemsToday, 3)}/3` },
    { label: "Complete 1 quiz", done: todaysActivity.quizzesToday >= 1 },
  ];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={`${branch} · Semester ${semester}`}
        title={`${greeting}, ${user.name.split(" ")[0]} 👋`}
        description="Here's where you left off and what MUCodeX recommends studying next."
        action={
          <div className="flex items-center gap-2">
            <Badge tone="blue">Level {level}</Badge>
            <Badge tone="gold">
              <Zap size={12} /> {user.xp} XP
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Overall Progress"
          value={`${snapshot.overallPercent}%`}
          sub="Across Semester 3 subjects"
          icon={<TrendingUp size={18} />}
          tone="blue"
        />
        <StatCard
          label="Coding Problems Solved"
          value={`${snapshot.solvedProblemsCount}/${snapshot.totalProblemsCount}`}
          sub="Java & Python practice"
          icon={<Code2 size={18} />}
          tone="ai"
        />
        <StatCard
          label="Quiz Accuracy"
          value={`${snapshot.avgQuizAccuracy}%`}
          sub={`${snapshot.quizAttemptsCount} attempts so far`}
          icon={<HelpCircle size={18} />}
          tone="success"
        />
        <StatCard
          label="Learning Streak"
          value={`${user.streakDays} days`}
          sub={`${neededXp - currentXp} XP to level ${level + 1}`}
          icon={<Flame size={18} />}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {continueLearning ? (
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent-blue-soft blur-2xl" />
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-blue">Continue Learning</p>
              <h3 className="mt-2 text-xl font-semibold text-text">{continueLearning.subject.name}</h3>
              <p className="mt-1 text-sm text-text-muted">
                {continueLearning.unit.title} — {continueLearning.topic.title}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={continueLearning.progress?.progressPercent ?? 0} className="max-w-xs" />
                <span className="text-xs font-medium text-text-muted">
                  {continueLearning.progress?.progressPercent ?? 0}% complete
                </span>
              </div>
              <LinkButton
                href={`/subjects/${continueLearning.subject.id}/units/${continueLearning.unit.id}/topics/${continueLearning.topic.id}`}
                className="mt-5"
              >
                Continue Learning <ArrowRight size={16} />
              </LinkButton>
            </Card>
          ) : (
            <Card>
              <p className="text-sm font-medium text-text">You've completed everything available right now 🎉</p>
              <p className="mt-1 text-sm text-text-muted">Explore Coding Practice or take a Mock Test to keep sharpening your skills.</p>
            </Card>
          )}

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-text">Your Semester 3 Subjects</h3>
              <Link href="/subjects" className="text-xs font-medium text-accent-blue hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {snapshot.subjectSummaries.map(({ subject, percent }) => {
                const Icon = ICONS[subject.icon ?? "code-2"] ?? Code2;
                return (
                  <Link
                    key={subject.id}
                    href={subject.comingSoon ? "#" : `/subjects/${subject.id}`}
                    aria-disabled={subject.comingSoon}
                    className={`flex items-start gap-3 rounded-xl border border-border p-3.5 transition ${
                      subject.comingSoon ? "cursor-not-allowed opacity-60" : "hover:border-accent-blue hover:bg-accent-blue-soft/30"
                    }`}
                  >
                    <div className="rounded-lg bg-surface-2 p-2 text-text">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{subject.name}</p>
                      <p className="text-xs text-text-muted">{subject.code}</p>
                      {subject.comingSoon ? (
                        <Badge tone="neutral" className="mt-2">Coming soon</Badge>
                      ) : (
                        <div className="mt-2 flex items-center gap-2">
                          <ProgressBar value={percent} height="h-1.5" className="max-w-[120px]" />
                          <span className="text-[11px] text-text-muted">{percent}%</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-base font-semibold text-text">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-text-muted">No activity yet — complete a lesson or solve a problem to see it here.</p>
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-lg p-1.5 ${
                        item.type === "lesson"
                          ? "bg-accent-blue-soft text-accent-blue"
                          : item.type === "coding"
                            ? "bg-ai-soft text-ai"
                            : "bg-success-soft text-success"
                      }`}
                    >
                      {item.type === "lesson" ? <BookOpen size={14} /> : item.type === "coding" ? <Code2 size={14} /> : <HelpCircle size={14} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-text-muted">{timeAgo(item.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-ai/20 bg-ai-soft/40">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-ai" />
              <h3 className="text-sm font-semibold text-text">MUCodeX AI Tutor</h3>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Stuck on a concept? Ask the AI Tutor — it explains using your exact MU syllabus topic, gives
              examples, code, and exam-style answers.
            </p>
            <LinkButton href="/ai-tutor" variant="ai" size="sm" className="mt-3 w-full">
              Ask AI Tutor <ArrowRight size={14} />
            </LinkButton>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-text">Today's Goals</h3>
            <ul className="space-y-2.5">
              {goals.map((g) => (
                <li key={g.label} className="flex items-center gap-2.5 text-sm">
                  {g.done ? (
                    <CheckCircle2 size={17} className="shrink-0 text-success" />
                  ) : (
                    <Circle size={17} className="shrink-0 text-text-muted" />
                  )}
                  <span className={g.done ? "text-text-muted line-through" : "text-text"}>{g.label}</span>
                  {g.progress && !g.done ? (
                    <span className="ml-auto text-xs text-text-muted">{g.progress}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          {weakTopics.length > 0 && (
            <Card>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                <h3 className="text-sm font-semibold text-text">Weak Topics</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {weakTopics.slice(0, 3).map((t) => (
                  <li key={t.id}>
                    <Link href={`/topics/${t.id}`} className="text-sm text-text hover:text-accent-blue hover:underline">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-accent-blue" />
              <h3 className="text-sm font-semibold text-text">Recommended For You</h3>
            </div>
            <div className="mt-3 space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={idx > 0 ? "border-t border-border pt-3" : ""}>
                  <p className="text-sm font-medium text-text">{rec.title}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{rec.reason}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.actions.map((a) => (
                      <Link
                        key={a.label}
                        href={a.href}
                        className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs font-medium text-text hover:bg-border"
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-accent-gold" />
              <h3 className="text-sm font-semibold text-text">Keep the momentum</h3>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              You're {neededXp - currentXp} XP away from Level {level + 1}. Complete a quiz or solve a
              problem to close the gap.
            </p>
            <LinkButton href="/achievements" variant="outline" size="sm" className="mt-3 w-full">
              View Achievements
            </LinkButton>
          </Card>
        </div>
      </div>
    </div>
  );
}
