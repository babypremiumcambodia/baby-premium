import { pdf } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/pdf/InvoiceDocument";

export async function createInvoicePdf(order: any, items: any[]) {
  const blob = await pdf(
    <InvoiceDocument order={order} items={items} />
  ).toBlob();

  const arrayBuffer = await blob.arrayBuffer();

  return Buffer.from(arrayBuffer);
}