import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={cn("card-shadow rounded-2xl border border-border bg-surface", padding, className)}>
      {children}
    </div>
  );
}

type BadgeTone = "neutral" | "blue" | "gold" | "success" | "warning" | "error" | "ai";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-text-muted",
  blue: "bg-accent-blue-soft text-accent-blue",
  gold: "bg-accent-gold-soft text-accent-gold",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  error: "bg-error-soft text-error",
  ai: "bg-ai-soft text-ai",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "blue",
  height = "h-2",
}: {
  value: number;
  className?: string;
  tone?: "blue" | "success" | "gold" | "ai";
  height?: string;
}) {
  const toneClass = {
    blue: "bg-accent-blue",
    success: "bg-success",
    gold: "bg-accent-gold",
    ai: "bg-ai",
  }[tone];
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-surface-2", height, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", toneClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function Avatar({
  name,
  color,
  size = 40,
}: {
  name: string;
  color?: string | null;
  size?: number;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color ?? "#131c3f", fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-blue">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2/40 px-6 py-14 text-center">
      {icon ? <div className="text-text-muted">{icon}</div> : null}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "blue",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-text">{value}</p>
        {sub ? <p className="mt-1 text-xs text-text-muted">{sub}</p> : null}
      </div>
      {icon ? (
        <div className={cn("rounded-xl p-2.5", badgeTones[tone])}>
          {icon}
        </div>
      ) : null}
    </Card>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
