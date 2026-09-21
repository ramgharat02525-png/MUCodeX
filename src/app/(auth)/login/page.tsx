"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.patil@mucodex.app");
  const [password, setPassword] = useState("MUCodeX@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push(data.onboarded ? "/dashboard" : "/onboarding");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your MUCodeX learning journey.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring-2"
            placeholder="you@college.edu"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring-2"
            placeholder="••••••••"
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-error-soft px-3 py-2 text-xs font-medium text-error">{error}</p>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>
      <div className="mt-5 rounded-xl border border-dashed border-border bg-surface-2/60 p-3 text-xs text-text-muted">
        <p className="font-semibold text-text">Demo account prefilled</p>
        <p className="mt-0.5">Aarav Patil · Computer Engineering · Semester 3 — already has progress, badges &amp; quiz history.</p>
      </div>
      <p className="mt-6 text-center text-sm text-text-muted">
        New to MUCodeX?{" "}
        <Link href="/signup" className="font-medium text-accent-blue hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
