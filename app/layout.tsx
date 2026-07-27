import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/kantumruy-pro/400.css";
import "@fontsource/kantumruy-pro/500.css";
import "@fontsource/kantumruy-pro/600.css";
import "@fontsource/kantumruy-pro/700.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Premium+",
  description: "Premium Baby Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="km"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        />
      </head>

      <body>{children}</body>
    </html>
  );
}