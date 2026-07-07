import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { File } from "buffer";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const messages: Record<string, string> = {
  confirmed: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

✅ Your order has been confirmed!

We'll begin preparing your order shortly.

Thank you for shopping with Baby Premium+ 💛

📄 Your invoice is attached below.`,

  packing: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

📦 Your Baby Premium+ order is being prepared.

Our team is carefully packing your items 💛`,

  shipping: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🚚 Your Baby Premium+ order is on the way!

Please keep your phone nearby.`,

  delivered: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

🎉 Your Baby Premium+ order has been delivered!

Thank you for choosing Baby Premium+ 💛`,

  cancelled: `🧸 Baby Premium ៚ បេប៊ី ព្រីមៀម

❌ Your Baby Premium+ order has been cancelled.

Please contact us if you have any questions.`,
};

async function createInvoicePdf(order: any, items: any[]) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(22).text("Baby Premium+", { align: "center" });
  doc.fontSize(16).text("Invoice", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Invoice: ${order.order_number ?? order.id}`);
  doc.text(`Customer: ${order.customer_name ?? "-"}`);
  doc.text(`Phone: ${order.phone ?? "-"}`);
  doc.text(`Payment: ${order.payment_method ?? "-"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();
  doc.fontSize(14).text("Items");
  doc.moveDown(0.5);

  items.forEach((item) => {
    const lineTotal = Number(item.price) * Number(item.quantity);

    doc
      .fontSize(12)
      .text(`${item.product_name} x${item.quantity}     $${lineTotal.toFixed(2)}`);
  });

  doc.moveDown();

  doc.fontSize(14).text(`Total: $${Number(order.total).toFixed(2)}`, {
    align: "right",
  });

  doc.moveDown();

  doc.fontSize(11).text("Thank you for shopping with Baby Premium+ 💛", {
    align: "center",
  });

  doc.end();

  return done;
}

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

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    const orderNumber = order?.order_number ?? `#${orderId}`;

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

    if (status === "confirmed" && order && items) {
      const pdfBuffer = await createInvoicePdf(order, items);

      const formData = new FormData();

      const file = new File(
        [new Uint8Array(pdfBuffer)],
        `Invoice_${orderNumber}.pdf`,
        { type: "application/pdf" }
      );

      formData.append("chat_id", chatId);
      formData.append("document", file);
      formData.append("caption", `📄 Invoice ${orderNumber}`);

      const pdfResponse = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        {
          method: "POST",
          body: formData,
        }
      );

      const pdfResult = await pdfResponse.json();

      if (!pdfResult.ok) {
        console.error("Telegram PDF error:", pdfResult);
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