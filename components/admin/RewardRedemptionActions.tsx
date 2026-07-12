"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  redemptionId: number;
};

export default function RewardRedemptionActions({
  redemptionId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function markIncluded() {
    if (!confirm("Mark this gift as included with the customer's order?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/rewards/redemptions/fulfill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            redemptionId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error ?? "Failed to update reward.");
        return;
      }

      alert("Gift marked as included.");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={markIncluded}
      className="w-full rounded-full bg-gold py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Gift Included"}
    </button>
  );
}