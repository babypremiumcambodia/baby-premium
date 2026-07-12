export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import AdminBackButton from "@/components/admin/AdminBackButton";
import GlassCard from "@/components/ui/GlassCard";
import RewardRedemptionActions from "@/components/admin/RewardRedemptionActions";
import { formatDate } from "@/lib/date";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RewardRedemptionDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const redemptionId = Number(id);

  if (!redemptionId) {
    notFound();
  }

  const { data: redemption, error } = await supabaseServer
    .from("reward_redemptions")
    .select(`
      id,
      points_spent,
      status,
      fulfilled,
      fulfilled_at,
      created_at,
      customers (
        id,
        first_name,
        last_name,
        phone,
        love_points
      ),
      rewards (
        id,
        name,
        description,
        image,
        points_required
      )
    `)
    .eq("id", redemptionId)
    .single();

  if (error || !redemption) {
    notFound();
  }

  const customer = Array.isArray(redemption.customers)
    ? redemption.customers[0]
    : redemption.customers;

  const reward = Array.isArray(redemption.rewards)
    ? redemption.rewards[0]
    : redemption.rewards;

  const customerName =
    `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() ||
    "Unknown customer";

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Reward Redemption</h1>

          <p className="mt-2 text-gray-500">
            Review the redeemed gift and mark it as included.
          </p>
        </div>

        <GlassCard>
          <div className="flex items-start gap-5">
            {reward?.image ? (
              <img
                src={reward.image}
                alt={reward.name}
                className="h-28 w-28 flex-shrink-0 rounded-2xl border bg-white object-contain p-2"
              />
            ) : (
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border bg-white/50 text-4xl">
                🎁
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">Reward</p>

              <h2 className="mt-1 text-2xl font-bold">
                {reward?.name ?? "Deleted reward"}
              </h2>

              {reward?.description && (
                <p className="mt-2 text-gray-500">
                  {reward.description}
                </p>
              )}

              <p className="mt-4 font-semibold text-gold">
                {redemption.points_spent} Love Points
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <h2 className="text-xl font-bold">Customer Information</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">{customerName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{customer?.phone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Current Love Points
              </p>

              <p className="font-semibold text-gold">
                {customer?.love_points ?? 0} LP
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Redeemed At</p>

              <p>
                {formatDate(redemption.created_at)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Gift Status</p>

              <p className="mt-1 text-xl font-bold">
                {redemption.fulfilled ? "Included" : "Waiting to Include"}
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                redemption.fulfilled
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {redemption.fulfilled ? "Included" : "Waiting"}
            </span>
          </div>

          {redemption.fulfilled && redemption.fulfilled_at && (
            <div className="mt-5 rounded-2xl bg-white/50 p-4">
              <p className="text-sm text-gray-500">Included At</p>

              <p className="mt-1 font-semibold">
                {formatDate(redemption.fulfilled_at)}
              </p>
            </div>
          )}

          {!redemption.fulfilled && (
            <div className="mt-6">
              <RewardRedemptionActions
                redemptionId={redemption.id}
              />
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}