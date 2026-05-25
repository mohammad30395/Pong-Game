import { ArenaSelector } from "@/components/ArenaSelector";
import { Layout } from "@/components/Layout";

export default function ArenaPage() {
  return (
    <Layout>
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-white">Choose Arena</h1>
        <p className="mt-3 text-slate-300">Pick a visual arena for the match canvas.</p>
      </div>
      <ArenaSelector />
    </Layout>
  );
}
