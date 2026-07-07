import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#C9A227",
    marginBottom: 6,
  },

  tagline: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    textAlign: "center",
    color: "#C9A227",
    marginBottom: 15,
  },

  section: {
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  total: {
    marginTop: 15,
    fontSize: 16,
    color: "#C9A227",
    textAlign: "right",
  },

  footer: {
    marginTop: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 10,
  },
});

export default function InvoiceDocument({
  order,
  items,
}: {
  order: any;
  items: any[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Baby Premium+</Text>

        <Text style={styles.tagline}>
          Trusted by Parents, Loved by Babies
        </Text>

        <Text style={styles.heading}>INVOICE</Text>

        <View style={styles.section}>
          <Text>Invoice: {order.order_number}</Text>
          <Text>Name: {order.customer_name}</Text>
          <Text>Phone: {order.phone}</Text>
          <Text>Payment: {order.payment_method}</Text>
        </View>

        <View style={styles.section}>
          {items.map((item: any, index: number) => (
            <View key={index} style={styles.row}>
              <Text>
                {item.product_name} × {item.quantity}
              </Text>

              <Text>
                $
                {(Number(item.price) * Number(item.quantity)).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>
          TOTAL: ${Number(order.total).toFixed(2)}
        </Text>

        <Text style={styles.footer}>
          Thank you for shopping with Baby Premium+
        </Text>
      </Page>
    </Document>
  );
}