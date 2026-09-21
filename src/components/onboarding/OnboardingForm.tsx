"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Code2,
  Target,
  Rocket,
  CheckCircle2,
} from "lucide-react";

const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "AI & Data Science",
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const EXPERIENCE = [
  { value: "beginner", label: "Beginner", desc: "New to programming" },
  { value: "some", label: "Some experience", desc: "Know basic syntax" },
  { value: "intermediate", label: "Intermediate", desc: "Comfortable with logic building" },
  { value: "advanced", label: "Advanced", desc: "Confident with OOP & DSA" },
];

const LANGUAGES = [
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "both", label: "Both Java & Python" },
];

const GOALS = [
  { value: "exams", label: "Pass university exams", icon: GraduationCap },
  { value: "coding", label: "Improve my coding skills", icon: Code2 },
  { value: "basics", label: "Learn programming from basics", icon: Target },
  { value: "placements", label: "Prepare for placements", icon: Rocket },
  { value: "competitive", label: "Prepare for competitive/GATE exams", icon: CheckCircle2 },
];

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(defaultName);
  const [branch, setBranch] = useState("Computer Engineering");
  const [semester, setSemester] = useState(3);
  const [experience, setExperience] = useState("beginner");
  const [language, setLanguage] = useState("java");
  const [goal, setGoal] = useState("exams");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Profile", "Branch & Semester", "Experience", "Language", "Goal"];
  const progress = ((step + 1) / steps.length) * 100;

  async function finish() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          branch,
          semester,
          programmingExperience: experience,
          preferredLanguage: language,
          learningGoal: goal,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the server.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/images/mucodex-mark.png" alt="MUCodeX" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-semibold text-text">MUCodeX</span>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-medium text-text-muted">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{steps[step]}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-shadow rounded-2xl border border-border bg-surface p-6 sm:p-8">
          {step === 0 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-text">What should we call you?</h2>
              <p className="mt-1 text-sm text-text-muted">This appears on your dashboard and leaderboard.</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none ring-accent-blue/30 focus:ring-2"
                placeholder="Your full name"
              />
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-text">Your branch &amp; semester</h2>
              <p className="mt-1 text-sm text-text-muted">
                MUCodeX personalizes the syllabus tree to match your Mumbai University branch and semester.
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">Branch</label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {BRANCHES.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBranch(b)}
                        className={cn(
                          "rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition",
                          branch === b
                            ? "border-accent-blue bg-accent-blue-soft text-accent-blue"
                            : "border-border bg-surface text-text hover:bg-surface-2",
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">Semester</label>
                  <div className="flex flex-wrap gap-2">
                    {SEMESTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSemester(s)}
                        className={cn(
                          "h-10 w-10 rounded-full border text-sm font-semibold transition",
                          semester === s
                            ? "border-accent-blue bg-accent-blue text-white"
                            : "border-border bg-surface text-text hover:bg-surface-2",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {semester === 3 ? (
                    <p className="mt-2 text-xs font-medium text-success">
                      ✓ MUCodeX has full Semester 3 coverage — OOPM (Java), Data Structures &amp; more.
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-text-muted">
                      MUCodeX currently offers the deepest content for Semester 3 — other semesters are expanding soon.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-text">Your programming experience</h2>
              <p className="mt-1 text-sm text-text-muted">We'll calibrate explanations and quiz difficulty accordingly.</p>
              <div className="mt-6 space-y-2">
                {EXPERIENCE.map((exp) => (
                  <button
                    key={exp.value}
                    onClick={() => setExperience(exp.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                      experience === exp.value
                        ? "border-accent-blue bg-accent-blue-soft"
                        : "border-border bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium text-text">{exp.label}</span>
                      <span className="block text-xs text-text-muted">{exp.desc}</span>
                    </span>
                    {experience === exp.value && <CheckCircle2 size={18} className="text-accent-blue" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-text">Preferred coding language</h2>
              <p className="mt-1 text-sm text-text-muted">
                MUCodeX supports Java and Python for coding practice, the AI Tutor and the debugger.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLanguage(l.value)}
                    className={cn(
                      "rounded-xl border px-4 py-4 text-center text-sm font-semibold transition",
                      language === l.value
                        ? "border-accent-blue bg-accent-blue-soft text-accent-blue"
                        : "border-border bg-surface text-text hover:bg-surface-2",
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold text-text">What's your main learning goal?</h2>
              <p className="mt-1 text-sm text-text-muted">This shapes your recommended topics and daily goals.</p>
              <div className="mt-6 space-y-2">
                {GOALS.map((g) => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                        goal === g.value
                          ? "border-accent-blue bg-accent-blue-soft"
                          : "border-border bg-surface hover:bg-surface-2",
                      )}
                    >
                      <Icon size={18} className={goal === g.value ? "text-accent-blue" : "text-text-muted"} />
                      <span className="text-sm font-medium text-text">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error ? (
            <p className="mt-4 rounded-lg bg-error-soft px-3 py-2 text-xs font-medium text-error">{error}</p>
          ) : null}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === 0 && !name.trim()}>
                Continue
              </Button>
            ) : (
              <Button onClick={finish} disabled={loading}>
                {loading ? "Setting up your dashboard..." : "Finish setup"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
