import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID!;

    const message = `
🍼 New Baby Premium Order

Order #${body.orderId}

👤 Customer: ${body.customer}
📞 Phone: ${body.phone}

💰 Total: $${body.total}

📍 Address:
${body.address}

Status: Pending
`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send Telegram message." },
      { status: 500 }
    );
  }
}