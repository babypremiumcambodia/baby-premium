"use client";

import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  const { language } = useLanguage();

  return (
    <div className="group relative w-full">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold"
        strokeWidth={2}
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          language === "km"
            ? "ស្វែងរកផលិតផល ឬម៉ាក..."
            : "Search products or brands..."
        }
        aria-label={
          language === "km"
            ? "ស្វែងរកផលិតផល"
            : "Search products"
        }
        className={`w-full rounded-[20px] border border-white/60 bg-white/35 py-3 pl-11 pr-11 text-sm text-[#17243b] shadow-[0_8px_24px_rgba(122,79,22,0.09)] outline-none backdrop-blur-2xl transition-all duration-300 placeholder:text-[#7a4f16]/40 focus:border-gold/40 focus:bg-white/55 ${
          language === "km"
            ? "font-khmer leading-6"
            : ""
        }`}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={
            language === "km"
              ? "សម្អាតការស្វែងរក"
              : "Clear search"
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a4f16]/45 transition hover:text-gold"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      )}
    </div>
  );
}