"use client";

import { useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { supabase } from "@/lib/supabase";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    setError("");
    setOrder(null);

    if (!orderId.trim()) {
      setError("Please enter your order ID.");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", Number(orderId))
      .single();

    if (error || !data) {
      setError("Order not found.");
      return;
    }

    setOrder(data);
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Track Order</h1>

        <p className="mt-2 text-gray-500">
          Enter your order number to check status.
        </p>

        <GlassCard className="mt-6 space-y-4">
          <input
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full rounded-full bg-white/70 px-5 py-4 outline-none"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="w-full rounded-full bg-gold py-4 font-semibold text-white"
          >
            Track Order
          </button>
        </GlassCard>

        {error && (
          <p className="mt-4 text-center text-red-500">
            {error}
          </p>
        )}

        {order && (
          <GlassCard className="mt-6">
            <p className="text-lg font-bold">
              Order #{order.id}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customer: {order.customer_name}
            </p>

            <p className="text-sm text-gray-500">
              Phone: {order.phone}
            </p>

            <div className="mt-4">
              <StatusBadge status={order.status} />
            </div>

            <p className="mt-4 text-xl font-bold text-gold">
              Total: ${Number(order.total).toFixed(2)}
            </p>

            <OrderTimeline status={order.status} />
          </GlassCard>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}