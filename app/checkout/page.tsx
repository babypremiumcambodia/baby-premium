"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import OrderSummary from "@/components/checkout/OrderSummary";
import EnableNotifications from "@/components/telegram/EnableNotifications";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/cartStore";
import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const telegramUser = useTelegramUser();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    delivery_note: "",
    latitude: null as number | null,
    longitude: null as number | null,
    location_status: "",
    payment_method: "Cash on Delivery",
  });

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setForm((prev) => ({
        ...prev,
        location_status: "Location is not supported on this device.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location_status: "✅ Location shared successfully",
        }));
      },
      () => {
        setForm((prev) => ({
          ...prev,
          location_status:
            "⚠️ Could not get location. You can still place the order.",
        }));
      }
    );
  }

  async function handlePlaceOrder() {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: form.customer_name,
        phone: form.phone,
        address: form.address,
        delivery_note: form.delivery_note,
        latitude: form.latitude,
        longitude: form.longitude,
        telegram_chat_id: telegramUser?.id ? String(telegramUser.id) : null,
        payment_method: form.payment_method,
        total: subtotal,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      alert(orderError.message);
      return;
    }

    const orderNumber = `BP${String(order.id).padStart(5, "0")}`;

    await supabase
      .from("orders")
      .update({ order_number: orderNumber })
      .eq("id", order.id);

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      alert(itemsError.message);
      return;
    }

    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (productError) {
        alert(productError.message);
        return;
      }

      const newStock = Number(product.stock) - item.quantity;

      if (newStock < 0) {
        alert(`${item.name} does not have enough stock.`);
        return;
      }

      const { error: stockError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.id);

      if (stockError) {
        alert(stockError.message);
        return;
      }
    }

    await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderNumber,
        customer: form.customer_name,
        phone: form.phone,
        address: form.address,
        total: subtotal.toFixed(2),
        paymentMethod: form.payment_method,
      }),
    });

    clearCart();

    if (form.payment_method === "KHQR") {
      router.push(`/payment/khqr?order=${order.id}`);
    } else {
      router.push("/order-success");
    }
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Checkout</h1>
        <p className="mt-2 text-gray-500">Delivery and payment details</p>

        <GlassCard className="mt-6 space-y-4">
          <input placeholder="Full Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full rounded-full bg-white/70 px-5 py-4 outline-none" />
          <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-full bg-white/70 px-5 py-4 outline-none" />
          <input placeholder="Address / Landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-full bg-white/70 px-5 py-4 outline-none" />

          <textarea placeholder="Delivery Note (optional)" value={form.delivery_note} onChange={(e) => setForm({ ...form, delivery_note: e.target.value })} className="h-28 w-full rounded-3xl bg-white/70 px-5 py-4 outline-none" />

          <button type="button" onClick={handleShareLocation} className="w-full rounded-full border border-gold py-4 font-semibold text-gold">
            📍 Share My Location
          </button>

          {form.location_status && (
            <p className="text-center text-sm text-gray-500">
              {form.location_status}
            </p>
          )}
        </GlassCard>

        <GlassCard className="mt-6">
          <h2 className="mb-4 text-lg font-bold">Payment Method</h2>

          <div className="space-y-3">
            {["Cash on Delivery", "KHQR", "ABA Bank", "ACLEDA Bank"].map((method) => (
              <label key={method} className="flex cursor-pointer items-center gap-3">
                <input type="radio" name="payment" value={method} checked={form.payment_method === method} onChange={() => setForm({ ...form, payment_method: method })} />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        <OrderSummary />

        <EnableNotifications />

        <button type="button" onClick={handlePlaceOrder} className="mt-6 w-full rounded-full bg-gold py-4 font-semibold text-white">
          Place Order
        </button>
      </div>

      <BottomNavigation />
    </main>
  );
}