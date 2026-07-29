import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { verifyTelegramInitData } from "@/lib/telegram-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const initData = String(body.initData ?? "");

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

    const telegramUserId = String(telegramUser.id);

    const { data: customer, error: customerError } =
      await supabaseServer
        .from("customers")
        .select("id")
        .eq("telegram_user_id", telegramUserId)
        .maybeSingle();

    if (customerError) {
      console.error(
        "Customer lookup failed:",
        customerError
      );

      return NextResponse.json(
        {
          error: "Failed to find customer.",
        },
        {
          status: 500,
        }
      );
    }

    if (!customer) {
      return NextResponse.json({
        orders: [],
      });
    }

    const { data: orders, error: ordersError } =
      await supabaseServer
        .from("orders")
        .select(
          "id, order_number, status, total, payment_method, created_at"
        )
        .eq("customer_id", customer.id)
        .order("created_at", {
          ascending: false,
        });

    if (ordersError) {
      console.error("Orders lookup failed:", ordersError);

      return NextResponse.json(
        {
          error: "Failed to load orders.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      orders: orders ?? [],
    });
  } catch (error) {
    console.error("My Orders API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load orders.",
      },
      {
        status: 500,
      }
    );
  }
}