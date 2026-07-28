"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useCartStore } from "@/lib/cartStore";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function OrderSummary() {
  const { language } = useLanguage();
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 1.5 : 0;
  const total = subtotal + deliveryFee;
  const lovePoints = Math.floor(total);

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <GlassCard className="mt-6">
      <h2
        className={`text-xl font-bold ${
          language === "km"
            ? "font-khmer leading-9"
            : ""
        }`}
      >
        {language === "km"
          ? "សង្ខេបនៃការបញ្ជាទិញ"
          : "Order Summary"}
      </h2>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={khmerText}>
            {language === "km" ? "សរុបរង" : "Subtotal"}
          </span>

          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={khmerText}>
            {language === "km"
              ? "ថ្លៃដឹកជញ្ជូន"
              : "Delivery"}
          </span>

          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
          <span className={khmerText}>
            {language === "km" ? "សរុប" : "Total"}
          </span>

          <span>${total.toFixed(2)}</span>
        </div>

        <div
          className={`mt-4 rounded-2xl bg-gold/10 p-3 text-center ${
            language === "km"
              ? "font-khmer leading-7"
              : ""
          }`}
        >
          ❤️{" "}
          {language === "km" ? (
            <>
              ទទួលបាន <strong>{lovePoints}</strong> Love Points
            </>
          ) : (
            <>
              Earn <strong>{lovePoints}</strong> Love Points
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}