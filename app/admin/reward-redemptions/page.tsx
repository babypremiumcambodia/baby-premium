export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import AdminBackButton from "@/components/admin/AdminBackButton";
import GlassCard from "@/components/ui/GlassCard";

type Redemption = {
  id: number;
  points_spent: number;
  status: string;
  created_at: string;
  customers:
    | {
        id: number;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
      }
    | null;
  rewards:
    | {
        id: number;
        name: string;
        image: string | null;
      }
    | null;
};

export default async function RewardRedemptionsPage() {
  const { data, error } = await supabaseServer
    .from("reward_redemptions")
    .select(`
      id,
      points_spent,
      status,
      created_at,
      customers (
        id,
        first_name,
        last_name,
        phone
      ),
      rewards (
        id,
        name,
        image
      )
    `)
    .order("created_at", { ascending: false });

  const redemptions = (data ?? []) as Redemption[];

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-premium">
        <p className="text-red-500">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Reward Requests</h1>

          <p className="mt-2 text-gray-500">
            Review customer reward redemption requests.
          </p>
        </div>

        <div className="space-y-5">
          {redemptions.map((redemption) => {
            const firstName = redemption.customers?.first_name ?? "";
            const lastName = redemption.customers?.last_name ?? "";

            const customerName =
              `${firstName} ${lastName}`.trim() || "Unknown customer";

            const statusLabel =
              redemption.status.charAt(0).toUpperCase() +
              redemption.status.slice(1);

            return (
              <GlassCard key={redemption.id}>
                <div className="flex items-start gap-4">
                  {redemption.rewards?.image ? (
                    <img
                      src={redemption.rewards.image}
                      alt={redemption.rewards.name}
                      className="h-20 w-20 flex-shrink-0 rounded-2xl border bg-white object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border bg-white/50 text-3xl">
                      🎁
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold">
                      {redemption.rewards?.name ?? "Deleted reward"}
                    </h2>

                    <p className="mt-2 font-semibold">{customerName}</p>

                    {redemption.customers?.phone && (
                      <p className="mt-1 text-sm text-gray-500">
                        {redemption.customers.phone}
                      </p>
                    )}

                    <p className="mt-2 font-semibold text-gold">
                      {redemption.points_spent} Love Points
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(redemption.created_at).toLocaleString()}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
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

                      <Link
                        href={`/admin/reward-redemptions/${redemption.id}`}
                        className="rounded-full bg-gold px-5 py-2 font-semibold text-white transition hover:opacity-90"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {redemptions.length === 0 && (
            <GlassCard>
              <div className="py-10 text-center">
                <h2 className="text-xl font-bold">
                  No Reward Requests Yet
                </h2>

                <p className="mt-2 text-gray-500">
                  Customer redemption requests will appear here.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </main>
  );
}