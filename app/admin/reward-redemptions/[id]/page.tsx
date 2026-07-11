export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import AdminBackButton from "@/components/admin/AdminBackButton";
import GlassCard from "@/components/ui/GlassCard";
import RewardRedemptionActions from "@/components/admin/RewardRedemptionActions";

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
      customer_id,
      reward_id,
      points_spent,
      status,
      created_at,
      customers (
        id,
        first_name,
        last_name,
        phone,
        telegram_user_id,
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

  const statusLabel =
    redemption.status.charAt(0).toUpperCase() +
    redemption.status.slice(1);

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Reward Request</h1>

          <p className="mt-2 text-gray-500">
            Review and manage this redemption request.
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
              <p className="text-sm text-gray-500">Requested</p>

              <p>
                {new Date(redemption.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>

              <p className="mt-1 text-xl font-bold">{statusLabel}</p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                redemption.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : redemption.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          {redemption.status === "pending" && (
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