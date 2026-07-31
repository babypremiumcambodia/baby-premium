"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language/LanguageProvider";

const categories = [
  {
    value: "Formula",
    label: {
      en: "Baby Formula",
      km: "ម្សៅទឹកដោះគោ",
    },
    image: "/categories/baby-formula.png",
    scale: 1.2
  },
  {
    value: "Diapers",
    label: {
      en: "Diapers",
      km: "ខោទឹកនោម",
    },
    image: "/categories/diapers.png",
    scale: 1.1
    
  },
  {
    value: "Milk",
    label: {
      en: "Milk & Health",
      km: "ទឹកដោះគោ និងសុខភាព",
    },
    image:
      "/categories/milk.png",
      scale: 1.25
  },
  {
    value: "Essentials",
    label: {
      en: "Essentials",
      km: "សម្ភារៈទូទៅ",
    },
    image:
      "/categories/essentials-v2.png",
      scale: 0.95
  },
  {
    value: "Food & Nutrition",
    label: {
      en: "Food & Nutrition",
      km: "អាហារូបត្ថម្ភ",
    },
    image: "/categories/nutrition.png",
    scale: 1.3
  },
  {
    value: "All",
    label: {
      en: "Promotions",
      km: "ប្រូម៉ូសិន",
    },
    image: "/categories/promotions.png",
    scale: 1
  },
];

export default function CategoryGrid() {
  const { language } = useLanguage();

  return (
    <>
      <h2
        className={`mb-4 mt-8 font-bold ${
          language === "km"
            ? "font-khmer text-xl leading-9"
            : "text-2xl"
        }`}
      >
        {language === "km"
          ? "ប្រភេទទំនិញ"
          : "Shop Categories"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((item) => (
          <Link
            key={item.value}
            href={`/shop?category=${encodeURIComponent(
              item.value
            )}`}
             className="group glass rounded-[28px] p-4 text-left transition-all hover:scale-[1.03] active:scale-[0.98]"
  style={{
    background: "rgba(255, 255, 255, 0.22)",
    border: "1.5px solid rgba(255, 255, 255, 0.65)",
    boxShadow:
      "0 12px 35px rgba(184, 137, 50, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.75)",
  }}

          >
            <div className="flex h-[90px] items-center justify-center">
  <Image
    src={item.image}
    alt={item.label[language]}
    width={90}
    height={90}
    style={{
      transform: `scale(${item.scale})`,
    }}
    className="h-[90px] w-[90px] rounded-[20px] object-cover"
  />
</div>

            <p
              className={`mt-3 text-center font-semibold ${
                language === "km"
                  ? "font-khmer text-sm leading-7"
                  : "text-sm"
              }`}
            >
              {item.label[language]}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}