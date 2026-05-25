export type BallSpeed = "1x" | "2x" | "3x";
export type GameMode = "player" | "computer";
export type SideCount = 2 | 3 | 4;
export type Difficulty = "easy" | "medium" | "hard";
export type PaddleSide = "left" | "right" | "top" | "bottom";

export interface UserSetup {
  name: string;
  username: string;
  ballColor: string;
  paddleColor: string;
  ballSpeed: BallSpeed;
}

export interface GameModeSelection {
  mode: GameMode;
  sides: SideCount;
}

export interface Arena {
  id: string;
  name: string;
  description: string;
  accent: string;
  background: string;
}

export interface DifficultyProfile {
  id: Difficulty;
  label: string;
  description: string;
  aiSpeed: number;
  reaction: number;
  accuracy: number;
  mistakeChance: number;
}

export interface SideState {
  side: PaddleSide;
  label: string;
  lives: number;
  active: boolean;
  human: boolean;
}

export interface GameSnapshot {
  sides: SideState[];
  status: string;
  paused: boolean;
}

export interface GameResult {
  winner: string;
  winnerSide: PaddleSide;
  finalLives: Record<PaddleSide, number>;
  summary: string;
}

export interface LeaderboardRecord {
  id: string;
  playerName: string;
  username: string;
  mode: GameMode;
  sides: SideCount;
  arena: string;
  difficulty: Difficulty;
  winner: string;
  dateTime: string;
  finalSummary: string;
}
