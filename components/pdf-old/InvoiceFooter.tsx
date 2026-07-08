import { Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#C9A227";
const gray = "#6B7280";

const styles = StyleSheet.create({
  footer: {
    marginTop: 8,
    textAlign: "center",
  },
  small: {
    textAlign: "center",
    color: gray,
    fontSize: 9,
    marginBottom: 4,
  },
  brand: {
    textAlign: "center",
    color: gold,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",
  },
});

export default function InvoiceFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.small}>Thank you for shopping with</Text>
      <Text style={styles.brand}>Baby Premium+</Text>
      <Text style={styles.small}>
        Trusted by Parents, Loved by Babies
      </Text>
    </View>
  );
}