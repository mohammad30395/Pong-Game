"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import type { Arena, DifficultyProfile, GameModeSelection, GameSnapshot, UserSetup } from "@/types/game";

export function GameHUD({
  setup,
  mode,
  arena,
  difficulty,
  snapshot,
  paused,
  onPause,
  onRestart,
}: {
  setup: UserSetup;
  mode: GameModeSelection;
  arena: Arena;
  difficulty: DifficultyProfile;
  snapshot: GameSnapshot;
  paused: boolean;
  onPause: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="grid shrink-0 gap-2 rounded-xl border border-white/10 bg-slate-950/78 p-2.5 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-2 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase text-slate-400">
            <span>{setup.name}</span>
            <span>@{setup.username}</span>
            <span className="text-cyan-200">{mode.mode} mode</span>
            <span>{mode.sides} sides</span>
            <span>{difficulty.label}</span>
            <span>{arena.name}</span>
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-white">{snapshot.status}</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {snapshot.sides.map((side) => (
            <div
              key={side.side}
              className={`rounded-lg border px-2 py-1.5 text-xs ${
                side.active
                  ? "border-cyan-300/30 bg-cyan-300/8 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-500"
              }`}
            >
              <span className="block truncate font-bold uppercase">{side.side}</span>
              <span className="font-display text-base font-bold">{side.lives}</span>
              <span className="ml-1 text-[10px] uppercase">lives</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onPause} variant="ghost" className="flex-1 px-3 md:flex-none">
          {paused ? <Play size={16} /> : <Pause size={16} />}
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={onRestart} variant="secondary" className="flex-1 px-3 md:flex-none">
          <RotateCcw size={16} />
          Restart
        </Button>
      </div>
    </div>
  );
}
