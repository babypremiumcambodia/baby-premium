import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerId = Number(body.customerId);
    const rewardId = Number(body.rewardId);

    if (!customerId || !rewardId) {
      return NextResponse.json(
        {
          error: "Missing customer or reward information.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: customer, error: customerError } = await supabaseServer
      .from("customers")
      .select("id, love_points")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      console.error("Customer lookup error:", customerError);

      return NextResponse.json(
        {
          error: "Customer not found.",
          details: customerError,
        },
        {
          status: 404,
        }
      );
    }

    const { data: reward, error: rewardError } = await supabaseServer
      .from("rewards")
      .select("id, name, image, points_required")
      .eq("id", rewardId)
      .single();

    if (rewardError || !reward) {
      console.error("Reward lookup error:", rewardError);

      return NextResponse.json(
        {
          error: "Reward not found.",
          details: rewardError,
        },
        {
          status: 404,
        }
      );
    }

    const currentPoints = Number(customer.love_points ?? 0);
    const requiredPoints = Number(reward.points_required ?? 0);

    if (currentPoints < requiredPoints) {
      return NextResponse.json(
        {
          error: "You do not have enough Love Points.",
        },
        {
          status: 400,
        }
      );
    }

    const remainingPoints = currentPoints - requiredPoints;

    console.log("Creating reward redemption:", {
      customerId: customer.id,
      rewardId: reward.id,
      pointsSpent: requiredPoints,
    });

    const { data: redemption, error: redemptionError } =
      await supabaseServer
        .from("reward_redemptions")
        .insert({
          customer_id: customer.id,
          reward_id: reward.id,
          points_spent: requiredPoints,
          status: "approved",
          fulfilled: false,
          fulfilled_at: null,
        })
        .select("id")
        .single();

    if (redemptionError) {
      console.error("========== REDEMPTION INSERT ERROR ==========");
      console.error(redemptionError);
      console.error("=============================================");

      return NextResponse.json(
        {
          error: redemptionError.message,
          details: redemptionError,
        },
        {
          status: 500,
        }
      );
    }

    if (!redemption) {
      return NextResponse.json(
        {
          error: "Reward redemption was not created.",
        },
        {
          status: 500,
        }
      );
    }

    const { error: pointsError } = await supabaseServer
      .from("customers")
      .update({
        love_points: remainingPoints,
      })
      .eq("id", customer.id);

    if (pointsError) {
      console.error("Love Points update error:", pointsError);

      await supabaseServer
        .from("reward_redemptions")
        .delete()
        .eq("id", redemption.id);

      return NextResponse.json(
        {
          error: pointsError.message,
          details: pointsError,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      redemptionId: redemption.id,
      remainingPoints,
      reward: {
        id: reward.id,
        name: reward.name,
        image: reward.image,
        pointsSpent: requiredPoints,
      },
    });
  } catch (error) {
    console.error("Reward redemption API error:", error);

    return NextResponse.json(
      {
        error: "Failed to redeem the reward.",
      },
      {
        status: 500,
      }
    );
  }
}