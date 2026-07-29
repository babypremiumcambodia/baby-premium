"use client";

import Link from "next/link";
import {
  Baby,
  Layers,
  Heart,
  Wheat,
  GlassWater,
  Gift,
} from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

const categories = [
  {
    value: "Formula",
    label: {
      en: "Baby Formula",
      km: "ម្សៅទឹកដោះគោ",
    },
    icon: Baby,
  },
  {
    value: "Diapers",
    label: {
      en: "Diapers",
      km: "ខោទឹកនោម",
    },
    icon: Layers,
  },
  {
    value: "Essentials",
    label: {
      en: "Essentials",
      km: "សម្ភារៈទូទៅ",
    },
    icon: Heart,
  },
  {
    value: "Food & Nutrition",
    label: {
      en: "Nutrition",
      km: "អាហារូបត្ថម្ភ",
    },
    icon: Wheat,
  },
  {
    value: "Milk",
    label: {
      en: "Milk",
      km: "ទឹកដោះគោ",
    },
    icon: GlassWater,
  },
  {
    value: "All",
    label: {
      en: "Promotions",
      km: "ប្រូម៉ូសិន",
    },
    icon: Gift,
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
        {categories.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.value}
              href={`/shop?category=${encodeURIComponent(
                item.value
              )}`}
              className="group glass rounded-[28px] p-5 text-left transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Icon
               className="h-8 w-8 text-gold"
               strokeWidth={1.8}
              />

              <p
                className={`mt-4 font-semibold ${
                  language === "km"
                    ? "font-khmer leading-7"
                    : ""
                }`}
              >
                {item.label[language]}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}