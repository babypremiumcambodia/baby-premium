import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(request: Request) {
  const body = await request.json();

  const doc = new PDFDocument({ margin: 50 });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const pdfBufferPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(22).text("Baby Premium+", { align: "center" });
  doc.fontSize(14).text("Invoice", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Invoice: ${body.orderNumber}`);
  doc.text(`Customer: ${body.customer}`);
  doc.text(`Phone: ${body.phone}`);
  doc.text(`Payment: ${body.paymentMethod}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  doc.fontSize(16).text("Items");
  doc.moveDown(0.5);

  body.items.forEach((item: any) => {
    doc
      .fontSize(12)
      .text(
        `${item.product_name} x${item.quantity} - $${(
          Number(item.price) * item.quantity
        ).toFixed(2)}`
      );
  });

  doc.moveDown();

  doc.fontSize(14).text(`Total: $${Number(body.total).toFixed(2)}`, {
    align: "right",
  });

  doc.moveDown();
  doc.fontSize(10).text("Thank you for shopping with Baby Premium+ 💛", {
    align: "center",
  });

  doc.end();

  const pdfBuffer = await pdfBufferPromise;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${body.orderNumber}.pdf"`,
    },
  });
}