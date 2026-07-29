"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function OrderSuccessPage() {
  const { language } = useLanguage();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const parameters = new URLSearchParams(
      window.location.search
    );

    setOrderNumber(parameters.get("order") ?? "");
  }, []);

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-premium px-6 py-10">
      <div className="glass w-full max-w-md rounded-[32px] p-8 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />

        <h1
          className={`mt-6 font-bold ${
            language === "km"
              ? "font-khmer text-2xl leading-[1.6]"
              : "text-3xl"
          }`}
        >
          {language === "km"
            ? "សូមអរគុណ!"
            : "Thank You!"}
        </h1>

        <p
          className={`mt-3 text-gray-500 ${khmerText}`}
        >
          {language === "km"
            ? "ការបញ្ជាទិញរបស់អ្នកត្រូវបានទទួលដោយជោគជ័យ"
            : "Your order has been received successfully."}
        </p>

        <div className="mt-8 rounded-2xl border border-white/60 bg-white/50 p-5">
          <Package className="mx-auto h-8 w-8 text-gold" />

          <p
            className={`mt-3 text-sm text-gray-500 ${khmerText}`}
          >
            {language === "km"
              ? "លេខបញ្ជាទិញ"
              : "Order Number"}
          </p>

          <p className="mt-2 text-xl font-bold">
            {orderNumber || "..."}
          </p>

          <p
            className={`mt-5 text-sm text-gray-500 ${khmerText}`}
          >
            {language === "km"
              ? "ក្រុមការងាររបស់យើងនឹងទាក់ទងអ្នក ដើម្បីបញ្ជាក់ការដឹកជញ្ជូន"
              : "Our team will contact you to confirm delivery."}
          </p>
        </div>

        <Link
          href="/orders"
          className={`mt-6 block rounded-full border border-gold py-3.5 font-semibold text-gold ${khmerText}`}
        >
          {language === "km"
            ? "មើលការបញ្ជាទិញ"
            : "View My Orders"}
        </Link>

        <Link
          href="/"
          className={`mt-3 block rounded-full bg-gold py-3.5 font-semibold text-white ${khmerText}`}
        >
          {language === "km"
            ? "បន្តទិញទំនិញ"
            : "Continue Shopping"}
        </Link>
      </div>
    </main>
  );
}