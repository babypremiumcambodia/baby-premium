import { Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#C9A227";

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: gold,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    textAlign: "center",
  },
  title: {
    color: gold,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "bold",
  },
  value: {
    fontSize: 22,
    textAlign: "center",
  },
});

export default function LovePointsCard({
  lovePoints,
}: {
  lovePoints: number;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Love Points Earned</Text>
      <Text style={styles.value}>{lovePoints} LP</Text>
    </View>
  );
}