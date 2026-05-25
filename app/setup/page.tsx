import { Card } from "@/components/Card";
import { Layout } from "@/components/Layout";
import { SetupForm } from "@/components/SetupForm";

export default function SetupPage() {
  return (
    <Layout>
      <Card className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-white">Player Setup</h1>
          <p className="mt-3 text-slate-300">Create the profile and visual style for this session.</p>
        </div>
        <SetupForm />
      </Card>
    </Layout>
  );
}
