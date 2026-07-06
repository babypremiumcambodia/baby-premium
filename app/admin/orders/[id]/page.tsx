export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { supabase } from "@/lib/supabase";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", Number(id))
    .single();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", Number(id));

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="rounded-full bg-white p-3 shadow"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-4xl font-bold">
            Order #{order.id}
          </h1>
        </div>

        {/* Customer */}
        <GlassCard>
          <h2 className="text-xl font-bold">Customer Information</h2>

          <div className="mt-5 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">
                {order.customer_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{order.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p>{order.address}</p>
            </div>

            {order.delivery_note && (
              <div>
                <p className="text-sm text-gray-500">
                  Delivery Note
                </p>

                <p>{order.delivery_note}</p>
              </div>
            )}

            {order.latitude && order.longitude && (
              <>
                <div>
                  <p className="text-sm text-gray-500">
                    GPS Coordinates
                  </p>

                  <p>
                    {Number(order.latitude).toFixed(6)},{" "}
                    {Number(order.longitude).toFixed(6)}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full bg-gold py-3 text-center font-semibold text-white transition hover:opacity-90"
                >
                  📍 Open in Google Maps
                </a>
              </>
            )}
          </div>
        </GlassCard>

        {/* Items */}
        <GlassCard className="mt-5">
          <h2 className="text-xl font-bold">Order Items</h2>

          <div className="mt-5 space-y-4">
            {items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-none"
              >
                <div>
                  <p className="font-semibold">
                    {item.product_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-gold">
                  $
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Summary */}
        <GlassCard className="mt-5">
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>

            <span className="text-gold">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold">
              Order Status
            </h3>

            <OrderStatusSelect
              orderId={Number(order.id)}
              currentStatus={order.status}
            />
          </div>
        </GlassCard>
      </div>
    </main>
  );
}