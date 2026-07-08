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

  const total = Number(order.total ?? subtotal);
  const lovePoints = Math.floor(total);

  const rows = items
  .map((item: any, index: number) => {
    const price = Number(item.price);
    const qty = Number(item.quantity);
    const lineTotal = price * qty;

    return `
<tr>
    <td>
        <div class="product">
            <div class="product-number">#${index + 1}</div>

            <div class="product-info">
                <div class="product-name">
                    ${escapeHtml(item.product_name)}
                </div>

                <div class="product-brand">
                    ${escapeHtml(item.brand ?? "")}
                </div>
            </div>
        </div>
    </td>

    <td class="center">
        ${qty}
    </td>

    <td class="right">
        ${money(price)}
    </td>

    <td class="right total-price">
        ${money(lineTotal)}
    </td>
</tr>
`;
  })
  .join("");
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/brands/logo/baby-premium.png`;

  const values: Record<string, string> = {
    "{{logoUrl}}": logoUrl,
    "{{orderNumber}}": escapeHtml(orderNumber),
    "{{customerName}}": escapeHtml(order.customer_name || "-"),
    "{{phone}}": escapeHtml(order.phone || "-"),
    "{{address}}": escapeHtml(order.address || "-"),
    "{{date}}": new Date().toLocaleDateString(),
    "{{paymentMethod}}": escapeHtml(order.payment_method || "-"),
    "{{status}}": escapeHtml(order.status || "confirmed"),
    "{{itemsRows}}": rows,
    "{{subtotal}}": money(subtotal),
    "{{total}}": money(total),
    "{{lovePoints}}": String(lovePoints),
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