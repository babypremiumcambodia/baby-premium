import Link from "next/link";
import {
  Heart,
  Gift,
  Package,
  ChevronRight,
  User,
  Truck,
} from "lucide-react";

import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">My Profile</h1>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <User className="h-8 w-8 text-gold" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Guest User</h2>
              <p className="text-gray-500">Welcome to Baby Premium+</p>
            </div>
          </div>
        </GlassCard>

        <Link href="/wishlist">
          <GlassCard className="mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-semibold">My Wishlist</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/orders">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-gold" />
                <span className="font-semibold">My Orders</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/track-order">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-gold" />
                <span className="font-semibold">Track Order</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/gifts">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6 text-gold" />
                <span className="font-semibold">Thank You Gifts</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </GlassCard>
        </Link>
      </div>

      <BottomNavigation />
    </main>
  );
}