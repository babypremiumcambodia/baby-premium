"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useCartStore } from "@/lib/cartStore";

export default function OrderSummary() {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 2.5 : 0;
  const total = subtotal + deliveryFee;
  const lovePoints = Math.floor(total);

  return (
    <GlassCard className="mt-6">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="mt-4 rounded-2xl bg-gold/10 p-3 text-center">
          ❤️ Earn <strong>{lovePoints}</strong> Love Points
        </div>
      </div>
    </GlassCard>
  );
}