import { STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import type { LeaderboardRecord } from "@/types/game";

export function getLeaderboard(): LeaderboardRecord[] {
  return readStorage<LeaderboardRecord[]>(STORAGE_KEYS.leaderboard, []).sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
  );
}

export function saveLeaderboardRecord(record: LeaderboardRecord) {
  const records = getLeaderboard();
  writeStorage(STORAGE_KEYS.leaderboard, [record, ...records]);
}

export function clearLeaderboard() {
  writeStorage<LeaderboardRecord[]>(STORAGE_KEYS.leaderboard, []);
}
