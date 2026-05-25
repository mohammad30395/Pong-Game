"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { DIFFICULTIES, STORAGE_KEYS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";
import type { Difficulty } from "@/types/game";

export function DifficultySelector() {
  const router = useRouter();

  function choose(difficulty: Difficulty) {
    writeStorage(STORAGE_KEYS.difficulty, difficulty);
    router.push("/game");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
      {DIFFICULTIES.map((difficulty) => (
        <article key={difficulty.id} className="neon-card flex flex-col rounded-xl p-5">
          <h2 className="font-display text-2xl font-bold text-white">{difficulty.label}</h2>
          <p className="mt-3 flex-1 text-sm font-medium text-slate-300">{difficulty.description}</p>
          <dl className="my-5 grid gap-2 text-sm text-slate-300">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt>AI speed</dt>
              <dd>{difficulty.aiSpeed}</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt>Reaction</dt>
              <dd>{difficulty.reaction}s</dd>
            </div>
            <div className="flex justify-between">
              <dt>Mistakes</dt>
              <dd>{Math.round(difficulty.mistakeChance * 100)}%</dd>
            </div>
          </dl>
          <Button onClick={() => choose(difficulty.id)} className="w-full">
            Choose {difficulty.label}
          </Button>
        </article>
      ))}
    </div>
  );
}
