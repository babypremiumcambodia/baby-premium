import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";

const messages: Record<string, string> = {
  confirmed: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

✅ Your order has been confirmed!

We'll begin preparing your order shortly.

Thank you for shopping with Baby Premium+ 💛

📄 Your invoice is attached below.`,

  packing: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

📦 Your order is being prepared.`,

  shipping: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🚚 Your order is on the way!`,

  delivered: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🎉 Your order has been delivered!

Thank you for choosing Baby Premium+ 💛`,

  cancelled: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

❌ Your order has been cancelled.`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN!;
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
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabaseServer
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const orderNumber =
      order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;

    // 1. Send confirmation message
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${messages[status] ?? "Your order status has been updated."}

🧾 Order: ${orderNumber}`,
      }),
    });

    // 2. Generate + send invoice PDF only when confirmed
    if (status === "confirmed") {
      const pdfBuffer = await createInvoicePdf(order, items ?? []);

      const fileName = `Invoice_${orderNumber}_${Date.now()}.pdf`;

      const { error: uploadError } = await supabaseServer.storage
        .from("invoices")
        .upload(fileName, new Uint8Array(pdfBuffer), {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("Invoice upload error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data } = supabaseServer.storage
        .from("invoices")
        .getPublicUrl(fileName);

      const pdfSendResponse = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            document: data.publicUrl,
            caption: `📄 Invoice ${orderNumber}`,
          }),
        }
      );

      const pdfResult = await pdfSendResponse.json();

      if (!pdfResult.ok) {
        console.error("Telegram invoice send error:", pdfResult);
        return NextResponse.json({ error: pdfResult }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer telegram route error:", error);

    return NextResponse.json(
      { error: "Failed to send customer Telegram message." },
      { status: 500 }
    );
  }
}
