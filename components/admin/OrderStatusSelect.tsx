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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    const { data: order, error: loadError } = await supabase
      .from("orders")
      .select("telegram_chat_id")
      .eq("id", orderId)
      .single();

    if (loadError) {
      alert(loadError.message);
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      alert(error.message);
      setSaving(false);
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

    setSaving(false);
    alert("Order status updated!");
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {statuses.map((item) => {
          const active = status === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-full border px-4 py-3 text-sm font-semibold capitalize transition ${
                active
                  ? "border-gold bg-gold text-white shadow-lg"
                  : "border-white/40 bg-white/40 hover:bg-white/70"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-full bg-gold py-3 font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}