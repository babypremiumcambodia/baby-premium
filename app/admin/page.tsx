import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  Gift,
  ClipboardCheck,
  Settings,
  ChevronRight,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const { count: rewardCount } = await supabase
    .from("reward_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("fulfilled", false);

  const { data: orders } = await supabase
    .from("orders")
    .select("total");

  const revenue =
    orders?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0;

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 py-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Manage your Baby Premium store
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <GlassCard>
            <p className="text-sm text-gray-500">Products</p>
            <p className="mt-2 text-3xl font-bold">
              {productCount ?? 0}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="mt-2 text-3xl font-bold">
              {orderCount ?? 0}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="mt-2 text-3xl font-bold">
              {customerCount ?? 0}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-sm text-gray-500">
              Gifts Waiting
            </p>
            <p className="mt-2 text-3xl font-bold text-gold">
              {rewardCount ?? 0}
            </p>
          </GlassCard>

          <GlassCard className="col-span-2">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="mt-2 text-3xl font-bold text-gold">
              ${revenue.toFixed(2)}
            </p>
          </GlassCard>
        </div>

        <div className="mt-8">
          <Link href="/admin/products">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Products
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>

          <Link href="/admin/orders">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Orders
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>

          <Link href="/admin/customers">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Users className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Customers
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>

          <Link href="/admin/rewards">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Rewards
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>

          <Link href="/admin/reward-redemptions">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ClipboardCheck className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Redeemed Gifts
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>

          <Link href="/admin/settings">
            <GlassCard className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Settings className="h-7 w-7 text-gold" />
                  <span className="font-semibold">
                    Settings
                  </span>
                </div>

                <ChevronRight />
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </main>
  );
}