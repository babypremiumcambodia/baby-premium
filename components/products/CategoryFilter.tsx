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
    label: { en: "Formula", km: "ម្សៅទឹកដោះគោ" },
  },
  {
    value: "Milk",
    label: { en: "Milk", km: "ទឹកដោះគោ" },
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
    label: { en: "Diapers", km: "ខោទឹកនោម" },
  },
  {
    value: "Essentials",
    label: { en: "Essentials", km: "សម្ភារៈទូទៅ" },
  },
];

export default function CategoryFilter({
  selected,
  onChange,
}: Props) {
  const { language } = useLanguage();

  return (
    <div className="scrollbar-hide mt-5 flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = selected === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`
              shrink-0 rounded-full border px-5 py-3
              text-sm font-semibold
              backdrop-blur-2xl
              transition-all duration-300
              ${
                active
                  ? "border-gold/70 bg-gold/20 text-gold shadow-[0_8px_30px_rgba(212,175,55,0.18)]"
                  : "border-white/40 bg-white/10 text-slate-700 hover:border-white/60 hover:bg-white/20"
              }
            `}
          >
            {category.label[language]}
          </button>
        );
      })}
    </div>
  );
}