"use client";

import { useLanguage } from "@/components/language/LanguageProvider";

type Props = {
  selected: string;
  onChange: (category: string) => void;
};

const categories = [
  {
    value: "All",
    label: { en: "All", km: "ទាំងអស់" },
  },
  {
    value: "Formula",
    label: {
      en: "Formula",
      km: "ម្សៅទឹកដោះគោ",
    },
  },
  {
    value: "Milk",
    label: {
      en: "Milk",
      km: "ទឹកដោះគោ",
    },
  },
  {
    value: "Food & Nutrition",
    label: {
      en: "Food & Nutrition",
      km: "អាហារូបត្ថម្ភ",
    },
  },
  {
    value: "Diapers",
    label: {
      en: "Diapers",
      km: "ខោទឹកនោម",
    },
  },
  {
    value: "Essentials",
    label: {
      en: "Essentials",
      km: "សម្ភារៈទូទៅ",
    },
  },
];

export default function CategoryFilter({
  selected,
  onChange,
}: Props) {
  const { language } = useLanguage();

  return (
    <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = selected === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-2xl transition-all duration-300 ${
              active
                ? "border-gold/60 !bg-transparent text-gold shadow-none"
                : "border-white/40 bg-white/15 text-slate-600 hover:border-white/60 hover:bg-white/30"
            } ${
              language === "km"
                ? "font-khmer leading-6"
                : ""
            }`}
          >
            {category.label[language]}
          </button>
        );
      })}
    </div>
  );
}