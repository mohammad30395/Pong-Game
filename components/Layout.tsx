import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export function Layout({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <main className="app-shell relative min-h-dvh overflow-hidden">
      <div className="grid-glow pointer-events-none absolute inset-0" />
      <Navbar />
      <div className={`relative z-10 mx-auto max-w-6xl px-4 ${compact ? "py-6" : "py-10 md:py-14"}`}>
        {children}
      </div>
    </main>
  );
}
