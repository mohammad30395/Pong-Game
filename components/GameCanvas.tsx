"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef } from "react";
import type Phaser from "phaser";
import type { Arena, DifficultyProfile, GameModeSelection, GameResult, GameSnapshot, PaddleSide, SideState, UserSetup } from "@/types/game";
import { getActiveSides } from "@/lib/gameConfig";

type Direction = -1 | 0 | 1;
type TouchInput = Partial<Record<PaddleSide, Direction>>;

const WIDTH = 960;
const HEIGHT = 540;
const BALL_RADIUS = 9;
const VERTICAL_PADDLE = { width: 14, height: 104 };
const HORIZONTAL_PADDLE = { width: 126, height: 14 };
const PADDLE_MARGIN = 28;

const keyHints: Record<PaddleSide, string> = {
  left: "W / S",
  right: "↑ / ↓",
  top: "A / D",
  bottom: "J / L",
};

export function GameCanvas({
  setup,
  mode,
  arena,
  difficulty,
  restartKey,
  paused,
  onSnapshot,
  onGameOver,
}: {
  setup: UserSetup;
  mode: GameModeSelection;
  arena: Arena;
  difficulty: DifficultyProfile;
  restartKey: number;
  paused: boolean;
  onSnapshot: Dispatch<SetStateAction<GameSnapshot>>;
  onGameOver: (result: GameResult) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const touchRef = useRef<TouchInput>({});
  const gameOverRef = useRef(false);

  const activeSides = useMemo(() => getActiveSides(mode.sides), [mode.sides]);
  const humanSides = useMemo(
    () => activeSides.filter((side) => mode.mode === "player" || side === "left"),
    [activeSides, mode.mode],
  );

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!hostRef.current || typeof window === "undefined") return;
      const PhaserModule = await import("phaser");
      const PhaserRuntime = PhaserModule.default ?? PhaserModule;
      if (cancelled || !hostRef.current) return;

      gameOverRef.current = false;
      const initialSides = createInitialSides(activeSides, humanSides, setup.name, mode.mode);
      onSnapshot({
        sides: initialSides,
        status: "First rally armed. Defend your active sides.",
        paused: false,
      });

      class PongScene extends PhaserRuntime.Scene {
        private ball!: Phaser.GameObjects.Arc;
        private paddles = new Map<PaddleSide, Phaser.GameObjects.Rectangle>();
        private states = initialSides.map((side) => ({ ...side }));
        private velocity = { x: 0, y: 0 };
        private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
        private keys!: Record<string, Phaser.Input.Keyboard.Key>;
        private aiTargets = new Map<PaddleSide, number>();
        private aiTimer = 0;
        private status = "Rally in progress.";

        constructor() {
          super("PongScene");
        }

        create() {
          drawArena(this, arena);
          this.ball = this.add.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, Number.parseInt(setup.ballColor.slice(1), 16));
          this.ball.setStrokeStyle(2, 0xffffff, 0.6);
          this.cursors = this.input.keyboard?.createCursorKeys();
          this.keys = this.input.keyboard?.addKeys("W,S,A,D,J,L") as Record<string, Phaser.Input.Keyboard.Key>;
          this.createPaddles();
          this.resetBall();
          this.publish();
        }

        update(_: number, delta: number) {
          const dt = delta / 1000;
          this.movePaddles(dt);
          this.moveBall(dt);
        }

        private createPaddles() {
          activeSides.forEach((side) => {
            const horizontal = side === "top" || side === "bottom";
            const size = horizontal ? HORIZONTAL_PADDLE : VERTICAL_PADDLE;
            const position = paddleStart(side);
            const paddle = this.add.rectangle(
              position.x,
              position.y,
              size.width,
              size.height,
              Number.parseInt(setup.paddleColor.slice(1), 16),
              1,
            );
            paddle.setStrokeStyle(2, 0xffffff, 0.55);
            this.paddles.set(side, paddle);
          });
        }

        private movePaddles(dt: number) {
          this.aiTimer += dt;
          this.states.forEach((state) => {
            const paddle = this.paddles.get(state.side);
            if (!paddle || !state.active) return;

            const horizontal = state.side === "top" || state.side === "bottom";
            const direction = state.human ? this.humanDirection(state.side) : this.aiDirection(state.side, horizontal);
            const speed = state.human ? 390 : difficulty.aiSpeed;

            if (horizontal) {
              paddle.x = PhaserRuntime.Math.Clamp(
                paddle.x + direction * speed * dt,
                HORIZONTAL_PADDLE.width / 2 + 14,
                WIDTH - HORIZONTAL_PADDLE.width / 2 - 14,
              );
            } else {
              paddle.y = PhaserRuntime.Math.Clamp(
                paddle.y + direction * speed * dt,
                VERTICAL_PADDLE.height / 2 + 14,
                HEIGHT - VERTICAL_PADDLE.height / 2 - 14,
              );
            }
          });
        }

        private humanDirection(side: PaddleSide): Direction {
          const touch = touchRef.current[side] ?? 0;
          if (touch !== 0) return touch;

          if (side === "left") return boolDir(this.keys.W?.isDown, this.keys.S?.isDown);
          if (side === "right") return boolDir(this.cursors?.up?.isDown, this.cursors?.down?.isDown);
          if (side === "top") return boolDir(this.keys.A?.isDown, this.keys.D?.isDown);
          return boolDir(this.keys.J?.isDown, this.keys.L?.isDown);
        }

        private aiDirection(side: PaddleSide, horizontal: boolean): Direction {
          const targetAxis = horizontal ? this.ball.x : this.ball.y;
          if (!this.aiTargets.has(side) || this.aiTimer >= difficulty.reaction) {
            const miss = Math.random() < difficulty.mistakeChance;
            const error = miss ? PhaserRuntime.Math.Between(-difficulty.accuracy * 3, difficulty.accuracy * 3) : PhaserRuntime.Math.Between(-difficulty.accuracy, difficulty.accuracy);
            this.aiTargets.set(side, targetAxis + error);
            this.aiTimer = 0;
          }

          const paddle = this.paddles.get(side);
          if (!paddle) return 0;
          const current = horizontal ? paddle.x : paddle.y;
          const target = this.aiTargets.get(side) ?? targetAxis;
          if (Math.abs(current - target) < 8) return 0;
          return current < target ? 1 : -1;
        }

        private moveBall(dt: number) {
          this.ball.x += this.velocity.x * dt;
          this.ball.y += this.velocity.y * dt;
          this.handlePaddleCollision();
          this.handleBoundaries();
        }

        private handlePaddleCollision() {
          const left = this.paddles.get("left");
          if (left && this.isActive("left") && this.velocity.x < 0 && this.ball.x - BALL_RADIUS <= left.x + VERTICAL_PADDLE.width / 2 && this.ball.x > left.x) {
            if (within(this.ball.y, left.y, VERTICAL_PADDLE.height / 2 + BALL_RADIUS)) this.reflectVertical(left, 1);
          }

          const right = this.paddles.get("right");
          if (right && this.isActive("right") && this.velocity.x > 0 && this.ball.x + BALL_RADIUS >= right.x - VERTICAL_PADDLE.width / 2 && this.ball.x < right.x) {
            if (within(this.ball.y, right.y, VERTICAL_PADDLE.height / 2 + BALL_RADIUS)) this.reflectVertical(right, -1);
          }

          const top = this.paddles.get("top");
          if (top && this.isActive("top") && this.velocity.y < 0 && this.ball.y - BALL_RADIUS <= top.y + HORIZONTAL_PADDLE.height / 2 && this.ball.y > top.y) {
            if (within(this.ball.x, top.x, HORIZONTAL_PADDLE.width / 2 + BALL_RADIUS)) this.reflectHorizontal(top, 1);
          }

          const bottom = this.paddles.get("bottom");
          if (bottom && this.isActive("bottom") && this.velocity.y > 0 && this.ball.y + BALL_RADIUS >= bottom.y - HORIZONTAL_PADDLE.height / 2 && this.ball.y < bottom.y) {
            if (within(this.ball.x, bottom.x, HORIZONTAL_PADDLE.width / 2 + BALL_RADIUS)) this.reflectHorizontal(bottom, -1);
          }
        }

        private reflectVertical(paddle: Phaser.GameObjects.Rectangle, xDirection: 1 | -1) {
          const offset = (this.ball.y - paddle.y) / (VERTICAL_PADDLE.height / 2);
          const speed = currentSpeed(setup.ballSpeed, this.velocity);
          this.velocity.x = Math.abs(speed * 0.88) * xDirection;
          this.velocity.y = speed * 0.46 * PhaserRuntime.Math.Clamp(offset, -1, 1);
          this.ball.x = paddle.x + xDirection * (VERTICAL_PADDLE.width / 2 + BALL_RADIUS + 2);
        }

        private reflectHorizontal(paddle: Phaser.GameObjects.Rectangle, yDirection: 1 | -1) {
          const offset = (this.ball.x - paddle.x) / (HORIZONTAL_PADDLE.width / 2);
          const speed = currentSpeed(setup.ballSpeed, this.velocity);
          this.velocity.y = Math.abs(speed * 0.88) * yDirection;
          this.velocity.x = speed * 0.46 * PhaserRuntime.Math.Clamp(offset, -1, 1);
          this.ball.y = paddle.y + yDirection * (HORIZONTAL_PADDLE.height / 2 + BALL_RADIUS + 2);
        }

        private handleBoundaries() {
          if (this.ball.x < -BALL_RADIUS) return this.boundary("left");
          if (this.ball.x > WIDTH + BALL_RADIUS) return this.boundary("right");
          if (this.ball.y < -BALL_RADIUS) return this.boundary("top");
          if (this.ball.y > HEIGHT + BALL_RADIUS) return this.boundary("bottom");

          if (this.ball.y <= BALL_RADIUS && !this.isScoringSide("top")) this.velocity.y = Math.abs(this.velocity.y);
          if (this.ball.y >= HEIGHT - BALL_RADIUS && !this.isScoringSide("bottom")) this.velocity.y = -Math.abs(this.velocity.y);
          if (this.ball.x <= BALL_RADIUS && !this.isScoringSide("left")) this.velocity.x = Math.abs(this.velocity.x);
          if (this.ball.x >= WIDTH - BALL_RADIUS && !this.isScoringSide("right")) this.velocity.x = -Math.abs(this.velocity.x);
        }

        private boundary(side: PaddleSide) {
          if (!this.isScoringSide(side)) {
            this.resetBall(side);
            return;
          }

          const state = this.states.find((item) => item.side === side);
          if (!state) return;
          state.lives = Math.max(0, state.lives - 1);
          if (state.lives === 0) {
            state.active = false;
            this.paddles.get(side)?.setAlpha(0.22);
            this.status = `${state.label} was disqualified.`;
          } else {
            this.status = `${state.label} lost a life.`;
          }

          const alive = this.states.filter((item) => item.active);
          this.publish();
          if (alive.length === 1) {
            const winner = alive[0];
            const finalLives = Object.fromEntries(this.states.map((item) => [item.side, item.lives])) as Record<PaddleSide, number>;
            gameOverRef.current = true;
            this.scene.pause();
            onGameOver({
              winner: winner.label,
              winnerSide: winner.side,
              finalLives,
              summary: this.states.map((item) => `${item.side}: ${item.lives}`).join(" | "),
            });
            return;
          }

          this.resetBall(side);
        }

        private resetBall(lostSide?: PaddleSide) {
          this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
          const speed = baseSpeed(setup.ballSpeed);
          const angle = PhaserRuntime.Math.FloatBetween(-0.72, 0.72);
          const dirX = lostSide === "left" ? 1 : lostSide === "right" ? -1 : PhaserRuntime.Math.RND.pick([-1, 1]);
          const dirY = lostSide === "top" ? 1 : lostSide === "bottom" ? -1 : PhaserRuntime.Math.RND.pick([-1, 1]);
          this.velocity.x = Math.cos(angle) * speed * dirX;
          this.velocity.y = Math.sin(angle) * speed + dirY * speed * 0.18;
        }

        private isActive(side: PaddleSide) {
          return this.states.some((state) => state.side === side && state.active);
        }

        private isScoringSide(side: PaddleSide) {
          return activeSides.includes(side) && this.isActive(side);
        }

        private publish() {
          onSnapshot({
            sides: this.states.map((side) => ({ ...side })),
            status: this.status,
            paused: false,
          });
        }
      }

      gameRef.current = new PhaserRuntime.Game({
        type: PhaserRuntime.AUTO,
        parent: hostRef.current,
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: arena.background,
        scale: {
          mode: PhaserRuntime.Scale.FIT,
          autoCenter: PhaserRuntime.Scale.CENTER_BOTH,
        },
        scene: PongScene,
      });
    }

    start();

    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [activeSides, arena, difficulty, humanSides, mode.mode, onGameOver, onSnapshot, restartKey, setup]);

  useEffect(() => {
    const scene = gameRef.current?.scene.getScene("PongScene");
    if (!scene || gameOverRef.current) return;
    if (paused) scene.scene.pause();
    else scene.scene.resume();
    onSnapshot((previous) => ({
      ...previous,
      paused,
      status: paused ? "Match paused." : previous.status === "Match paused." ? "Rally resumed." : previous.status,
    }));
  }, [onSnapshot, paused]);

  function setTouch(side: PaddleSide, direction: Direction) {
    touchRef.current = { ...touchRef.current, [side]: direction };
  }

  return (
    <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-2">
      <div
        ref={hostRef}
        className="game-canvas-wrap min-h-0 rounded-2xl border border-cyan-300/24 bg-slate-950/70 shadow-[0_0_34px_rgba(34,211,238,0.16)]"
      />
      <div className="grid shrink-0 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {humanSides.map((side) => (
          <div key={side} className="grid grid-cols-[1fr_auto_auto] items-center gap-1.5 rounded-lg border border-white/10 bg-white/6 px-2 py-1.5">
            <span className="truncate text-xs font-bold uppercase text-slate-300">
              {side} <span className="text-slate-500">{keyHints[side]}</span>
            </span>
            <button
              aria-label={`${side} negative`}
              className="h-8 rounded-md border border-white/10 bg-white/10 px-3 text-sm font-bold text-white"
              onPointerDown={() => setTouch(side, -1)}
              onPointerUp={() => setTouch(side, 0)}
              onPointerLeave={() => setTouch(side, 0)}
            >
              {side === "left" || side === "right" ? "Up" : "Left"}
            </button>
            <button
              aria-label={`${side} positive`}
              className="h-8 rounded-md border border-white/10 bg-white/10 px-3 text-sm font-bold text-white"
              onPointerDown={() => setTouch(side, 1)}
              onPointerUp={() => setTouch(side, 0)}
              onPointerLeave={() => setTouch(side, 0)}
            >
              {side === "left" || side === "right" ? "Down" : "Right"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function createInitialSides(activeSides: PaddleSide[], humanSides: PaddleSide[], playerName: string, mode: string): SideState[] {
  return activeSides.map((side, index) => ({
    side,
    label: side === "left" ? `${playerName} (Left)` : mode === "player" ? `Player ${index + 1} (${title(side)})` : `AI ${title(side)}`,
    lives: 3,
    active: true,
    human: humanSides.includes(side),
  }));
}

function paddleStart(side: PaddleSide) {
  if (side === "left") return { x: PADDLE_MARGIN, y: HEIGHT / 2 };
  if (side === "right") return { x: WIDTH - PADDLE_MARGIN, y: HEIGHT / 2 };
  if (side === "top") return { x: WIDTH / 2, y: PADDLE_MARGIN };
  return { x: WIDTH / 2, y: HEIGHT - PADDLE_MARGIN };
}

function baseSpeed(speed: UserSetup["ballSpeed"]) {
  return speed === "3x" ? 560 : speed === "2x" ? 450 : 350;
}

function currentSpeed(speed: UserSetup["ballSpeed"], velocity: { x: number; y: number }) {
  return Math.max(baseSpeed(speed), Math.hypot(velocity.x, velocity.y) * 1.025);
}

function boolDir(negative?: boolean, positive?: boolean): Direction {
  if (negative && !positive) return -1;
  if (positive && !negative) return 1;
  return 0;
}

function within(value: number, center: number, half: number) {
  return value >= center - half && value <= center + half;
}

function title(side: PaddleSide) {
  return side.charAt(0).toUpperCase() + side.slice(1);
}

function drawArena(scene: Phaser.Scene, arena: Arena) {
  const accent = Number.parseInt(arena.accent.slice(1), 16);
  scene.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, Number.parseInt(arena.background.slice(1), 16));
  const graphics = scene.add.graphics();
  graphics.lineStyle(2, accent, 0.32);
  for (let x = 60; x < WIDTH; x += 60) graphics.lineBetween(x, 0, x, HEIGHT);
  for (let y = 60; y < HEIGHT; y += 60) graphics.lineBetween(0, y, WIDTH, y);
  graphics.lineStyle(4, accent, 0.8);
  graphics.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);
  graphics.lineStyle(2, 0xffffff, 0.28);
  graphics.lineBetween(WIDTH / 2, 18, WIDTH / 2, HEIGHT - 18);
  graphics.strokeCircle(WIDTH / 2, HEIGHT / 2, 58);
}
