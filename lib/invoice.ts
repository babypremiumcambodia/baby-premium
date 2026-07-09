import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { createInvoiceHtml } from "./invoice-html";

export async function createInvoicePdf(order: any, items: any[]) {
  const isVercel = !!process.env.VERCEL;

  const browser = await puppeteer.launch({
    headless: true,
    ...(isVercel
      ? {
          executablePath: await chromium.executablePath(),
          args: chromium.args,
        }
      : {
          executablePath:
            process.env.CHROME_PATH ||
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }),
  });

  try {
    const page = await browser.newPage();

    const html = createInvoiceHtml(order, items);

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}