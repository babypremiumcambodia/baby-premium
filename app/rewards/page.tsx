"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNavigation from "@/components/layout/BottomNavigation";
import RedeemDialog from "@/components/rewards/RedeemDialog";
import { supabase } from "@/lib/supabase";
import { useCustomer } from "@/hooks/useCustomer";

type Reward = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  points_required: number;
};

export default function RewardsPage() {
  const { customer, loading: customerLoading } = useCustomer();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function loadRewards() {
      const { data, error } = await supabase
        .from("rewards")
        .select("id, name, description, image, points_required")
        .order("points_required", { ascending: true });

      if (error) {
        console.error("Failed to load rewards:", error);
        setRewardsLoading(false);
        return;
      }

      setRewards(data ?? []);
      setRewardsLoading(false);
    }

    loadRewards();
  }, []);

  useEffect(() => {
    if (customer) {
      setDisplayedPoints(customer.love_points ?? 0);
    }
  }, [customer]);

  async function handleRedeem() {
    if (!customer || !selectedReward || redeeming) return;

    setRedeeming(true);

    try {
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          rewardId: selectedReward.id,
        }),
      });

      const responseText = await response.text();

let result: {
  error?: string;
  remainingPoints?: number;
};

try {
  result = JSON.parse(responseText);
} catch {
  console.error("Unexpected redeem response:", responseText);

  alert(
    response.status === 404
      ? "Reward API route was not found."
      : "The server returned an invalid response."
  );

  return;
}

      if (!response.ok) {
        alert(result.error ?? "Failed to redeem reward.");
        return;
      }

      setDisplayedPoints(
  Number(result.remainingPoints ?? displayedPoints)
);

      alert("Reward request sent successfully!");
    } catch (error) {
      console.error("Redeem error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <main className="min-h-screen bg-premium pb-28">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Thank You Gifts</h1>

          <p className="mt-3 text-base text-gray-500">
            Every purchase earns Love Points.
          </p>

          <p className="mt-1 text-base text-gray-500">
            Redeem them for exclusive gifts from Baby Premium+.
          </p>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Your Love Points</p>

              <h2 className="mt-2 text-4xl font-bold text-gold">
                {customerLoading ? "..." : `${displayedPoints} LP`}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/40 text-2xl shadow-lg backdrop-blur-xl">
              ❤️
            </div>
          </div>
        </GlassCard>

        <div className="mt-8 space-y-5">
          {rewardsLoading && (
            <GlassCard>
              <p className="py-8 text-center text-gray-500">
                Loading rewards...
              </p>
            </GlassCard>
          )}

          {!rewardsLoading &&
            rewards.map((reward) => {
              const canRedeem =
                !customerLoading &&
                Boolean(customer) &&
                displayedPoints >= reward.points_required;

              const pointsNeeded = Math.max(
                reward.points_required - displayedPoints,
                0
              );

              return (
                <GlassCard key={reward.id}>
                  <div className="flex items-start gap-4">
                    {reward.image ? (
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="h-24 w-24 flex-shrink-0 rounded-2xl border bg-white object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/40 text-4xl shadow-sm backdrop-blur-xl">
                        🎁
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold">{reward.name}</h2>

                      {reward.description && (
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {reward.description}
                        </p>
                      )}

                      <p className="mt-3 font-semibold text-gold">
                        {reward.points_required} Love Points
                      </p>

                      {customerLoading ? (
                        <div className="mt-4 rounded-full bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500">
                          Loading your balance...
                        </div>
                      ) : !customer ? (
                        <div className="mt-4 rounded-full bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500">
                          Open inside Telegram to view your rewards
                        </div>
                      ) : canRedeem ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReward(reward)}
                          className="mt-4 w-full rounded-full bg-gold py-3 font-semibold text-white transition hover:opacity-90"
                        >
                          Redeem
                        </button>
                      ) : (
                        <div className="mt-4 rounded-full bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500">
                          Need {pointsNeeded} more LP
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}

          {!rewardsLoading && rewards.length === 0 && (
            <GlassCard>
              <div className="py-10 text-center">
                <h2 className="text-xl font-bold">No Gifts Available Yet</h2>

                <p className="mt-2 text-gray-500">
                  New thank you gifts will appear here soon.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {selectedReward && (
        <RedeemDialog
          reward={selectedReward}
          lovePoints={displayedPoints}
          onClose={() => {
            if (!redeeming) {
              setSelectedReward(null);
            }
          }}
          onRedeem={handleRedeem}
        />
      )}

      <BottomNavigation />
    </main>
  );
}