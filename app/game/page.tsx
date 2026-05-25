"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/Button";
import { GameCanvas } from "@/components/GameCanvas";
import { GameHUD } from "@/components/GameHUD";
import { GameOverModal } from "@/components/GameOverModal";
import { getArena, getDifficulty, loadArenaId, loadDifficultyId, loadMode, loadSetup } from "@/lib/gameConfig";
import { saveLeaderboardRecord } from "@/lib/leaderboard";
import type { GameModeSelection, GameResult, GameSnapshot, UserSetup } from "@/types/game";

const emptySnapshot: GameSnapshot = {
  sides: [],
  status: "Preparing match.",
  paused: false,
};

export default function GamePage() {
  const router = useRouter();
  const [setup, setSetup] = useState<UserSetup | null>(null);
  const [mode, setMode] = useState<GameModeSelection | null>(null);
  const [arenaId, setArenaId] = useState<string | null>(null);
  const [difficultyId, setDifficultyId] = useState<"easy" | "medium" | "hard" | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(emptySnapshot);
  const [paused, setPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const storedSetup = loadSetup();
      const storedMode = loadMode();
      const storedArena = loadArenaId();
      const storedDifficulty = loadDifficultyId();

      if (!storedSetup || !storedMode || !storedArena || !storedDifficulty) {
        router.replace("/setup");
        return;
      }

      setSetup(storedSetup);
      setMode(storedMode);
      setArenaId(storedArena);
      setDifficultyId(storedDifficulty);
    });
  }, [router]);

  const arena = useMemo(() => getArena(arenaId), [arenaId]);
  const difficulty = useMemo(() => getDifficulty(difficultyId), [difficultyId]);

  const handleGameOver = useCallback(
    (gameResult: GameResult) => {
      if (!setup || !mode) return;
      setResult(gameResult);
      setPaused(true);
      saveLeaderboardRecord({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        playerName: setup.name,
        username: setup.username,
        mode: mode.mode,
        sides: mode.sides,
        arena: arena.name,
        difficulty: difficulty.id,
        winner: gameResult.winner,
        dateTime: new Date().toISOString(),
        finalSummary: gameResult.summary,
      });
    },
    [arena.name, difficulty.id, mode, setup],
  );

  function restart() {
    setResult(null);
    setPaused(false);
    setSnapshot(emptySnapshot);
    setRestartKey((key) => key + 1);
  }

  if (!setup || !mode) {
    return (
      <main className="app-shell grid min-h-dvh place-items-center p-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Loading match</h1>
          <p className="mt-2 text-slate-300">Checking local setup data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page-lock relative flex flex-col gap-2 bg-slate-950 p-2 text-white sm:p-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h1 className="font-display truncate text-base font-bold uppercase tracking-wide text-cyan-100 sm:text-lg">
          Neon Pong Match
        </h1>
        <Button href="/" variant="ghost" className="min-h-9 px-3 py-1.5 text-xs">
          <Home size={15} />
          Home
        </Button>
      </div>
      <GameHUD
        setup={setup}
        mode={mode}
        arena={arena}
        difficulty={difficulty}
        snapshot={snapshot}
        paused={paused}
        onPause={() => setPaused((value) => !value)}
        onRestart={restart}
      />
      <GameCanvas
        setup={setup}
        mode={mode}
        arena={arena}
        difficulty={difficulty}
        restartKey={restartKey}
        paused={paused}
        onSnapshot={setSnapshot}
        onGameOver={handleGameOver}
      />
      <GameOverModal result={result} onPlayAgain={restart} />
    </main>
  );
}
