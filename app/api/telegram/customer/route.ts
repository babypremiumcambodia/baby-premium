import { NextResponse } from "next/server";

const messages: Record<string, string> = {
  confirmed: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

✅ Your order has been confirmed!

We'll begin preparing your order shortly.

Thank you for shopping with Baby Premium+ 💛`,

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
    const chatId = body.chatId;
    const status = body.status;
    const orderId = body.orderId;

    if (!chatId) {
      return NextResponse.json({
        error: "No customer Telegram ID.",
      });
    }

    const text = `${messages[status] ?? "Your order status has been updated."}

🧾 Order: ${orderId}`;

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
      {
        error: "Failed to send customer Telegram message.",
      },
      { status: 500 }
    );
  }
}