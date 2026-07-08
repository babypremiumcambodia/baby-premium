import { Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#C9A227";
const gray = "#6B7280";
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

  row: {
    flexDirection: "row",
    marginBottom: 7,
  },

  label: {
    width: 90,
    color: gray,
    fontSize: 10,
  },

  value: {
    flex: 1,
    fontSize: 10,
  },
});

export default function CustomerCard({ order }: { order: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Customer Information</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{order.customer_name ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{order.phone ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{order.address ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Payment</Text>
        <Text style={styles.value}>{order.payment_method ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {new Date().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}