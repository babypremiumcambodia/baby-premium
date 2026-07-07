import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const messages: Record<string, string> = {
  confirmed: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

✅ Your order has been confirmed!

We'll begin preparing your order shortly.

Thank you for shopping with Baby Premium+ 💛

📄 Your invoice is attached below.`,

  packing: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

📦 Your order is being prepared.

Our team is carefully packing your items.

Thank you for your patience 💛`,

  shipping: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🚚 Your order is on the way!

Our delivery partner is heading to your location.

Please keep your phone nearby in case we need to contact you.`,

  delivered: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🎉 Your order has been delivered!

Thank you for choosing Baby Premium+ 💛

We hope you and your little one enjoy your purchase.

❤️ Thank you for trusting us.`,

  cancelled: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

❌ Your order has been cancelled.

If you have any questions, please contact Baby Premium+.

We're always happy to help 💛`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    const chatId = body.chatId;
    const status = body.status;
    const orderId = body.orderId;

    if (!chatId) {
      return NextResponse.json({ error: "No customer Telegram ID." });
    }

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const { data: items, error: itemsError } = await supabaseServer
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    const orderNumber =
      order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;

    const text = `${messages[status] ?? "Your order status has been updated."}

🧾 Order: ${orderNumber}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (status === "confirmed") {
      const invoiceResponse = await fetch(`${siteUrl}/api/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
          items: items ?? [],
        }),
      });

      const invoiceResult = await invoiceResponse.json();

      if (invoiceResult?.url) {
        await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            document: invoiceResult.url,
            caption: `📄 Invoice ${orderNumber}`,
          }),
        });
      } else {
        console.error("Invoice generation failed:", invoiceResult);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send customer Telegram message." },
      { status: 500 }
    );
  }
}