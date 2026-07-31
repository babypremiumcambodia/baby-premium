import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { verifyTelegramInitData } from "@/lib/telegram-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const initData = String(body.initData ?? "");
    const orderId = Number(body.orderId);

    const telegramUser =
      verifyTelegramInitData(initData);

    if (!telegramUser) {
      return NextResponse.json(
        {
          error:
            "Telegram authentication is missing or invalid",
        },
        {
          status: 401,
        }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Missing order information.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: customer, error: customerError } =
      await supabaseServer
        .from("customers")
        .select("id")
        .eq(
          "telegram_user_id",
          String(telegramUser.id)
        )
        .single();

    if (customerError || !customer) {
      return NextResponse.json(
        {
          error: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const { data: order, error: orderError } =
      await supabaseServer
        .from("orders")
        .update({
          status: "awaiting_verification",
        })
        .eq("id", orderId)
        .eq("customer_id", customer.id)
        .select("id, order_number, total, status")
        .maybeSingle();

    if (orderError) {
      console.error(
        "Payment status update error:",
        orderError
      );

      return NextResponse.json(
        {
          error: "Failed to submit payment.",
        },
        {
          status: 500,
        }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order was not found in your account",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Payment submission API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to submit payment",
      },
      {
        status: 500,
      }
    );
  }
}