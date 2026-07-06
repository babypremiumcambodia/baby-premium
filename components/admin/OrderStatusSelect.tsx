"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const statuses = [
  "pending",
  "confirmed",
  "packing",
  "shipping",
  "delivered",
  "cancelled",
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);

  async function handleSave() {
    const { data: order, error: loadError } = await supabase
      .from("orders")
      .select("telegram_chat_id")
      .eq("id", orderId)
      .single();

    if (loadError) {
      alert(loadError.message);
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      alert(error.message);
      return;
    }

    if (order?.telegram_chat_id) {
      await fetch("/api/telegram/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: order.telegram_chat_id,
          orderId,
          status,
        }),
      });
    }

    alert("Order status updated!");
  }

  return (
    <div className="mt-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-xl border p-4"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSave}
        className="mt-4 w-full rounded-full bg-gold py-3 font-semibold text-white"
      >
        Save Status
      </button>
    </div>
  );
}