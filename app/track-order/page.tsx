"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
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

export default function TrackOrderPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    setError("");
    setOrder(null);

    const searchText = orderNumber.trim().toLowerCase();

    if (!searchText) {
      setError(
        language === "km"
          ? "សូមបញ្ចូលលេខបញ្ជាទិញរបស់អ្នក"
          : "Please enter your order number."
      );
      return;
    }

    const telegramWebApp = window.Telegram?.WebApp as
      | {
          initData?: string;
        }
      | undefined;

    const initData = telegramWebApp?.initData ?? "";

    if (!initData) {
      setError(
        language === "km"
          ? "សូមបើកកម្មវិធីនេះនៅក្នុង Telegram ដើម្បីតាមដានការបញ្ជាទិញ"
          : "Open this app inside Telegram to track your order."
      );
      return;
    }

    setSearching(true);

    try {
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
        setError(
          language === "km"
            ? "មិនអាចស្វែងរកការបញ្ជាទិញបានទេ"
            : result.error ?? "Unable to find order."
        );
        return;
      }

      const customerOrders: Order[] = result.orders ?? [];

      const matchedOrder = customerOrders.find((item) => {
        const formattedId = `bp${String(item.id).padStart(
          5,
          "0"
        )}`;

        return (
          String(item.id) === searchText ||
          formattedId === searchText ||
          item.order_number?.toLowerCase() === searchText
        );
      });

      if (!matchedOrder) {
        setError(
          language === "km"
            ? "រកមិនឃើញការបញ្ជាទិញនេះក្នុងគណនីរបស់អ្នក"
            : "This order was not found in your account."
        );
        return;
      }

      setOrder(matchedOrder);
    } catch (searchError) {
      console.error("Track order error:", searchError);

      setError(
        language === "km"
          ? "មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត"
          : "Something went wrong. Please try again."
      );
    } finally {
      setSearching(false);
    }
  }

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
            ? "តាមដានការបញ្ជាទិញ"
            : "Track Order"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "បញ្ចូលលេខបញ្ជាទិញ ដើម្បីពិនិត្យមើលស្ថានភាព"
            : "Enter your order number to check its status."}
        </p>

        <GlassCard className="mt-6 space-y-4">
          <input
            type="text"
            placeholder={
              language === "km"
                ? "ឧទាហរណ៍៖ BP00043"
                : "Example: BP00043"
            }
            value={orderNumber}
            onChange={(event) =>
              setOrderNumber(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            className={`w-full rounded-full bg-white/70 px-5 py-3.5 outline-none ${khmerText}`}
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white ${
              searching ? "bg-gray-400" : "bg-gold"
            } ${khmerText}`}
          >
            <Search className="h-4 w-4" />

            {searching
              ? language === "km"
                ? "កំពុងស្វែងរក..."
                : "Searching..."
              : language === "km"
                ? "តាមដានការបញ្ជាទិញ"
                : "Track Order"}
          </button>
        </GlassCard>

        {error && (
          <p
            className={`mt-4 text-center text-sm text-red-500 ${khmerText}`}
          >
            {error}
          </p>
        )}

        {order && (
          <GlassCard className="mt-6">
            <p
              className={`text-sm text-gray-500 ${khmerText}`}
            >
              {language === "km"
                ? "លេខបញ្ជាទិញ"
                : "Order"}
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {order.order_number ??
                `BP${String(order.id).padStart(5, "0")}`}
            </h2>

            <div className="mt-4">
              <StatusBadge status={order.status} />
            </div>

            <p className="mt-4 text-xl font-bold text-gold">
              ${Number(order.total).toFixed(2)}
            </p>

            <OrderTimeline status={order.status} />
          </GlassCard>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}