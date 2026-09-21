"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header, type HeaderUser, type HeaderNotification } from "./Header";
import { ConnectivityProvider } from "./ConnectivityProvider";

export function StudentShell({
  user,
  notifications,
  children,
}: {
  user: HeaderUser;
  notifications: HeaderNotification[];
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ConnectivityProvider>
      <div className="flex min-h-screen bg-bg">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} notifications={notifications} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ConnectivityProvider>
  );
}
