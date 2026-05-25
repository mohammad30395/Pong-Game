import type { Arena, DifficultyProfile, PaddleSide } from "@/types/game";

export const STORAGE_KEYS = {
  setup: "pong_user_setup",
  mode: "pong_game_mode",
  arena: "pong_arena",
  difficulty: "pong_difficulty",
  leaderboard: "pong_leaderboard",
} as const;

export const SIDE_ORDER: PaddleSide[] = ["left", "right", "top", "bottom"];

export const ARENAS: Arena[] = [
  {
    id: "classic-neon",
    name: "Classic Neon",
    description: "A crisp arcade court with bright cyan rails and magenta pulse lines.",
    accent: "#22d3ee",
    background: "#070a18",
  },
  {
    id: "space-arena",
    name: "Space Arena",
    description: "Deep space glass, star specks, and violet boundary glow.",
    accent: "#a78bfa",
    background: "#060816",
  },
  {
    id: "football-field",
    name: "Football Field",
    description: "Green pitch markings with tournament-style paddle lanes.",
    accent: "#84cc16",
    background: "#092013",
  },
  {
    id: "cyber-grid",
    name: "Cyber Grid",
    description: "Fast, angular grid energy for high-speed rallies.",
    accent: "#fb3fb4",
    background: "#10081a",
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Reduced visual noise for focused competitive play.",
    accent: "#e2e8f0",
    background: "#05060a",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Cool blue lanes, subtle wave traces, and electric white lines.",
    accent: "#38bdf8",
    background: "#061626",
  },
];

export const DIFFICULTIES: DifficultyProfile[] = [
  {
    id: "easy",
    label: "Easy",
    description: "Slower AI, looser tracking, and more mistakes.",
    aiSpeed: 235,
    reaction: 0.18,
    accuracy: 54,
    mistakeChance: 0.18,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Balanced AI speed, tracking, and recovery.",
    aiSpeed: 315,
    reaction: 0.1,
    accuracy: 30,
    mistakeChance: 0.08,
  },
  {
    id: "hard",
    label: "Hard",
    description: "Fast reactions, accurate tracking, and very few mistakes.",
    aiSpeed: 410,
    reaction: 0.04,
    accuracy: 12,
    mistakeChance: 0.025,
  },
];

export const DEFAULT_SETUP = {
  ballColor: "#22d3ee",
  paddleColor: "#fb3fb4",
  ballSpeed: "1x",
} as const;
