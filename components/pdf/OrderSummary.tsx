import { Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#C9A227";
const light = "#F8F5EE";

const styles = StyleSheet.create({
  card: {
    backgroundColor: light,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    border: "1 solid #E5E7EB",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    fontSize: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: gold,
    paddingTop: 10,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    color: gold,
    fontWeight: "bold",
  },
});

export default function OrderSummary({
  subtotal,
  total,
}: {
  subtotal: number;
  total: number;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text>Subtotal</Text>
        <Text>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text>Delivery</Text>
        <Text>FREE</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>TOTAL</Text>
        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}