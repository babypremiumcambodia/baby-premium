import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { redemptionId, action } = await request.json();

    if (!redemptionId || !["approve", "cancel"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid redemption request." },
        { status: 400 }
      );
    }

    const { data: redemption, error: redemptionError } =
      await supabaseServer
        .from("reward_redemptions")
        .select(`
          id,
          customer_id,
          points_spent,
          status
        `)
        .eq("id", redemptionId)
        .single();

    if (redemptionError || !redemption) {
      return NextResponse.json(
        { error: "Reward request not found." },
        { status: 404 }
      );
    }

    if (redemption.status !== "pending") {
      return NextResponse.json(
        { error: "This reward request has already been processed." },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const { error: approveError } = await supabaseServer
        .from("reward_redemptions")
        .update({
          status: "approved",
        })
        .eq("id", redemption.id)
        .eq("status", "pending");

      if (approveError) {
        return NextResponse.json(
          { error: approveError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        status: "approved",
      });
    }

    const { data: customer, error: customerError } =
      await supabaseServer
        .from("customers")
        .select("id, love_points")
        .eq("id", redemption.customer_id)
        .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    const returnedPoints =
      Number(customer.love_points ?? 0) +
      Number(redemption.points_spent ?? 0);

    const { error: pointsError } = await supabaseServer
      .from("customers")
      .update({
        love_points: returnedPoints,
      })
      .eq("id", customer.id);

    if (pointsError) {
      return NextResponse.json(
        { error: pointsError.message },
        { status: 500 }
      );
    }

    const { error: cancelError } = await supabaseServer
      .from("reward_redemptions")
      .update({
        status: "cancelled",
      })
      .eq("id", redemption.id)
      .eq("status", "pending");

    if (cancelError) {
      return NextResponse.json(
        { error: cancelError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "cancelled",
      returnedPoints,
    });
  } catch (error) {
    console.error("Reward request update error:", error);

    return NextResponse.json(
      { error: "Failed to update reward request." },
      { status: 500 }
    );
  }
}