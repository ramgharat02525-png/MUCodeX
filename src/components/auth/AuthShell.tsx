import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image src="/images/mucodex-mark.png" alt="MUCodeX" width={40} height={40} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">MUCodeX</span>
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-gold">
            Learn. Create. Innovate.
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Mumbai University's syllabus, an AI tutor, and real coding practice — in one place.
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Semester 3 Computer Engineering subjects, Java &amp; Python coding practice, AI-generated
            quizzes and exam-ready previous-year questions, built specifically for MU students.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-xs text-white/60">
          <span>MU-aligned syllabus</span>
          <span>•</span>
          <span>AI Tutor</span>
          <span>•</span>
          <span>Java + Python</span>
        </div>
      </div>
      <div className="flex items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/images/mucodex-mark.png" alt="MUCodeX" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-semibold tracking-tight text-text">MUCodeX</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
          <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
