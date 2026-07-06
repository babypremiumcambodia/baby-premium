import { Crown, Heart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function LovePointsCard() {
  return (
    <GlassCard className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gold">
            <Crown className="h-4 w-4" />
            BABY PREMIUM+
          </p>

          <p className="mt-5 text-sm text-gray-500">Love Points</p>

          <h2 className="mt-1 flex items-center gap-3 text-5xl font-bold">
            <Heart className="h-10 w-10 fill-red-500 text-red-500" />
            245 LP
          </h2>
        </div>

        <div className="glass flex h-16 w-16 items-center justify-center rounded-full">
          <Crown className="h-8 w-8 text-gold" />
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/50">
        <div className="h-full w-[82%] rounded-full bg-gold" />
      </div>

      <p className="mt-3 text-sm text-gray-500">
        55 LP remaining to unlock your Thank You Gift
      </p>
    </GlassCard>
  );
}