"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import { useCartStore } from "@/lib/cartStore";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function CartPage() {
  const { language } = useLanguage();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km" ? "កន្ត្រកទំនិញ" : "Shopping Cart"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "ពិនិត្យផលិតផលដែលអ្នកបានជ្រើសរើស មុនពេលបញ្ជាទិញ"
            : "Review your selected products before checkout"}
        </p>

        {items.length === 0 ? (
          <GlassCard className="mt-6 text-center">
            <p
              className={`font-semibold ${
                language === "km"
                  ? "font-khmer leading-7"
                  : ""
              }`}
            >
              {language === "km"
                ? "កន្ត្រករបស់អ្នកទទេ"
                : "Your cart is empty"}
            </p>

            <Link
              href="/shop"
              className={`mt-4 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white ${
                language === "km"
                  ? "font-khmer leading-6"
                  : ""
              }`}
            >
              {language === "km"
                ? "ទៅកាន់ហាង"
                : "Continue Shopping"}
            </Link>
          </GlassCard>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <GlassCard key={item.id}>
                <div className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold leading-6">
                      {item.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        aria-label={
                          language === "km"
                            ? "បន្ថយចំនួន"
                            : "Decrease quantity"
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        aria-label={
                          language === "km"
                            ? "បង្កើនចំនួន"
                            : "Increase quantity"
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 font-bold text-gold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className={`mt-2 text-sm text-red-500 ${
                        language === "km"
                          ? "font-khmer leading-6"
                          : ""
                      }`}
                    >
                      {language === "km" ? "លុបចេញ" : "Remove"}
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}

            <GlassCard>
              <div
                className={`flex items-center justify-between text-xl font-bold ${
                  language === "km"
                    ? "font-khmer leading-8"
                    : ""
                }`}
              >
                <span>
                  {language === "km" ? "សរុបរង" : "Subtotal"}
                </span>

                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className={`mt-5 block w-full rounded-full bg-gold py-4 text-center font-semibold text-white ${
                  language === "km"
                    ? "font-khmer leading-7"
                    : ""
                }`}
              >
                {language === "km"
                  ? "បន្តការទូទាត់"
                  : "Checkout"}
              </Link>
            </GlassCard>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}