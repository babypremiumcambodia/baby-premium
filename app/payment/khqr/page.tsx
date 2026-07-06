"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  total: number;
};

export default function KHQRPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;

      const { data } = await supabase
        .from("orders")
        .select("id,total")
        .eq("id", Number(orderId))
        .single();

      if (data) {
        setOrder(data);
      }
    }

    loadOrder();
  }, [orderId]);

  async function handlePaid() {
    if (!order) return;

    const { error } = await supabase
      .from("orders")
      .update({
        status: "awaiting_verification",
      })
      .eq("id", order.id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
        customer: "KHQR Payment",
        phone: "-",
        address: "-",
        total: order.total,
      }),
    });

    alert("Payment submitted. We'll verify it shortly.");

    router.push("/order-success");
  }

  return (
    <main className="min-h-screen bg-premium px-5 py-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold">
          KHQR Payment
        </h1>

        <p className="mt-2 text-gray-500">
          Scan the QR code below
        </p>

        {order && (
          <div className="mt-6 rounded-2xl bg-white p-4 shadow">
            <p className="font-semibold">
              Order #{order.id}
            </p>

            <p className="mt-2 text-3xl font-bold text-gold">
              ${Number(order.total).toFixed(2)}
            </p>
          </div>
        )}

        <div className="mt-8 rounded-[32px] bg-white p-6 shadow">
          <img
            src="/payment/khqr.png"
            alt="KHQR"
            className="mx-auto w-full rounded-2xl"
          />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          After you've completed the payment,
          tap the button below.
        </p>

        <button
          onClick={handlePaid}
          className="mt-6 w-full rounded-full bg-gold py-4 font-semibold text-white"
        >
          I've Paid
        </button>
      </div>
    </main>
  );
}