"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import OrderSummary from "@/components/checkout/OrderSummary";
import EnableNotifications from "@/components/telegram/EnableNotifications";
import { useLanguage } from "@/components/language/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/cartStore";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { useCustomer } from "@/hooks/useCustomer";

const paymentMethods = [
  {
    value: "Cash on Delivery",
    en: "Cash on Delivery",
    km: "បង់ប្រាក់ពេលទទួលទំនិញ",
  },
  {
    value: "KHQR",
    en: "KHQR",
    km: "KHQR",
  },
  {
    value: "ABA Bank",
    en: "ABA Bank",
    km: "ធនាគារ ABA",
  },
  {
    value: "ACLEDA Bank",
    en: "ACLEDA Bank",
    km: "ធនាគារ អេស៊ីលីដា",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const telegramUser = useTelegramUser();
  const { customer, loading } = useCustomer();

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
      setForm((previous) => ({
        ...previous,
        location_status:
          language === "km"
            ? "ឧបករណ៍នេះមិនគាំទ្រការចែករំលែកទីតាំងទេ។"
            : "Location is not supported on this device.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location_status:
            language === "km"
              ? "✅ បានចែករំលែកទីតាំងដោយជោគជ័យ"
              : "✅ Location shared successfully",
        }));
      },
      () => {
        setForm((previous) => ({
          ...previous,
          location_status:
            language === "km"
              ? "⚠️ មិនអាចទទួលទីតាំងបានទេ។ អ្នកនៅតែអាចបញ្ជាទិញបាន។"
              : "⚠️ Could not get location. You can still place the order.",
        }));
      }
    );
  }

  async function handlePlaceOrder() {
    if (items.length === 0) {
      alert(
        language === "km"
          ? "កន្ត្រករបស់អ្នកទទេ។"
          : "Your cart is empty."
      );
      return;
    }

    if (!customer) {
      alert(
        language === "km"
          ? "សូមបើកកម្មវិធីនេះក្នុង Telegram ដើម្បីទទួលបាន Love Points។"
          : "Please open this app inside Telegram to earn Love Points."
      );
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
        telegram_chat_id: telegramUser?.id
          ? String(telegramUser.id)
          : null,
        customer_id: customer.id,
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
        alert(
          language === "km"
            ? `${item.name} មិនមានស្តុកគ្រប់គ្រាន់ទេ។`
            : `${item.name} does not have enough stock.`
        );
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

    const earnedPoints = Math.floor(subtotal);

    const { error: pointsError } = await supabase
      .from("customers")
      .update({
        phone: form.phone,
        address: form.address,
        love_points:
          (customer.love_points ?? 0) + earnedPoints,
      })
      .eq("id", customer.id);

    if (pointsError) {
      alert(pointsError.message);
      return;
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
      router.push(
  `/order-success?order=${encodeURIComponent(orderNumber)}`
);
    }
  }

  const inputClassName = `w-full rounded-full bg-white/70 px-5 py-4 outline-none ${
    language === "km" ? "font-khmer leading-7" : ""
  }`;

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[#7a4f16] shadow-sm backdrop-blur-xl transition active:scale-95 ${
            language === "km" ? "font-khmer leading-7" : ""
          }`}
        >
          <ArrowLeft className="h-4 w-4" />

          {language === "km" ? "ត្រឡប់ក្រោយ" : "Back"}
        </button>

        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km" ? "បញ្ជាទិញ" : "Checkout"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "បញ្ចូលព័ត៌មានដឹកជញ្ជូន និងវិធីបង់ប្រាក់"
            : "Enter your delivery and payment details."}
        </p>

        <GlassCard className="mt-6 space-y-4">
          <input
            type="text"
            placeholder={
              language === "km" ? "ឈ្មោះពេញ" : "Full Name"
            }
            value={form.customer_name}
            onChange={(event) =>
              setForm({
                ...form,
                customer_name: event.target.value,
              })
            }
            className={inputClassName}
          />

          <input
            type="tel"
            placeholder={
              language === "km" ? "លេខទូរស័ព្ទ" : "Phone Number"
            }
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
            className={inputClassName}
          />

          <input
            type="text"
            placeholder={
              language === "km"
                ? "អាសយដ្ឋាន ឬទីតាំងសម្គាល់"
                : "Address / Landmark"
            }
            value={form.address}
            onChange={(event) =>
              setForm({ ...form, address: event.target.value })
            }
            className={inputClassName}
          />

          <textarea
            placeholder={
              language === "km"
                ? "កំណត់សម្គាល់សម្រាប់ការដឹកជញ្ជូន (មិនចាំបាច់)"
                : "Delivery Note (optional)"
            }
            value={form.delivery_note}
            onChange={(event) =>
              setForm({
                ...form,
                delivery_note: event.target.value,
              })
            }
            className={`h-28 w-full rounded-3xl bg-white/70 px-5 py-4 outline-none ${
              language === "km"
                ? "font-khmer leading-7"
                : ""
            }`}
          />

          <button
            type="button"
            onClick={handleShareLocation}
            className={`w-full rounded-full border border-gold py-4 font-semibold text-gold ${
              language === "km"
                ? "font-khmer leading-7"
                : ""
            }`}
          >
            📍{" "}
            {language === "km"
              ? "ដាក់ទីតាំងរបស់ខ្ញុំ"
              : "Share My Location"}
          </button>

          {form.location_status && (
            <p
              className={`text-center text-sm text-gray-500 ${
                language === "km"
                  ? "font-khmer leading-7"
                  : "leading-6"
              }`}
            >
              {form.location_status}
            </p>
          )}
        </GlassCard>

        <GlassCard className="mt-6">
          <h2
            className={`mb-4 text-lg font-bold ${
              language === "km"
                ? "font-khmer leading-8"
                : ""
            }`}
          >
            {language === "km"
              ? "វិធីបង់ប្រាក់"
              : "Payment Method"}
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={
                    form.payment_method === method.value
                  }
                  onChange={() =>
                    setForm({
                      ...form,
                      payment_method: method.value,
                    })
                  }
                />

                <span
                  className={
                    language === "km"
                      ? "font-khmer leading-7"
                      : ""
                  }
                >
                  {method[language]}
                </span>
              </label>
            ))}
          </div>
        </GlassCard>

        <OrderSummary />

        <EnableNotifications />

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`mt-6 w-full rounded-full py-4 font-semibold text-white ${
            loading ? "bg-gray-400" : "bg-gold"
          } ${
            language === "km"
              ? "font-khmer leading-7"
              : ""
          }`}
        >
          {loading
            ? language === "km"
              ? "កំពុងផ្ទុកគណនី..."
              : "Loading account..."
            : language === "km"
              ? "បញ្ជាក់ការបញ្ជាទិញ"
              : "Place Order"}
        </button>
      </div>

      <BottomNavigation />
    </main>
  );
}