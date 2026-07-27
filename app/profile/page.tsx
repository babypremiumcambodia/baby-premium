"use client";

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
import { useCustomer } from "@/hooks/useCustomer";

export default function ProfilePage() {
  const { customer, loading } = useCustomer();

  const displayName = loading
    ? "Loading..."
    : customer
      ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
        customer.username ||
        "Baby Premium Member"
      : "Guest User";

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">My Profile</h1>

        {/* Customer Card */}
        <GlassCard className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <User className="h-8 w-8 text-gold" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {displayName}
              </h2>

              {customer?.username && (
                <p className="text-sm text-gray-500">
                  @{customer.username}
                </p>
              )}

              <p className="mt-2 font-semibold text-gold">
                {customer?.love_points ?? 0} Love Points
              </p>

              {/* Debug */}
              <p className="mt-2 text-xs text-gray-400">
                Debug: {customer ? customer.telegram_user_id : "No customer detected"}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Wishlist */}
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

        {/* Orders */}
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

        {/* Track Order */}
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

        {/* Gifts */}
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