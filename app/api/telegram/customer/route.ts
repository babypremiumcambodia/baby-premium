import { NextResponse } from "next/server";

const messages: Record<string, string> = {
  confirmed: "✅ Your Baby Premium order has been confirmed.",
  packing: "📦 Your Baby Premium order is being prepared.",
  shipping: "🚚 Your Baby Premium order is out for delivery.",
  delivered: "🎉 Your Baby Premium order has been delivered. Thank you!",
  cancelled: "❌ Your Baby Premium order has been cancelled.",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = body.chatId;
    const status = body.status;
    const orderId = body.orderId;

    if (!chatId) {
      return NextResponse.json({ error: "No customer chat ID." });
    }

    const text = `${messages[status] ?? "Your order status has been updated."}

Order #${orderId}`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to send customer Telegram message." },
      { status: 500 }
    );
  }
}