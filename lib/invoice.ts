import PDFDocument from "pdfkit/js/pdfkit.standalone";

export async function createInvoicePdf(order: any, items: any[]) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const orderNumber =
    order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const lovePoints = Math.floor(Number(order.total ?? subtotal));

  doc.fontSize(22).text("Baby Premium+", { align: "center" });
  doc.moveDown(0.3);

  doc.fontSize(18).text("INVOICE", { align: "center" });
  doc.fontSize(12).text(orderNumber, { align: "center" });

  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Customer: ${order.customer_name ?? "-"}`);
  doc.text(`Phone: ${order.phone ?? "-"}`);
  doc.text(`Payment: ${order.payment_method ?? "-"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  doc.fontSize(15).text("Items");
  doc.moveDown(0.5);

  items.forEach((item) => {
    const lineTotal = Number(item.price) * Number(item.quantity);

    doc
      .fontSize(12)
      .text(
        `${item.product_name} x${item.quantity}     $${lineTotal.toFixed(2)}`
      );
  });

  doc.moveDown();

  doc.fontSize(12).text(`Subtotal: $${subtotal.toFixed(2)}`, {
    align: "right",
  });

  doc.fontSize(14).text(`Total: $${Number(order.total).toFixed(2)}`, {
    align: "right",
  });

  doc.moveDown();

  doc.fontSize(12).text(`Love Points Earned: ${lovePoints} LP`, {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(11).text("Thank you for shopping with Baby Premium+", {
    align: "center",
  });

  doc.end();

  return done;
}