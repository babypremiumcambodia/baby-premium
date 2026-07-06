"use client";

import Image from "next/image";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import { useCartStore } from "@/lib/cartStore";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Shopping Cart</h1>

        {items.length === 0 ? (
          <GlassCard className="mt-6">
            <p className="font-semibold">Your cart is empty</p>
          </GlassCard>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />

                  <div className="flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <div className="mt-2 flex items-center gap-3">
  <button
    onClick={() => decreaseItem(item.id)}
    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
  >
    <Minus className="h-4 w-4" />
  </button>

  <span className="font-semibold">{item.quantity}</span>

  <button
    onClick={() => increaseItem(item.id)}
    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
  >
    <Plus className="h-4 w-4" />
  </button>
</div>
                    <p className="mt-1 font-bold text-gold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}

            <GlassCard>
              <div className="flex justify-between text-xl font-bold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Link
  href="/checkout"
  className="mt-5 block w-full rounded-full bg-gold py-4 text-center font-semibold text-white"
>
  Checkout
</Link>
            </GlassCard>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}