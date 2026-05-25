import { Layout } from "@/components/Layout";
import { LeaderboardTable } from "@/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white">Leaderboard</h1>
        <p className="mt-3 text-slate-300">Newest local match records appear first.</p>
      </div>
      <LeaderboardTable />
    </Layout>
  );
}
