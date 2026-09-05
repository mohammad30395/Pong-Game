# Neon Pong Circuit

Neon Pong Circuit is a frontend-only arcade Pong game built with Next.js, React, TypeScript, Tailwind CSS, and Phaser. The game expands classic two-player Pong into configurable two-, three-, and four-sided matches with player setup, AI difficulty, arena selection, touch controls, and a local leaderboard.

## Features

- Multi-stage game setup flow for player profile, game mode, arena, and difficulty
- Two game modes:
  - Player Mode: active paddles are controlled by human players
  - Computer Mode: the user controls the left paddle while AI controls the other active sides
- Two-, three-, and four-sided Pong matches
- Six visual arenas: Classic Neon, Space Arena, Football Field, Cyber Grid, Minimal Dark, and Ocean Blue
- Three AI difficulty levels: Easy, Medium, and Hard
- Custom ball color, paddle color, and ball speed
- Keyboard, pointer, and touch-friendly controls
- Match HUD with lives, status, pause, and restart controls
- Game-over modal with play-again flow
- Local leaderboard stored in browser `localStorage`
- Responsive neon arcade UI

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Phaser](https://phaser.io/) for the game runtime
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## How to Play

1. Start from the home page.
2. Create a player profile with name, username, ball color, paddle color, and ball speed.
3. Choose Player Mode or Computer Mode.
4. Select whether the match uses 2, 3, or 4 active sides.
5. Pick an arena.
6. Choose a difficulty level.
7. Play until only one side remains active.

Each active side starts with 3 lives. When the ball exits through a side, that side loses 1 life. A side with 0 lives is disqualified, and the last active side wins.

## Controls

| Side | Keyboard Controls |
| --- | --- |
| Left | `W` / `S` |
| Right | `Arrow Up` / `Arrow Down` |
| Top | `A` / `D` |
| Bottom | `J` / `L` |

Touch and pointer controls are also available during gameplay for human-controlled paddles.

## Project Structure

```text
.
+-- app/                    # Next.js app router pages and global styles
|   +-- page.tsx            # Home page
|   +-- setup/              # Player setup route
|   +-- mode/               # Mode and side-count route
|   +-- arena/              # Arena selection route
|   +-- difficulty/         # Difficulty selection route
|   +-- game/               # Main game route
|   +-- leaderboard/        # Saved match records route
|   +-- rules/              # Game rules route
+-- components/             # Reusable UI and game components
|   +-- GameCanvas.tsx      # Phaser game scene and controls
|   +-- GameHUD.tsx         # Match status and controls
|   +-- SetupForm.tsx       # Player profile form
|   +-- ...
+-- lib/                    # Game constants, config helpers, storage, leaderboard
+-- types/                  # Shared TypeScript game types
+-- package.json            # Scripts and dependencies
+-- tsconfig.json           # TypeScript configuration
```

## Data Storage

This project does not require a backend. Setup choices and leaderboard records are saved in the browser using `localStorage`.

Stored keys:

- `pong_user_setup`
- `pong_game_mode`
- `pong_arena`
- `pong_difficulty`
- `pong_leaderboard`

Clearing browser site data will remove saved profiles and leaderboard records.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/setup` | Player profile and customization |
| `/mode` | Game mode and side-count selection |
| `/arena` | Arena selection |
| `/difficulty` | Difficulty selection |
| `/game` | Active Pong match |
| `/leaderboard` | Local match history |
| `/rules` | Gameplay rules and controls |

## Notes

- The app is client-heavy because Phaser runs in the browser.
- Match records are local to the current browser and device.
- The game route redirects to setup if required local setup data is missing.
