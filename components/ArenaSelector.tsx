"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { ARENAS, STORAGE_KEYS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";

export function ArenaSelector() {
  const router = useRouter();

  function selectArena(id: string) {
    writeStorage(STORAGE_KEYS.arena, id);
    router.push("/difficulty");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ARENAS.map((arena) => (
        <article key={arena.id} className="neon-card grid rounded-xl p-4">
          <div
            className="mb-4 h-32 rounded-lg border"
            style={{
              borderColor: `${arena.accent}88`,
              background:
                `linear-gradient(135deg, ${arena.background}, #050711), ` +
                `linear-gradient(${arena.accent}33 1px, transparent 1px), linear-gradient(90deg, ${arena.accent}30 1px, transparent 1px)`,
              backgroundSize: "auto, 22px 22px, 22px 22px",
              boxShadow: `inset 0 0 36px ${arena.accent}22`,
            }}
          />
          <h2 className="font-display text-xl font-bold text-white">{arena.name}</h2>
          <p className="mt-2 min-h-12 text-sm font-medium text-slate-300">{arena.description}</p>
          <Button onClick={() => selectArena(arena.id)} className="mt-5 w-full">
            Select
          </Button>
        </article>
      ))}
    </div>
  );
}
