import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Rewards</h1>
        <p className="mt-2 text-gray-500">Earn love points and gifts</p>

        <GlassCard className="mt-6">
          <p className="text-lg font-bold">❤️ Love Points</p>
          <p className="mt-2 text-gray-500">
            Collect points every time you shop with Baby Premium.
          </p>
        </GlassCard>
      </div>

      <BottomNavigation />
    </main>
  );
}