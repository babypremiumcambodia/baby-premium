import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { customerId, rewardId } = await request.json();

    if (!customerId || !rewardId) {
      return NextResponse.json(
        { error: "Missing customerId or rewardId." },
        { status: 400 }
      );
    }

    // Get customer
    const { data: customer, error: customerError } = await supabaseServer
      .from("customers")
      .select("id, love_points")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    // Get reward
    const { data: reward, error: rewardError } = await supabaseServer
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .single();

    if (rewardError || !reward) {
      return NextResponse.json(
        { error: "Reward not found." },
        { status: 404 }
      );
    }

    // Enough Love Points?
    if (customer.love_points < reward.points_required) {
      return NextResponse.json(
        { error: "Not enough Love Points." },
        { status: 400 }
      );
    }

    // Deduct Love Points
    const remainingPoints =
      customer.love_points - reward.points_required;

    const { error: updateError } = await supabaseServer
      .from("customers")
      .update({
        love_points: remainingPoints,
      })
      .eq("id", customer.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Save redemption
    const { error: redemptionError } = await supabaseServer
      .from("reward_redemptions")
      .insert({
        customer_id: customer.id,
        reward_id: reward.id,
        points_spent: reward.points_required,
        status: "pending",
      });

    if (redemptionError) {
      return NextResponse.json(
        { error: redemptionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      remainingPoints,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to redeem reward.",
      },
      {
        status: 500,
      }
    );
  }
}