"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  Lightbulb,
  BookOpenText,
  Code2,
  Target,
  AlertTriangle,
  PenTool,
  ArrowRight,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { Card, Badge, ProgressBar } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ConceptVisualizer } from "./ConceptVisualizer";
import { QUICK_ACTION_LABELS, type QuickAction } from "@/lib/aiQuickActions";

type Topic = {
  id: number;
  title: string;
  estimatedMinutes: number | null;
  objectives: string[];
  easyExplanation: string | null;
  technicalExplanation: string | null;
  example: string | null;
  codeExampleJava: string | null;
  codeExamplePython: string | null;
  visualType: string | null;
  importantPoints: string[];
  commonMistakes: string[];
  practiceQuestion: string | null;
};

export function TopicLearningClient({
  topic,
  initialStatus,
  initialPercent,
  nextTopicHref,
}: {
  topic: Topic;
  initialStatus: string;
  initialPercent: number;
  nextTopicHref: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [percent, setPercent] = useState(initialPercent);
  const [completing, setCompleting] = useState(false);
  const [codeTab, setCodeTab] = useState<"java" | "python">(topic.codeExampleJava ? "java" : "python");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ heading: string; sections: { label: string; content: string }[] } | null>(
    null,
  );

  async function markComplete() {
    setCompleting(true);
    const res = await fetch(`/api/topics/${topic.id}/complete`, { method: "POST" });
    if (res.ok) {
      setStatus("completed");
      setPercent(100);
      router.refresh();
    }
    setCompleting(false);
  }

  async function askQuickAction(action: QuickAction) {
    setAiLoading(true);
    setAiResponse(null);
    const res = await fetch("/api/ai/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: QUICK_ACTION_LABELS[action], contextTopicId: topic.id, action }),
    });
    const data = await res.json();
    setAiResponse(data);
    setAiLoading(false);
  }

  const code = codeTab === "java" ? topic.codeExampleJava : topic.codeExamplePython;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge tone={status === "completed" ? "success" : "blue"}>
              {status === "completed" ? "Completed" : status === "in_progress" ? "In progress" : "Not started"}
            </Badge>
            <span className="text-xs text-text-muted">{topic.estimatedMinutes} min read</span>
          </div>
          {status !== "completed" ? (
            <Button size="sm" onClick={markComplete} disabled={completing}>
              {completing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Mark as complete
            </Button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-success">
              <PartyPopper size={14} /> Lesson completed — +15 XP earned
            </span>
          )}
        </div>
        <ProgressBar value={percent} className="mt-4" tone={status === "completed" ? "success" : "blue"} />
      </Card>

      <Card>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Target size={16} className="text-accent-blue" /> Learning Objectives
        </h3>
        <ul className="mt-3 space-y-1.5">
          {topic.objectives.map((o, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
              {o}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
            <Lightbulb size={16} className="text-accent-gold" /> Easy Explanation
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{topic.easyExplanation}</p>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
            <BookOpenText size={16} className="text-ai" /> Technical Explanation
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{topic.technicalExplanation}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-text">Real-World Example</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{topic.example}</p>
      </Card>

      {code ? (
        <Card padding="p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
              <Code2 size={16} className="text-accent-blue" /> Code Example
            </h3>
            {topic.codeExampleJava && topic.codeExamplePython && (
              <div className="flex rounded-lg bg-surface-2 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setCodeTab("java")}
                  className={`rounded-md px-2.5 py-1 ${codeTab === "java" ? "bg-surface text-text shadow-sm" : "text-text-muted"}`}
                >
                  Java
                </button>
                <button
                  onClick={() => setCodeTab("python")}
                  className={`rounded-md px-2.5 py-1 ${codeTab === "python" ? "bg-surface text-text shadow-sm" : "text-text-muted"}`}
                >
                  Python
                </button>
              </div>
            )}
          </div>
          <pre className="scrollbar-thin overflow-x-auto bg-[#0d1224] p-5 text-[13px] leading-relaxed text-[#d8deef]">
            <code className="font-mono">{code}</code>
          </pre>
        </Card>
      ) : null}

      {topic.visualType && topic.visualType !== "none" ? (
        <Card>
          <h3 className="mb-1 text-sm font-semibold text-text">Interactive Visual Learning</h3>
          <p className="mb-4 text-xs text-text-muted">Play with the concept below to build intuition, not just memorize it.</p>
          <ConceptVisualizer visualType={topic.visualType} />
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-text">Important Points</h3>
          <ul className="mt-3 space-y-2">
            {topic.importantPoints.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-success" />
                {p}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
            <AlertTriangle size={15} className="text-warning" /> Common Mistakes
          </h3>
          <ul className="mt-3 space-y-2">
            {topic.commonMistakes.map((p, idx) => (
              <li key={idx} className="text-sm text-text-muted">
                • {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-accent-gold/30 bg-accent-gold-soft/40">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
          <PenTool size={15} className="text-accent-gold" /> Practice Question
        </h3>
        <p className="mt-2 text-sm text-text">{topic.practiceQuestion}</p>
        <Link href="/practice" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-blue hover:underline">
          Try it in Coding Practice <ArrowRight size={12} />
        </Link>
      </Card>

      <Card className="border-ai/30 bg-ai-soft/30">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Sparkles size={16} className="text-ai" /> Explain this differently
        </h3>
        <p className="mt-1 text-xs text-text-muted">Ask MUCodeX AI Tutor to reframe this topic for you.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(QUICK_ACTION_LABELS) as QuickAction[]).map((action) => (
            <button
              key={action}
              onClick={() => askQuickAction(action)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition hover:border-ai hover:text-ai"
            >
              {QUICK_ACTION_LABELS[action]}
            </button>
          ))}
        </div>
        {aiLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" /> MUCodeX AI is thinking...
          </div>
        ) : aiResponse ? (
          <div className="mt-4 space-y-3 rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-semibold text-text">{aiResponse.heading}</p>
            {aiResponse.sections.map((s, idx) => (
              <div key={idx}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ai">{s.label}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-text-muted">{s.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="flex justify-end">
        {nextTopicHref ? (
          <Link href={nextTopicHref}>
            <Button variant="outline">
              Next Topic <ArrowRight size={15} />
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
