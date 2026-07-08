import fs from "fs";
import path from "path";
import { pdf } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/pdf/InvoiceDocument";

function getLogoBase64() {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "brands",
    "logo",
    "baby-premium.png"
  );

  if (!fs.existsSync(logoPath)) {
    return null;
  }

  const logoBuffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${logoBuffer.toString("base64")}`;
}

export async function createInvoicePdf(order: any, items: any[]) {
  const logoBase64 = getLogoBase64();

  const blob = await pdf(
    <InvoiceDocument
      order={order}
      items={items}
      logoBase64={logoBase64}
    />
  ).toBlob();

  const arrayBuffer = await blob.arrayBuffer();

  return Buffer.from(arrayBuffer);
}