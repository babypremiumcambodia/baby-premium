export function createInvoiceHtml(order: any, items: any[]) {
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
    .map((item: any) => {
      const price = Number(item.price);
      const qty = Number(item.quantity);
      const lineTotal = price * qty;

      return `
        <tr>
          <td><strong>${item.product_name}</strong></td>
          <td style="text-align:center;">${qty}</td>
          <td style="text-align:right;">$${price.toFixed(2)}</td>
          <td style="text-align:right;font-weight:bold;">$${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
@page {
  margin: 12mm;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  background: #fafafa;
  padding: 30px;
  color: #1f2937;
}

.receipt {
  max-width: 820px;
  margin: auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.header {
  text-align: center;
  border-bottom: 3px solid #d4af37;
  padding-bottom: 22px;
  margin-bottom: 30px;
}

.logo {
  width: 150px;
  margin-bottom: 10px;
}

.tagline {
  color: #777;
  font-size: 14px;
}

.title {
  font-size: 34px;
  font-weight: 800;
  color: #d4af37;
  margin-top: 16px;
}

.number {
  margin-top: 6px;
  color: #777;
  font-size: 14px;
}

.section {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin: 30px 0;
}

.card {
  width: 48%;
  background: #faf8f2;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid #eadfbf;
}

.card h3 {
  margin: 0 0 10px;
  color: #d4af37;
  font-size: 15px;
}

.card p {
  margin: 6px 0;
  font-size: 13px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
}

th {
  background: #f8f5ee;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  padding: 14px 12px;
  border-bottom: 2px solid #d4af37;
}

td {
  padding: 14px 12px;
  border-bottom: 1px solid #ececec;
  font-size: 14px;
}

tbody tr:nth-child(even) {
  background: #fcfcfc;
}

.summary {
  width: 320px;
  margin-left: auto;
  margin-top: 30px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.total {
  font-size: 22px;
  font-weight: 800;
  color: #d4af37;
  border-top: 2px solid #d4af37;
  padding-top: 12px;
  margin-top: 10px;
}

.points {
  margin-top: 35px;
  border: 2px solid #d4af37;
  border-radius: 18px;
  padding: 20px;
  text-align: center;
  background: #fffdf6;
}

.points h2 {
  margin: 0;
  color: #d4af37;
  font-size: 18px;
}

.points p {
  font-size: 30px;
  font-weight: 800;
  margin: 10px 0 0;
}

.payment-info {
  background: #f9fafb;
  padding: 14px;
  border-radius: 12px;
  margin-top: 24px;
  font-size: 14px;
}

.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  text-align: center;
  color: #777;
  font-size: 13px;
}
</style>
</head>

<body>
  <div class="receipt">
    <div class="header">
      <img
        class="logo"
        src="${process.env.NEXT_PUBLIC_SITE_URL}/brands/logo/baby-premium.png"
      />

      <div class="tagline">
        Trusted by Parents, Loved by Babies
      </div>

      <div class="title">INVOICE</div>
      <div class="number">${orderNumber}</div>
    </div>

    <div class="section">
      <div class="card">
        <h3>Customer</h3>
        <p><strong>${order.customer_name ?? "-"}</strong></p>
        <p>${order.phone ?? "-"}</p>
        <p>${order.address ?? "-"}</p>
      </div>

      <div class="card">
        <h3>Order</h3>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Payment: ${order.payment_method ?? "-"}</p>
        <p>Status: ${order.status ?? "confirmed"}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>

      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>

      <div class="summary-row">
        <span>Delivery</span>
        <span>FREE</span>
      </div>

      <div class="summary-row">
        <span>Love Points</span>
        <span>${lovePoints} LP</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>

    <div class="payment-info">
      <strong>Payment Method:</strong> ${order.payment_method ?? "-"}
    </div>

    <div class="points">
      <h2>Love Points Earned</h2>
      <p>${lovePoints} LP</p>
    </div>

    <div class="footer">
      <p><strong>Baby Premium+</strong></p>
      <p>Trusted by Parents, Loved by Babies</p>
      <p>Thank you for shopping with us.</p>
    </div>
  </div>
</body>
</html>
`;
}