export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminBackButton from "@/components/admin/AdminBackButton";
import GlassCard from "@/components/ui/GlassCard";

export default async function RewardsPage() {
  const { data: rewards, error } = await supabase
    .from("rewards")
    .select("*")
    .order("points_required", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-premium">
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Rewards
          </h1>

          <Link
            href="/admin/rewards/new"
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Add Reward
          </Link>
        </div>

        <div className="space-y-5">
          {rewards?.map((reward) => (
            <GlassCard key={reward.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {reward.image ? (
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="h-20 w-20 rounded-2xl border bg-white object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-white text-4xl">
                      🎁
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-bold">
                      {reward.name}
                    </h2>

                    {reward.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {reward.description}
                      </p>
                    )}

                    <p className="mt-2 font-semibold text-gold">
                      ❤️ {reward.points_required} Love Points
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/rewards/${reward.id}/edit`}
                  className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 font-semibold transition hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </div>
            </GlassCard>
          ))}

          {!rewards?.length && (
            <GlassCard>
              <div className="py-10 text-center">
                <h2 className="text-xl font-bold">
                  No Rewards Yet
                </h2>

                <p className="mt-2 text-gray-500">
                  Click "Add Reward" to create your first thank you gift.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </main>
  );
}