"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { useLanguage } from "@/components/language/LanguageProvider";

type Order = {
  id: number;
  order_number: string | null;
  status: string;
  total: number;
  payment_method: string | null;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const telegramWebApp = window.Telegram?.WebApp as
          | {
              initData?: string;
            }
          | undefined;

        const initData = telegramWebApp?.initData ?? "";

        if (!initData) {
          setErrorMessage(
            language === "km"
              ? "សូមបើកកម្មវិធីនេះនៅក្នុង Telegram ដើម្បីមើលការបញ្ជាទិញរបស់អ្នក"
              : "Open this app inside Telegram to view your orders."
          );

          setLoading(false);
          return;
        }

        const response = await fetch("/api/orders/mine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(
            language === "km"
              ? "មិនអាចផ្ទុកការបញ្ជាទិញបានទេ"
              : result.error ?? "Failed to load orders."
          );

          setLoading(false);
          return;
        }

        setOrders(result.orders ?? []);
      } catch (error) {
        console.error("Load orders error:", error);

        setErrorMessage(
          language === "km"
            ? "មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត"
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [language]);

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[#7a4f16] shadow-sm backdrop-blur-xl transition active:scale-95 ${khmerText}`}
        >
          <ArrowLeft className="h-4 w-4" />

          {language === "km" ? "ត្រឡប់ក្រោយ" : "Back"}
        </button>

        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km"
            ? "ការបញ្ជាទិញរបស់ខ្ញុំ"
            : "My Orders"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "មើលការបញ្ជាទិញថ្មីៗ និងស្ថានភាពដឹកជញ្ជូន"
            : "View your recent purchases and delivery status."}
        </p>

        {loading ? (
          <GlassCard className="mt-6 text-center">
            <p className={`text-gray-500 ${khmerText}`}>
              {language === "km"
                ? "កំពុងផ្ទុកការបញ្ជាទិញ..."
                : "Loading orders..."}
            </p>
          </GlassCard>
        ) : errorMessage ? (
          <GlassCard className="mt-6 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-400" />

            <p
              className={`mt-3 text-sm text-gray-500 ${khmerText}`}
            >
              {errorMessage}
            </p>
          </GlassCard>
        ) : orders.length === 0 ? (
          <GlassCard className="mt-6 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <Package className="h-8 w-8 text-gold" />
            </div>

            <h2
              className={`mt-4 font-bold ${
                language === "km"
                  ? "font-khmer text-lg leading-8"
                  : "text-lg"
              }`}
            >
              {language === "km"
                ? "មិនទាន់មានការបញ្ជាទិញ"
                : "No orders yet"}
            </h2>

            <p
              className={`mt-2 text-sm text-gray-500 ${khmerText}`}
            >
              {language === "km"
                ? "ការបញ្ជាទិញរបស់អ្នកនឹងបង្ហាញនៅទីនេះ"
                : "Your orders will appear here."}
            </p>
          </GlassCard>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <GlassCard key={order.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-xs text-gray-500 ${khmerText}`}
                    >
                      {language === "km"
                        ? "លេខបញ្ជាទិញ"
                        : "Order"}
                    </p>

                    <h2 className="mt-1 truncate text-lg font-bold">
                      {order.order_number ??
                        `BP${String(order.id).padStart(
                          5,
                          "0"
                        )}`}
                    </h2>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <p
                  className={`mt-3 text-sm text-gray-500 ${khmerText}`}
                >
                  {new Intl.DateTimeFormat(
                    language === "km" ? "km-KH" : "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  ).format(new Date(order.created_at))}
                </p>

                <p className="mt-3 text-xl font-bold text-gold">
                  ${Number(order.total).toFixed(2)}
                </p>

                <OrderTimeline status={order.status} />
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}