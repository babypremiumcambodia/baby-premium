import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { supabase } from "@/lib/supabase";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Orders</h1>

          <span className="rounded-full bg-gold px-4 py-2 text-white">
            {orders?.length ?? 0} Orders
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {orders?.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
            >
              <GlassCard className="cursor-pointer transition hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {order.customer_name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.phone}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gold">
                      ${Number(order.total).toFixed(2)}
                    </p>

                    <div className="mt-2">
  <StatusBadge status={order.status} />
</div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}