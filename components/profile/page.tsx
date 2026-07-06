import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import { User, Crown, Heart, Package } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="mt-2 text-gray-500">Baby Premium+ Member</p>

        <GlassCard className="mt-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/60">
            <User className="h-10 w-10 text-gold" />
          </div>

          <h2 className="mt-4 text-2xl font-bold">Guest Customer</h2>
          <p className="mt-1 text-gray-500">Welcome to Baby Premium+</p>
        </GlassCard>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <GlassCard>
            <Crown className="h-6 w-6 text-gold" />
            <p className="mt-3 text-sm text-gray-500">Member Level</p>
            <p className="font-bold">Gold</p>
          </GlassCard>

          <GlassCard>
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            <p className="mt-3 text-sm text-gray-500">Love Points</p>
            <p className="font-bold">245 LP</p>
          </GlassCard>

          <GlassCard>
            <Package className="h-6 w-6 text-gold" />
            <p className="mt-3 text-sm text-gray-500">Orders</p>
            <p className="font-bold">0</p>
          </GlassCard>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}