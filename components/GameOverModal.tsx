"use client";

import { Home, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import type { GameResult } from "@/types/game";

export function GameOverModal({
  result,
  onPlayAgain,
}: {
  result: GameResult | null;
  onPlayAgain: () => void;
}) {
  if (!result) return null;

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/72 p-4 backdrop-blur-sm">
      <section className="neon-card neon-ring w-full max-w-md rounded-xl p-6 text-center">
        <Trophy className="mx-auto text-cyan-200" size={42} />
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-200">Game over</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-white">{result.winner} wins</h2>
        <p className="mt-3 text-sm font-semibold text-slate-300">{result.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Button onClick={onPlayAgain} className="px-3">
            <RotateCcw size={16} /> Play Again
          </Button>
          <Button href="/" variant="ghost" className="px-3">
            <Home size={16} /> Home
          </Button>
          <Button href="/leaderboard" variant="secondary" className="px-3">
            <Trophy size={16} /> Board
          </Button>
        </div>
      </section>
    </div>
  );
}
