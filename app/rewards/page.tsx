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

type RedeemedReward = {
  name: string;
  image: string | null;
  pointsSpent: number;
};

type RedeemResult = {
  error?: string;
  remainingPoints?: number;
  reward?: {
    name: string;
    image: string | null;
    pointsSpent: number;
  };
};

export default function RewardsPage() {
  const { customer, loading: customerLoading } = useCustomer();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemedReward, setRedeemedReward] =
    useState<RedeemedReward | null>(null);
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

      let result: RedeemResult;

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

      const remainingPoints = Number(
        result.remainingPoints ?? displayedPoints
      );

      setDisplayedPoints(remainingPoints);

      setRedeemedReward({
        name: result.reward?.name ?? selectedReward.name,
        image: result.reward?.image ?? selectedReward.image,
        pointsSpent:
          result.reward?.pointsSpent ?? selectedReward.points_required,
      });

      setSelectedReward(null);
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
              <p className="text-sm text-gray-500">
                Your Love Points
              </p>

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
                      <h2 className="text-xl font-bold">
                        {reward.name}
                      </h2>

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
                <h2 className="text-xl font-bold">
                  No Gifts Available Yet
                </h2>

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

      {redeemedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-5 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[32px] border border-white/60 bg-white/85 p-6 text-center shadow-2xl backdrop-blur-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/60 text-4xl shadow-lg">
              ✓
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Redeemed Successfully
            </h2>

            <p className="mt-2 text-gray-500">
              Your thank you gift has been redeemed.
            </p>

            {redeemedReward.image && (
              <img
                src={redeemedReward.image}
                alt={redeemedReward.name}
                className="mx-auto mt-6 h-36 w-36 rounded-2xl bg-white object-contain p-3"
              />
            )}

            <h3 className="mt-5 text-xl font-bold">
              {redeemedReward.name}
            </h3>

            <p className="mt-2 font-semibold text-gold">
              {redeemedReward.pointsSpent} Love Points
            </p>

            <div className="mt-5 rounded-2xl bg-white/60 p-4">
              <p className="text-sm text-gray-500">
                Remaining Balance
              </p>

              <p className="mt-1 text-2xl font-bold text-gold">
                {displayedPoints} LP
              </p>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Baby Premium+ will include your gift with your upcoming
              order.
            </p>

            <button
              type="button"
              onClick={() => setRedeemedReward(null)}
              className="mt-6 w-full rounded-full bg-gold py-4 font-semibold text-white transition hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </main>
  );
}