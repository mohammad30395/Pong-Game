import Link from "next/link";
import { Trophy, Zap } from "lucide-react";

export function Navbar() {
  return (
    <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg border border-cyan-300/40 bg-cyan-300/10 text-cyan-200">
            <Zap size={18} />
          </span>
          <span className="font-display text-base font-bold uppercase tracking-wide text-white">
            Neon Pong
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Link className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white" href="/rules">
            Rules
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white"
            href="/leaderboard"
          >
            <Trophy size={16} />
            Board
          </Link>
        </nav>
      </div>
    </header>
  );
}
