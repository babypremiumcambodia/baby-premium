import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { order, items } = await request.json();

    const pdfBuffer = await createInvoicePdf(order, items);
    const orderNumber = order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;
    const fileName = `Invoice_${orderNumber}_${Date.now()}.pdf`;
    const { error } = await supabaseServer.storage
      .from("invoices")
      .upload(fileName, new Uint8Array(pdfBuffer), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseServer.storage
      .from("invoices")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate invoice." },
      { status: 500 }
    );
  }
}