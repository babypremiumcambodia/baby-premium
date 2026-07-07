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

  const total = Number(order.total ?? subtotal);
  const lovePoints = Math.floor(total);

  // Header
  doc.fontSize(24).fillColor("#C9A227").text("Baby Premium+", {
    align: "center",
  });

  doc
    .fontSize(11)
    .fillColor("black")
    .text("Trusted by Parents, Loved by Babies", {
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#C9A227")
    .lineWidth(2)
    .stroke();

  doc.moveDown();

  doc.fontSize(18).fillColor("#C9A227").text("INVOICE", {
    align: "center",
  });

  doc.fontSize(13).fillColor("black").text(orderNumber, {
    align: "center",
  });

  doc.moveDown();

  // Customer information
  doc.fontSize(14).fillColor("#C9A227").text("Customer Information");
  doc.moveDown(0.4);

  doc.fontSize(11).fillColor("black");
  doc.text(`Name: ${order.customer_name ?? "-"}`);
  doc.text(`Phone: ${order.phone ?? "-"}`);
  doc.text(`Address: ${order.address ?? "-"}`);
  doc.text(`Payment: ${order.payment_method ?? "-"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  // Items
  doc.fontSize(14).fillColor("#C9A227").text("Items");
  doc.moveDown(0.4);

  doc.fontSize(10).fillColor("black");
  doc.text("Product", 50, doc.y, { continued: true });
  doc.text("Qty", 330, doc.y, { continued: true });
  doc.text("Price", 390, doc.y, { continued: true });
  doc.text("Total", 470, doc.y);

  doc
    .moveTo(50, doc.y + 4)
    .lineTo(545, doc.y + 4)
    .strokeColor("#DDDDDD")
    .lineWidth(1)
    .stroke();

  doc.moveDown();

  items.forEach((item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const lineTotal = price * quantity;

    const y = doc.y;

    doc.fontSize(10).fillColor("black");
    doc.text(item.product_name ?? "Product", 50, y, {
      width: 250,
    });
    doc.text(String(quantity), 330, y);
    doc.text(`$${price.toFixed(2)}`, 390, y);
    doc.text(`$${lineTotal.toFixed(2)}`, 470, y);

    doc.moveDown(0.7);
  });

  doc.moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#DDDDDD")
    .lineWidth(1)
    .stroke();

  doc.moveDown();

  // Totals
  doc.fontSize(11).fillColor("black");
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, { align: "right" });

  doc.fontSize(15).fillColor("#C9A227").text(`TOTAL: $${total.toFixed(2)}`, {
    align: "right",
  });

  doc.moveDown();

  // Love Points
  doc.fontSize(13).fillColor("#C9A227").text("Love Points Earned", {
    align: "center",
  });

  doc.fontSize(18).fillColor("black").text(`${lovePoints} LP`, {
    align: "center",
  });

  doc.moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#C9A227")
    .lineWidth(1)
    .stroke();

  doc.moveDown();

  // Footer
  doc.fontSize(11).fillColor("black").text("Thank you for shopping with", {
    align: "center",
  });

  doc.fontSize(14).fillColor("#C9A227").text("Baby Premium+", {
    align: "center",
  });

  doc.fontSize(10).fillColor("black").text("Trusted by Parents, Loved by Babies", {
    align: "center",
  });

  doc.end();

  return done;
}