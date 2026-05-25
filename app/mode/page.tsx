import { Layout } from "@/components/Layout";
import { ModeSelector } from "@/components/ModeSelector";

export default function ModePage() {
  return (
    <Layout>
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-white">Choose Mode</h1>
        <p className="mt-3 text-slate-300">Select player control style and active sides.</p>
      </div>
      <ModeSelector />
    </Layout>
  );
}
