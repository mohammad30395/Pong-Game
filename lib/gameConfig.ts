import { ARENAS, DIFFICULTIES, SIDE_ORDER, STORAGE_KEYS } from "@/lib/constants";
import { readStorage } from "@/lib/storage";
import type {
  Arena,
  Difficulty,
  DifficultyProfile,
  GameModeSelection,
  PaddleSide,
  SideCount,
  UserSetup,
} from "@/types/game";

export function getActiveSides(count: SideCount): PaddleSide[] {
  return SIDE_ORDER.slice(0, count);
}

export function getArena(id?: string | null): Arena {
  return ARENAS.find((arena) => arena.id === id) ?? ARENAS[0];
}

export function getDifficulty(id?: Difficulty | null): DifficultyProfile {
  return DIFFICULTIES.find((difficulty) => difficulty.id === id) ?? DIFFICULTIES[0];
}

export function loadSetup() {
  return readStorage<UserSetup | null>(STORAGE_KEYS.setup, null);
}

export function loadMode() {
  return readStorage<GameModeSelection | null>(STORAGE_KEYS.mode, null);
}

export function loadArenaId() {
  return readStorage<string | null>(STORAGE_KEYS.arena, null);
}

export function loadDifficultyId() {
  return readStorage<Difficulty | null>(STORAGE_KEYS.difficulty, null);
}
