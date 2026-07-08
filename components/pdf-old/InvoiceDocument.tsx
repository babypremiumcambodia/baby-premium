import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import InvoiceHeader from "./InvoiceHeader";
import CustomerCard from "./CustomerCard";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";
import LovePointsCard from "./LovePointsCard";
import InvoiceFooter from "./InvoiceFooter";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1F2937",
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceHeader orderNumber={orderNumber} />

        <CustomerCard order={order} />

        <ProductTable items={items} />

        <OrderSummary subtotal={subtotal} total={total} />

        <LovePointsCard lovePoints={lovePoints} />

        <InvoiceFooter />
      </Page>
    </Document>
  );
}