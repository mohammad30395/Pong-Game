import { Play, ScrollText, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import { HomeVisual } from "@/components/HomeVisual";
import { Layout } from "@/components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">
            Frontend arcade circuit
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Neon Pong Circuit
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-300">
            Configure your player profile, choose a mode, pick an arena, and battle through
            multi-side Pong matches with local leaderboard records.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/setup">
              <Play size={18} /> Start Game
            </Button>
            <Button href="/leaderboard" variant="secondary">
              <Trophy size={18} /> Leaderboard
            </Button>
            <Button href="/rules" variant="ghost">
              <ScrollText size={18} /> Rules
            </Button>
          </div>
        </div>
        <HomeVisual />
      </section>
    </Layout>
  );
}
