import { DifficultySelector } from "@/components/DifficultySelector";
import { Layout } from "@/components/Layout";

export default function DifficultyPage() {
  return (
    <Layout>
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-white">Choose Difficulty</h1>
        <p className="mt-3 text-slate-300">Difficulty changes AI reaction, tracking, and mistake rate.</p>
      </div>
      <DifficultySelector />
    </Layout>
  );
}
