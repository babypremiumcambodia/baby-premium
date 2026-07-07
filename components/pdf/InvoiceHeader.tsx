import { Image, Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#C9A227";
const gray = "#6B7280";

const styles = StyleSheet.create({
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
  line: {
    height: 2,
    backgroundColor: gold,
    marginBottom: 18,
  },
  title: {
    textAlign: "center",
    color: gold,
    fontSize: 22,
    marginBottom: 4,
  },
  orderNumber: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
  },
});

export default function InvoiceHeader({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const logoUrl = "/logo/baby-premium.png";

  return (
    <>
      <Image src={logoUrl} style={styles.logo} />

      <Text style={styles.tagline}>
        Trusted by Parents, Loved by Babies
      </Text>

      <View style={styles.line} />

      <Text style={styles.title}>INVOICE</Text>
      <Text style={styles.orderNumber}>{orderNumber}</Text>
    </>
  );
}