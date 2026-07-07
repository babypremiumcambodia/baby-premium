import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const gold = "#C9A227";
const dark = "#1F2937";
const gray = "#6B7280";
const light = "#F8F5EE";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: dark,
  },
  logo: {
    width: 150,
    alignSelf: "center",
    marginBottom: 8,
  },
  tagline: {
    textAlign: "center",
    color: gray,
    fontSize: 10,
    marginBottom: 14,
  },
  goldLine: {
    height: 2,
    backgroundColor: gold,
    marginBottom: 18,
  },
  invoiceTitle: {
    textAlign: "center",
    color: gold,
    fontSize: 22,
    marginBottom: 4,
  },
  invoiceNumber: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: light,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  sectionTitle: {
    color: gold,
    fontSize: 13,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 90,
    color: gray,
  },
  value: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  product: {
    width: "55%",
  },
  qty: {
    width: "15%",
    textAlign: "center",
  },
  price: {
    width: "15%",
    textAlign: "right",
  },
  total: {
    width: "15%",
    textAlign: "right",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: gold,
    paddingTop: 10,
    marginTop: 8,
  },
  grandTotalText: {
    fontSize: 16,
    color: gold,
  },
  pointsBox: {
    borderWidth: 1,
    borderColor: gold,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  pointsTitle: {
    color: gold,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 6,
  },
  pointsValue: {
    fontSize: 22,
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: gray,
    fontSize: 9,
    marginTop: 20,
  },
  footerBrand: {
    textAlign: "center",
    color: gold,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
});

export default function InvoiceDocument({
  order,
  items,
}: {
  order: any;
  items: any[];
}) {
  const orderNumber =
    order.order_number ?? `BP${String(order.id).padStart(5, "0")}`;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const total = Number(order.total ?? subtotal);
  const lovePoints = Math.floor(total);

  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/logo/baby-premium.png`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoUrl} style={styles.logo} />

        <Text style={styles.tagline}>
          Trusted by Parents, Loved by Babies
        </Text>

        <View style={styles.goldLine} />

        <Text style={styles.invoiceTitle}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>{orderNumber}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{order.customer_name ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{order.phone ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{order.address ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{order.payment_method ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          <View style={styles.tableHeader}>
            <Text style={styles.product}>Product</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {items.map((item: any, index: number) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const lineTotal = price * quantity;

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.product}>{item.product_name}</Text>
                <Text style={styles.qty}>×{quantity}</Text>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
                <Text style={styles.total}>${lineTotal.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Delivery</Text>
            <Text>FREE</Text>
          </View>

          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>TOTAL</Text>
            <Text style={styles.grandTotalText}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.pointsBox}>
          <Text style={styles.pointsTitle}>Love Points Earned</Text>
          <Text style={styles.pointsValue}>{lovePoints} LP</Text>
        </View>

        <Text style={styles.footer}>Thank you for shopping with</Text>
        <Text style={styles.footerBrand}>Baby Premium+</Text>
        <Text style={styles.footer}>
          Trusted by Parents, Loved by Babies
        </Text>
      </Page>
    </Document>
  );
}