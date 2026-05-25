import { Button } from "@/components/Button";
import { Layout } from "@/components/Layout";
import { RulesContent } from "@/components/RulesContent";

export default function RulesPage() {
  return (
    <Layout>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Rules</h1>
          <p className="mt-3 text-slate-300">How multi-side Pong matches work.</p>
        </div>
        <Button href="/setup">Start Game</Button>
      </div>
      <RulesContent />
    </Layout>
  );
}
