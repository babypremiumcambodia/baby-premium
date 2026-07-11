"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const statuses = [
  {
    value: "pending",
    label: "🟡 Pending",
  },
  {
    value: "confirmed",
    label: "🟣 Confirmed",
  },
  {
    value: "packing",
    label: "📦 Packing",
  },
  {
    value: "shipping",
    label: "🚚 Shipping",
  },
  {
    value: "delivered",
    label: "✅ Delivered",
  },
  {
    value: "cancelled",
    label: "❌ Cancelled",
  },
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

    try {
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

      alert("✅ Order status updated!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 space-y-3">
      {statuses.map((item) => {
        const active = status === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setStatus(item.value)}
            className={`glass w-full cursor-pointer rounded-full border px-5 py-3 text-center font-semibold transition-all duration-200 active:scale-95 ${
  active
    ? "border-gold bg-gold text-white shadow-xl"
    : "border-white/40 hover:scale-[1.02] hover:border-gold hover:shadow-lg"
}`}
          >
            {item.label}
          </button>
        );
      })}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 w-full cursor-pointer rounded-full bg-gold py-4 font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
      >
        {saving ? "Saving..." : "💾 Save Changes"}
      </button>
    </div>
  );
}