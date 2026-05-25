"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { clearLeaderboard, getLeaderboard } from "@/lib/leaderboard";
import type { LeaderboardRecord } from "@/types/game";

export function LeaderboardTable() {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => setRecords(getLeaderboard()));
  }, []);

  function clear() {
    clearLeaderboard();
    setRecords([]);
  }

  if (records.length === 0) {
    return (
      <div className="neon-card rounded-xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-white">No matches saved yet</h2>
        <p className="mt-2 text-slate-300">Complete a match to store your first result locally.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/setup">Start Game</Button>
          <Button href="/" variant="ghost">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-slate-300">{records.length} saved match records</p>
        <div className="flex gap-3">
          <Button href="/" variant="ghost">
            Home
          </Button>
          <Button onClick={clear} variant="danger">
            Clear Leaderboard
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[860px] w-full border-collapse bg-slate-950/70 text-left text-sm">
          <thead className="bg-white/8 text-xs uppercase text-slate-300">
            <tr>
              {["Player", "Mode", "Sides", "Arena", "Difficulty", "Winner", "Date", "Final lives"].map((head) => (
                <th key={head} className="px-4 py-3 font-bold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <span className="block font-bold text-white">{record.playerName}</span>
                  <span className="text-slate-400">@{record.username}</span>
                </td>
                <td className="px-4 py-3 capitalize text-slate-200">{record.mode}</td>
                <td className="px-4 py-3 text-slate-200">{record.sides}</td>
                <td className="px-4 py-3 text-slate-200">{record.arena}</td>
                <td className="px-4 py-3 capitalize text-slate-200">{record.difficulty}</td>
                <td className="px-4 py-3 font-bold text-cyan-200">{record.winner}</td>
                <td className="px-4 py-3 text-slate-300">
                  {new Date(record.dateTime).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-300">{record.finalSummary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
