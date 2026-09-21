"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, LogOut, Settings, User as UserIcon, Flame, Zap } from "lucide-react";
import { Avatar, Badge } from "@/components/ui/Primitives";
import { NAV_ITEMS } from "./nav";
import { cn, timeAgo } from "@/lib/utils";

export type HeaderUser = {
  name: string;
  email: string;
  avatarColor: string | null;
  plan: string;
  xp: number;
  streakDays: number;
};

export type HeaderNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export function Header({
  user,
  notifications,
  onMenuClick,
}: {
  user: HeaderUser;
  notifications: HeaderNotification[];
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = localNotifs.filter((n) => !n.read).length;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markAllRead() {
    setLocalNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications/read-all", { method: "POST" });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-text-muted hover:bg-surface-2 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search subjects, tools, pages..."
          className="w-full rounded-xl border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text outline-none focus:ring-2 focus:ring-accent-blue/30"
        />
        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            {results.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-2"
              >
                <r.icon size={15} className="text-text-muted" />
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <Badge tone="gold">
            <Zap size={12} /> {user.xp} XP
          </Badge>
          <Badge tone="warning">
            <Flame size={12} /> {user.streakDays}-day streak
          </Badge>
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-lg p-2 text-text-muted hover:bg-surface-2"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-text">Notifications</p>
                <button onClick={markAllRead} className="text-xs font-medium text-accent-blue hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {localNotifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-text-muted">You're all caught up.</p>
                ) : (
                  localNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "border-b border-border/70 px-4 py-3 last:border-b-0",
                        !n.read && "bg-accent-blue-soft/40",
                      )}
                    >
                      <p className="text-xs font-semibold text-text">{n.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{n.message}</p>
                      <p className="mt-1 text-[10px] text-text-muted">{timeAgo(n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-surface-2"
          >
            <Avatar name={user.name} color={user.avatarColor} size={32} />
            <span className="hidden text-sm font-medium text-text sm:block">{user.name.split(" ")[0]}</span>
            <ChevronDown size={14} className="hidden text-text-muted sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-text">{user.name}</p>
                <p className="truncate text-xs text-text-muted">{user.email}</p>
                <Badge tone={user.plan === "premium" ? "gold" : "neutral"} className="mt-2">
                  {user.plan === "premium" ? "Premium plan" : "Free plan"}
                </Badge>
              </div>
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-2">
                <UserIcon size={15} /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-surface-2">
                <Settings size={15} /> Settings
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error hover:bg-error-soft"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
