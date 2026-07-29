"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

type Order = {
  id: number;
  order_number: string | null;
  total: number;
  status: string;
};

function getTelegramInitData() {
  const telegramWebApp = window.Telegram?.WebApp as
    | {
        initData?: string;
      }
    | undefined;

  return telegramWebApp?.initData ?? "";
}

function KHQRContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();

  const orderId = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setErrorMessage(
          language === "km"
            ? "មិនមានលេខបញ្ជាទិញ"
            : "Order number is missing."
        );

        setLoading(false);
        return;
      }

      const initData = getTelegramInitData();

      if (!initData) {
        setErrorMessage(
          language === "km"
            ? "សូមបើកកម្មវិធីនេះនៅក្នុង Telegram ដើម្បីបង់ប្រាក់"
            : "Open this app inside Telegram to make payment."
        );

        setLoading(false);
        return;
      }

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
          setErrorMessage(
            language === "km"
              ? "មិនអាចផ្ទុកការបញ្ជាទិញបានទេ"
              : result.error ?? "Failed to load order."
          );

          return;
        }

        const customerOrders: Order[] =
          result.orders ?? [];

        const matchedOrder = customerOrders.find(
          (item) => item.id === Number(orderId)
        );

        if (!matchedOrder) {
          setErrorMessage(
            language === "km"
              ? "រកមិនឃើញការបញ្ជាទិញនេះក្នុងគណនីរបស់អ្នក"
              : "This order was not found in your account."
          );

          return;
        }

        setOrder(matchedOrder);
      } catch (error) {
        console.error("Load KHQR order error:", error);

        setErrorMessage(
          language === "km"
            ? "មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត"
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, language]);

  async function handlePaid() {
    if (!order || submitting) return;

    const initData = getTelegramInitData();

    if (!initData) {
      alert(
        language === "km"
          ? "សូមបើកកម្មវិធីនេះនៅក្នុង Telegram"
          : "Please open this app inside Telegram."
      );

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/orders/payment-submitted",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData,
            orderId: order.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          language === "km"
            ? "មិនអាចបញ្ជូនព័ត៌មានការបង់ប្រាក់បានទេ"
            : result.error ??
                "Failed to submit payment."
        );

        return;
      }

      alert(
        language === "km"
          ? "បានបញ្ជូនការបង់ប្រាក់។ យើងនឹងពិនិត្យឆាប់ៗនេះ។"
          : "Payment submitted. We’ll verify it shortly."
      );

      const orderNumber =
        order.order_number ??
        `BP${String(order.id).padStart(5, "0")}`;

      router.push(
        `/order-success?order=${encodeURIComponent(
          orderNumber
        )}`
      );
    } catch (error) {
      console.error(
        "Submit KHQR payment error:",
        error
      );

      alert(
        language === "km"
          ? "មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត"
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <main className="min-h-screen bg-premium px-5 py-8">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[#7a4f16] shadow-sm backdrop-blur-xl transition active:scale-95 ${khmerText}`}
        >
          <ArrowLeft className="h-4 w-4" />

          {language === "km" ? "ត្រឡប់ក្រោយ" : "Back"}
        </button>

        <div className="text-center">
          <h1
            className={`font-bold ${
              language === "km"
                ? "font-khmer text-3xl leading-[1.6]"
                : "text-4xl leading-tight"
            }`}
          >
            {language === "km"
              ? "ការបង់ប្រាក់ KHQR"
              : "KHQR Payment"}
          </h1>

          <p
            className={`text-gray-500 ${
              language === "km"
                ? "font-khmer mt-3 text-sm leading-7"
                : "mt-2 text-sm leading-6"
            }`}
          >
            {language === "km"
              ? "ស្កេនកូដ QR ខាងក្រោម ដើម្បីបង់ប្រាក់"
              : "Scan the QR code below to complete payment."}
          </p>
        </div>

        {loading && (
          <div className="glass mt-6 rounded-2xl p-5 text-center">
            <p className={`text-gray-500 ${khmerText}`}>
              {language === "km"
                ? "កំពុងផ្ទុកការបញ្ជាទិញ..."
                : "Loading order..."}
            </p>
          </div>
        )}

        {errorMessage && !loading && (
          <div className="glass mt-6 rounded-2xl p-5 text-center">
            <p
              className={`text-sm text-red-500 ${khmerText}`}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {order && (
          <>
            <div className="glass mt-6 rounded-2xl p-4 text-center">
              <p
                className={`text-sm text-gray-500 ${khmerText}`}
              >
                {language === "km"
                  ? "លេខបញ្ជាទិញ"
                  : "Order"}
              </p>

              <p className="mt-1 font-bold">
                {order.order_number ??
                  `BP${String(order.id).padStart(5, "0")}`}
              </p>

              <p className="mt-2 text-3xl font-bold text-gold">
                ${Number(order.total).toFixed(2)}
              </p>
            </div>

            <div className="mt-6 rounded-[30px] border border-white/70 bg-white p-4 shadow-[0_12px_35px_rgba(122,79,22,0.12)]">
              <img
                src="/payment/khqr.png"
                alt="KHQR payment code"
                className="mx-auto w-full rounded-2xl"
              />
            </div>

            <div className="glass mt-5 rounded-2xl p-4">
              <p
                className={`text-center text-sm text-gray-500 ${khmerText}`}
              >
                {language === "km"
                  ? "បន្ទាប់ពីបង់ប្រាក់រួច សូមចុចប៊ូតុងខាងក្រោម"
                  : "After completing payment, tap the button below."}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePaid}
              disabled={submitting}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold text-white transition ${
                submitting ? "bg-gray-400" : "bg-gold"
              } ${khmerText}`}
            >
              <CheckCircle2 className="h-5 w-5" />

              {submitting
                ? language === "km"
                  ? "កំពុងបញ្ជូន..."
                  : "Submitting..."
                : language === "km"
                  ? "ខ្ញុំបានបង់ប្រាក់រួច"
                  : "I’ve Paid"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function KHQRPage() {
  return (
    <Suspense fallback={null}>
      <KHQRContent />
    </Suspense>
  );
}