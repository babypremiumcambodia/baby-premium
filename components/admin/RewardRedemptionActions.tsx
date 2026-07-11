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
  const [loading, setLoading] = useState<
    "approve" | "cancel" | null
  >(null);

  async function updateStatus(action: "approve" | "cancel") {
    const message =
      action === "approve"
        ? "Approve this reward request?"
        : "Cancel this request and return the Love Points?";

    if (!confirm(message)) return;

    setLoading(action);

    try {
      const response = await fetch(
        "/api/rewards/redemptions/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            redemptionId,
            action,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error ?? "Failed to update request.");
        return;
      }

      alert(
        action === "approve"
          ? "Reward request approved."
          : "Reward request cancelled and Love Points returned."
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => updateStatus("cancel")}
        className="rounded-full bg-red-100 py-3 font-semibold text-red-700 disabled:opacity-50"
      >
        {loading === "cancel" ? "Cancelling..." : "Cancel"}
      </button>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => updateStatus("approve")}
        className="rounded-full bg-gold py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading === "approve" ? "Approving..." : "Approve"}
      </button>
    </div>
  );
}