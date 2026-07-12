import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const redemptionId = Number(body.redemptionId);

    if (!redemptionId) {
      return NextResponse.json(
        { error: "Missing redemption ID." },
        { status: 400 }
      );
    }

    const { data: redemption, error: redemptionError } =
      await supabaseServer
        .from("reward_redemptions")
        .select("id, fulfilled")
        .eq("id", redemptionId)
        .single();

    if (redemptionError || !redemption) {
      return NextResponse.json(
        { error: "Reward redemption not found." },
        { status: 404 }
      );
    }

    if (redemption.fulfilled) {
      return NextResponse.json(
        { error: "This gift has already been included." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseServer
      .from("reward_redemptions")
      .update({
        fulfilled: true,
        fulfilled_at: new Date().toISOString(),
        status: "approved",
      })
      .eq("id", redemptionId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Reward fulfillment error:", error);

    return NextResponse.json(
      { error: "Failed to mark the gift as included." },
      { status: 500 }
    );
  }
}