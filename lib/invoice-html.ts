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

      return `
      <tr>
        <td>${item.product_name}</td>
        <td style="text-align:center">${qty}</td>
        <td style="text-align:right">$${price.toFixed(2)}</td>
        <td style="text-align:right">$${(price * qty).toFixed(2)}</td>
      </tr>
    `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body{
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
background:#fafafa;
padding:40px;
color:#1f2937;
}

.receipt{
max-width:820px;
margin:auto;
background:white;
border-radius:20px;
padding:40px;
box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.header{
text-align:center;
border-bottom:2px solid #d4af37;
padding-bottom:20px;
margin-bottom:30px;
}

.logo{
width:150px;
margin-bottom:10px;
}

.tagline{
color:#777;
font-size:14px;
margin-top:8px;
}

.title{
font-size:34px;
font-weight:bold;
color:#d4af37;
margin-top:15px;
}

.number{
margin-top:5px;
color:#777;
}

.section{
display:flex;
justify-content:space-between;
margin:30px 0;
}

.card{
width:48%;
background:#faf8f2;
padding:18px;
border-radius:14px;
}

.card h3{
margin:0 0 10px;
color:#d4af37;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th{
background:#faf8f2;
padding:12px;
text-align:left;
}

td{
padding:12px;
border-bottom:1px solid #eee;
}

.summary{
width:300px;
margin-left:auto;
margin-top:30px;
}

.summary-row{
display:flex;
justify-content:space-between;
padding:8px 0;
}

.total{
font-size:22px;
font-weight:bold;
color:#d4af37;
border-top:2px solid #d4af37;
padding-top:12px;
margin-top:10px;
}

.points{
margin-top:35px;
border:2px solid #d4af37;
border-radius:18px;
padding:20px;
text-align:center;
}

.points h2{
margin:0;
color:#d4af37;
}

.points p{
font-size:28px;
margin-top:10px;
}

.footer{
margin-top:40px;
text-align:center;
color:#777;
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

<div class="title">
INVOICE
</div>

<div class="number">
${orderNumber}
</div>

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

</div>

</div>

<table>

<thead>

<tr>

<th>Product</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

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

<div class="summary-row total">

<span>Total</span>

<span>$${total.toFixed(2)}</span>

</div>

</div>

<div class="points">

<h2>Love Points Earned</h2>

<p>${lovePoints} LP</p>

</div>

<div class="footer">

<strong>Baby Premium+</strong><br>

Trusted by Parents, Loved by Babies

</div>

</div>

</body>
</html>
`;
}