import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { verifyTelegramInitData } from "@/lib/telegram-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const initData = String(body.initData ?? "");
    const rewardId = Number(body.rewardId);

    const telegramUser =
      verifyTelegramInitData(initData);

    if (!telegramUser) {
      return NextResponse.json(
        {
          error:
            "Telegram authentication is missing or invalid.",
        },
        {
          status: 401,
        }
      );
    }

    if (!rewardId) {
      return NextResponse.json(
        {
          error: "Missing reward information.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: customer, error: customerError } =
      await supabaseServer
        .from("customers")
        .select("id, love_points")
        .eq(
          "telegram_user_id",
          String(telegramUser.id)
        )
        .single();

    if (customerError || !customer) {
      console.error(
        "Customer lookup error:",
        customerError
      );

      return NextResponse.json(
        {
          error: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const { data: reward, error: rewardError } =
      await supabaseServer
        .from("rewards")
        .select(
          "id, name, image, points_required"
        )
        .eq("id", rewardId)
        .single();

    if (rewardError || !reward) {
      console.error("Reward lookup error:", rewardError);

      return NextResponse.json(
        {
          error: "Reward not found.",
        },
        {
          status: 404,
        }
      );
    }

    const currentPoints = Number(
      customer.love_points ?? 0
    );

    const requiredPoints = Number(
      reward.points_required ?? 0
    );

    if (currentPoints < requiredPoints) {
      return NextResponse.json(
        {
          error:
            "You do not have enough Love Points.",
        },
        {
          status: 400,
        }
      );
    }

    const remainingPoints =
      currentPoints - requiredPoints;

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

    if (redemptionError || !redemption) {
      console.error(
        "Reward redemption error:",
        redemptionError
      );

      return NextResponse.json(
        {
          error:
            redemptionError?.message ??
            "Reward redemption was not created.",
        },
        {
          status: 500,
        }
      );
    }

    const { error: pointsError } =
      await supabaseServer
        .from("customers")
        .update({
          love_points: remainingPoints,
        })
        .eq("id", customer.id);

    if (pointsError) {
      console.error(
        "Love Points update error:",
        pointsError
      );

      await supabaseServer
        .from("reward_redemptions")
        .delete()
        .eq("id", redemption.id);

      return NextResponse.json(
        {
          error: pointsError.message,
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
    console.error(
      "Reward redemption API error:",
      error
    );

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