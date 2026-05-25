"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Palette } from "lucide-react";
import { Button } from "@/components/Button";
import { DEFAULT_SETUP, STORAGE_KEYS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";
import type { BallSpeed, UserSetup } from "@/types/game";

const speeds: BallSpeed[] = ["1x", "2x", "3x"];

export function SetupForm() {
  const router = useRouter();
  const [setup, setSetup] = useState<UserSetup>({
    name: "",
    username: "",
    ballColor: DEFAULT_SETUP.ballColor,
    paddleColor: DEFAULT_SETUP.paddleColor,
    ballSpeed: DEFAULT_SETUP.ballSpeed,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!setup.name.trim()) nextErrors.name = "Name is required.";
    if (!setup.username.trim()) nextErrors.username = "Username is required.";
    if (!setup.ballColor) nextErrors.ballColor = "Ball color is required.";
    if (!setup.paddleColor) nextErrors.paddleColor = "Paddle color is required.";
    if (!setup.ballSpeed) nextErrors.ballSpeed = "Speed is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    writeStorage(STORAGE_KEYS.setup, {
      ...setup,
      name: setup.name.trim(),
      username: setup.username.trim(),
    });
    router.push("/mode");
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-2xl gap-5">
      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm font-bold uppercase text-slate-300">
          <User size={16} /> Name
        </label>
        <input
          value={setup.name}
          onChange={(event) => setSetup({ ...setup, name: event.target.value })}
          placeholder="Alex"
          className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
        />
        {errors.name && <p className="text-sm font-semibold text-rose-300">{errors.name}</p>}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold uppercase text-slate-300">Username</label>
        <input
          value={setup.username}
          onChange={(event) => setSetup({ ...setup, username: event.target.value })}
          placeholder="alex_arcade"
          className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
        />
        {errors.username && <p className="text-sm font-semibold text-rose-300">{errors.username}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="flex items-center gap-2 text-sm font-bold uppercase text-slate-300">
            <Palette size={16} /> Ball color
          </span>
          <input
            type="color"
            value={setup.ballColor}
            onChange={(event) => setSetup({ ...setup, ballColor: event.target.value })}
            className="h-12 w-full cursor-pointer rounded-md border border-white/10 bg-transparent"
          />
        </label>
        <label className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-sm font-bold uppercase text-slate-300">Paddle color</span>
          <input
            type="color"
            value={setup.paddleColor}
            onChange={(event) => setSetup({ ...setup, paddleColor: event.target.value })}
            className="h-12 w-full cursor-pointer rounded-md border border-white/10 bg-transparent"
          />
        </label>
      </div>

      <div className="grid gap-3">
        <span className="text-sm font-bold uppercase text-slate-300">Ball speed</span>
        <div className="grid grid-cols-3 gap-3">
          {speeds.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setSetup({ ...setup, ballSpeed: speed })}
              className={`rounded-lg border px-4 py-3 font-display text-lg font-bold transition ${
                setup.ballSpeed === speed
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Profile
      </Button>
    </form>
  );
}
