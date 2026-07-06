import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import { Gift } from "lucide-react";

export default function GiftsPage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Thank You Gifts</h1>

        <p className="mt-2 text-gray-500">
          Redeem your Love Points for exclusive gifts.
        </p>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gold/20 p-4">
              <Gift className="h-8 w-8 text-gold" />
            </div>

            <div>
              <h2 className="font-bold">Baby Gift Set</h2>
              <p className="text-sm text-gray-500">
                Requires 500 Love Points
              </p>
            </div>
          </div>

          <button className="mt-6 w-full rounded-full bg-gold py-3 font-semibold text-white">
            Redeem
          </button>
        </GlassCard>
      </div>

      <BottomNavigation />
    </main>
  );
}