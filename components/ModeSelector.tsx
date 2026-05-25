"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Keyboard, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { STORAGE_KEYS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";
import type { GameMode, SideCount } from "@/types/game";

export function ModeSelector() {
  const router = useRouter();
  const [mode, setMode] = useState<GameMode>("computer");
  const [sides, setSides] = useState<SideCount>(2);

  function continueNext() {
    writeStorage(STORAGE_KEYS.mode, { mode, sides });
    router.push("/arena");
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { id: "player" as GameMode, title: "Player Mode", icon: Keyboard, copy: "Human-controlled paddles with keyboard and touch controls." },
          { id: "computer" as GameMode, title: "Computer Mode", icon: Bot, copy: "You control the left paddle while AI handles the other active sides." },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setMode(option.id)}
              className={`neon-card rounded-xl p-5 text-left transition ${
                mode === option.id ? "neon-ring border-cyan-300/60" : "hover:border-white/30"
              }`}
            >
              <Icon className="mb-4 text-cyan-200" size={28} />
              <h2 className="font-display text-xl font-bold text-white">{option.title}</h2>
              <p className="mt-2 text-sm font-medium text-slate-300">{option.copy}</p>
            </button>
          );
        })}
      </div>

      <div className="neon-card rounded-xl p-5">
        <div className="mb-4 flex items-center gap-2 text-slate-200">
          <Users size={20} />
          <h2 className="font-display text-lg font-bold">Number of sides</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([2, 3, 4] as SideCount[]).map((count) => (
            <button
              key={count}
              onClick={() => setSides(count)}
              className={`rounded-lg border px-4 py-4 font-display text-lg font-bold transition ${
                sides === count
                  ? "border-fuchsia-300 bg-fuchsia-400/20 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {count} sides
            </button>
          ))}
        </div>
      </div>

      <Button onClick={continueNext} className="justify-self-center px-10">
        Continue
      </Button>
    </div>
  );
}
