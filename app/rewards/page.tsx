"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import BottomNavigation from "@/components/layout/BottomNavigation";
import RedeemDialog from "@/components/rewards/RedeemDialog";
import { useLanguage } from "@/components/language/LanguageProvider";
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
  const { language } = useLanguage();
  const { customer, loading: customerLoading } = useCustomer();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [selectedReward, setSelectedReward] =
    useState<Reward | null>(null);
  const [redeemedReward, setRedeemedReward] =
    useState<RedeemedReward | null>(null);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function loadRewards() {
      const { data, error } = await supabase
        .from("rewards")
        .select(
          "id, name, description, image, points_required"
        )
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
      const telegramWebApp = window.Telegram?.WebApp as
  | {
      initData?: string;
    }
  | undefined;

const initData = telegramWebApp?.initData ?? "";

if (!initData) {
  alert(
    language === "km"
      ? "សូមបើកកម្មវិធីនេះនៅក្នុង Telegram ដើម្បីប្តូរយកអំណោយ។"
      : "Open this app inside Telegram to redeem a gift."
  );

  return;
}

const response = await fetch("/api/rewards/redeem", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    initData,
    rewardId: selectedReward.id,
  }),
});

      const responseText = await response.text();

      let result: RedeemResult;

      try {
        result = JSON.parse(responseText);
      } catch {
        console.error(
          "Unexpected redeem response:",
          responseText
        );

        alert(
          response.status === 404
            ? language === "km"
              ? "រកមិនឃើញប្រព័ន្ធប្តូររង្វាន់។"
              : "Reward API route was not found."
            : language === "km"
              ? "ម៉ាស៊ីនមេបានផ្ញើចម្លើយមិនត្រឹមត្រូវ។"
              : "The server returned an invalid response."
        );

        return;
      }

      if (!response.ok) {
        alert(
          result.error ??
            (language === "km"
              ? "មិនអាចប្តូររង្វាន់បានទេ"
              : "Failed to redeem reward.")
        );
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
          result.reward?.pointsSpent ??
          selectedReward.points_required,
      });

      setSelectedReward(null);
    } catch (error) {
      console.error("Redeem error:", error);

      alert(
        language === "km"
          ? "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។"
          : "Something went wrong. Please try again."
      );
    } finally {
      setRedeeming(false);
    }
  }

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <main className="min-h-screen bg-premium pb-28">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-8">
          <h1
            className={`font-bold ${
              language === "km"
                ? "font-khmer text-3xl leading-[1.6]"
                : "text-4xl leading-tight"
            }`}
          >
            {language === "km"
              ? "កាដូរប្ដូរសម្រាប់អរគុណ"
              : "Thank You Gifts"}
          </h1>

          <p
            className={`text-gray-500 ${
              language === "km"
                ? "font-khmer mt-3 text-sm leading-7"
                : "mt-2 text-base leading-6"
            }`}
        
          >
            {language === "km"
              ? "សន្សំពិន្ទុរាល់ពេលដែលអ្នកទិញទំនិញជាមួយ Baby Premium"
              : "Collect points every time you shop with Baby Premium+"}
          </p>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-sm text-gray-500 ${khmerText}`}
              >
                {language === "km"
                  ? "Love Points របស់អ្នក"
                  : "Your Love Points"}
              </p>

              <h2 className="mt-2 text-4xl font-bold text-gold">
                {customerLoading
                  ? "..."
                  : `${displayedPoints} LP`}
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
              <p
                className={`py-8 text-center text-gray-500 ${khmerText}`}
              >
                {language === "km"
                  ? "កំពុងផ្ទុកកាដូរ..."
                  : "Loading rewards..."}
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
                        className="h-24 w-24 shrink-0 rounded-2xl border bg-white object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/40 text-4xl shadow-sm backdrop-blur-xl">
                        🎁
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold leading-8">
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
                        <div
                          className={`mt-4 rounded-full bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500 ${khmerText}`}
                        >
                          {language === "km"
                            ? "កំពុងផ្ទុកពិន្ទុរបស់អ្នក..."
                            : "Loading your balance..."}
                        </div>
                      ) : !customer ? (
                        <div
                          className={`mt-4 rounded-3xl bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500 ${khmerText}`}
                        >
                          {language === "km"
                            ? "សូមបើកក្នុង Telegram ដើម្បីមើលកាដូររបស់អ្នក"
                            : "Open inside Telegram to view your rewards"}
                        </div>
                      ) : canRedeem ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReward(reward)
                          }
                          className={`mt-4 w-full rounded-full bg-gold py-3 font-semibold text-white transition hover:opacity-90 ${khmerText}`}
                        >
                          {language === "km"
                            ? "ប្តូរយកកាដូរ"
                            : "Redeem"}
                        </button>
                      ) : (
                        <div
                          className={`mt-4 rounded-full bg-white/60 px-4 py-3 text-center text-sm font-semibold text-gray-500 ${khmerText}`}
                        >
                          {language === "km"
                            ? `ត្រូវការ ${pointsNeeded} LP បន្ថែម`
                            : `Need ${pointsNeeded} more LP`}
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
                <h2
                  className={`text-xl font-bold ${
                    language === "km"
                      ? "font-khmer leading-9"
                      : ""
                  }`}
                >
                  {language === "km"
                    ? "មិនទាន់មានកាដូរទេ"
                    : "No Gifts Available Yet"}
                </h2>

                <p
                  className={`mt-2 text-gray-500 ${khmerText}`}
                >
                  {language === "km"
                    ? "កាដូរថ្មីៗនឹងបង្ហាញនៅទីនេះឆាប់ៗនេះ"
                    : "New thank you gifts will appear here soon."}
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

            <h2
              className={`mt-5 font-bold ${
                language === "km"
                  ? "font-khmer text-2xl leading-[1.6]"
                  : "text-3xl"
              }`}
            >
              {language === "km"
                ? "បានប្តូរកាដូរដោយជោគជ័យ"
                : "Redeemed Successfully"}
            </h2>

            <p
              className={`mt-2 text-gray-500 ${khmerText}`}
            >
              {language === "km"
                ? "កាដូរប្ដូរសម្រាប់ការអរគុណត្រូវបានរួចរាល់"
                : "Your thank you gift has been redeemed."}
            </p>

            {redeemedReward.image && (
              <img
                src={redeemedReward.image}
                alt={redeemedReward.name}
                className="mx-auto mt-6 h-36 w-36 rounded-2xl bg-white object-contain p-3"
              />
            )}

            <h3 className="mt-5 text-xl font-bold leading-8">
              {redeemedReward.name}
            </h3>

            <p className="mt-2 font-semibold text-gold">
              {redeemedReward.pointsSpent} Love Points
            </p>

            <div className="mt-5 rounded-2xl bg-white/60 p-4">
              <p
                className={`text-sm text-gray-500 ${khmerText}`}
              >
                {language === "km"
                  ? "ពិន្ទុនៅសល់"
                  : "Remaining Balance"}
              </p>

              <p className="mt-1 text-2xl font-bold text-gold">
                {displayedPoints} LP
              </p>
            </div>

            <p
              className={`mt-5 text-sm text-gray-500 ${khmerText}`}
            >
              {language === "km"
                ? "Baby Premium+ នឹងដាក់កាដូរនេះជាមួយការបញ្ជាទិញបន្ទាប់របស់អ្នក"
                : "Baby Premium+ will include your gift with your upcoming order."}
            </p>

            <button
              type="button"
              onClick={() => setRedeemedReward(null)}
              className={`mt-6 w-full rounded-full bg-gold py-4 font-semibold text-white transition hover:opacity-90 ${khmerText}`}
            >
              {language === "km" ? "រួចរាល់" : "Done"}
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </main>
  );
}