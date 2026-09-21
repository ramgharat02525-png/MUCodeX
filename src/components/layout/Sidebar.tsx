"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav";
import { cn } from "@/lib/utils";
import { X, Wifi, WifiOff } from "lucide-react";
import { useConnectivity } from "./ConnectivityProvider";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { isOffline, toggle } = useConnectivity();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image src="/images/mucodex-mark.png" alt="MUCodeX" width={32} height={32} className="rounded-lg" />
            <span className="text-base font-semibold tracking-tight text-text">MUCodeX</span>
          </Link>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-surface-2 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-accent-blue-soft text-accent-blue"
                    : "text-text-muted hover:bg-surface-2 hover:text-text",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={toggle}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition",
              isOffline
                ? "border-warning/30 bg-warning-soft text-warning"
                : "border-success/30 bg-success-soft text-success",
            )}
            title="Toggle to preview the MUCodeX Offline AI experience"
          >
            <span className="flex items-center gap-2">
              {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              {isOffline ? "OFFLINE MODE" : "ONLINE"}
            </span>
            <span className="text-[10px] font-normal opacity-70">tap to demo</span>
          </button>
          <p className="mt-2 text-[11px] leading-snug text-text-muted">
            {isOffline
              ? "MUCodeX Offline AI is answering from locally cached lessons."
              : "Connected — full AI Tutor & live sync active."}
          </p>
        </div>
      </aside>
    </>
  );
}
