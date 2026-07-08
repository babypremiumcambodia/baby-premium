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
  title: {
    color: gold,
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 8,
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    fontSize: 9,
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
});

export default function ProductTable({ items }: { items: any[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Items</Text>

      <View style={styles.header}>
        <Text style={styles.product}>Product</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.price}>Price</Text>
        <Text style={styles.total}>Total</Text>
      </View>

      {items.map((item, index) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        const lineTotal = price * quantity;

        return (
          <View key={index} style={styles.row}>
            <Text style={styles.product}>{item.product_name}</Text>
            <Text style={styles.qty}>×{quantity}</Text>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            <Text style={styles.total}>${lineTotal.toFixed(2)}</Text>
          </View>
        );
      })}
    </View>
  );
}