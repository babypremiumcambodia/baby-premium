import fs from "fs";
import path from "path";
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

  const logoPath = path.join(
    process.cwd(),
    "public",
    "logo",
    "baby-premium.png"
  );

  // Logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 190, 35, {
      width: 210,
    });

    doc.y = 260;
  } else {
    doc.fontSize(24).fillColor("#C9A227").text("Baby Premium+", {
      align: "center",
    });

    doc.moveDown();
  }

  // Tagline
  doc
    .fontSize(11)
    .fillColor("#666666")
    .text("Trusted by Parents, Loved by Babies", {
      align: "center",
    });

  doc.moveDown(0.5);

  // Gold line
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#C9A227")
    .lineWidth(2)
    .stroke();

  doc.moveDown();

  // Invoice title
  doc.fontSize(18).fillColor("#C9A227").text("INVOICE", {
    align: "center",
  });

  doc.fontSize(13).fillColor("black").text(orderNumber, {
    align: "center",
  });

  doc.moveDown();

  // Customer info
  doc.fontSize(14).fillColor("#C9A227").text("Customer Information");
  doc.moveDown(0.4);

  doc.fontSize(11).fillColor("black");
  doc.text(`Name: ${order.customer_name ?? "-"}`);
  doc.text(`Phone: ${order.phone ?? "-"}`);
  doc.text(`Address: ${order.address ?? "-"}`);
  doc.text(`Payment: ${order.payment_method ?? "-"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  // Items table
  doc.fontSize(14).fillColor("#C9A227").text("Items");
  doc.moveDown(0.4);

  const tableTop = doc.y;

  doc.fontSize(10).fillColor("black");
  doc.text("Product", 50, tableTop);
  doc.text("Qty", 330, tableTop);
  doc.text("Price", 390, tableTop);
  doc.text("Total", 470, tableTop);

  doc
    .moveTo(50, tableTop + 16)
    .lineTo(545, tableTop + 16)
    .strokeColor("#DDDDDD")
    .lineWidth(1)
    .stroke();

  doc.y = tableTop + 24;

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

    doc.y = y + 24;
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
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, {
    align: "right",
  });

  doc.fontSize(15).fillColor("#C9A227").text(`TOTAL: $${total.toFixed(2)}`, {
    align: "right",
  });

  doc.moveDown();

  // Love points
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

  doc.fontSize(10).fillColor("#666666").text(
    "Trusted by Parents, Loved by Babies",
    {
      align: "center",
    }
  );

  doc.end();

  return done;
}