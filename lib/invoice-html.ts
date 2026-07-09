import fs from "fs";
import path from "path";

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function escapeHtml(value: any) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createInvoiceHtml(order: any, items: any[]) {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "invoice",
    "invoice.html"
  );

  let html = fs.readFileSync(templatePath, "utf8");

  const orderNumber =
    order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const tax = 0;
  const total = Number(order.total ?? subtotal);

  const rows = items
    .map((item: any) => {
      const price = Number(item.price);
      const qty = Number(item.quantity);
      const lineTotal = price * qty;

      const imageUrl = item.product?.image || "";

      return `
        <tr>
          <td>
            ${
              imageUrl
                ? `<img class="product-image" src="${escapeHtml(imageUrl)}" />`
                : `<div class="image-placeholder">No Image</div>`
            }
          </td>

          <td>
            <strong>${escapeHtml(item.product_name)}</strong>
            <div class="brand">${escapeHtml(item.product?.brand ?? "")}</div>
          </td>

          <td class="center">${qty}</td>
          <td class="right">${money(price)}</td>
          <td class="right"><strong>${money(lineTotal)}</strong></td>
        </tr>
      `;
    })
    .join("");

  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/brands/logo/baby-premium.png`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
    "https://t.me/babypremiumbabybot"
  )}`;

  const values: Record<string, string> = {
    "{{logoUrl}}": logoUrl,
    "{{qrUrl}}": qrUrl,
    "{{orderNumber}}": escapeHtml(orderNumber),
    "{{customerName}}": escapeHtml(order.customer_name || "-"),
    "{{phone}}": escapeHtml(order.phone || "-"),
    "{{address}}": escapeHtml(order.address || "-"),
    "{{date}}": new Date().toLocaleDateString(),
    "{{paymentMethod}}": escapeHtml(order.payment_method || "-"),
    "{{status}}": escapeHtml(order.status || "confirmed"),
    "{{deliveryMethod}}": escapeHtml(order.delivery_method || "Standard Delivery"),
    "{{itemsRows}}": rows,
    "{{subtotal}}": money(subtotal),
    "{{tax}}": money(tax),
    "{{total}}": money(total),
  };

  for (const [key, value] of Object.entries(values)) {
    html = html.replaceAll(key, value);
  }

  const cssPath = path.join(
    process.cwd(),
    "templates",
    "invoice",
    "invoice.css"
  );

  const css = fs.readFileSync(cssPath, "utf8");

  html = html.replace(
    '<link rel="stylesheet" href="./invoice.css" />',
    `<style>${css}</style>`
  );

  return html;
}