import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { supabase } from "@/lib/supabase";

export default async function OrdersPage() {
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="mt-2 text-gray-500">Your recent purchases</p>

        <div className="mt-6 space-y-4">
          {orders?.map((order) => (
            <GlassCard key={order.id}>
              <p className="text-lg font-bold">Order #{order.id}</p>

              <div className="mt-3">
                <StatusBadge status={order.status} />
              </div>

              <p className="mt-4 text-xl font-bold text-gold">
                ${Number(order.total).toFixed(2)}
              </p>

              <OrderTimeline status={order.status} />
            </GlassCard>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}