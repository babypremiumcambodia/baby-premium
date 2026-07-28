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
        size={20}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#b88932]"
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
          language === "km" ? "ស្វែងរកផលិតផល" : "Search products"
        }
        className="
          w-full rounded-[24px]
          border border-white/70
          bg-white/45
          py-4 pl-14 pr-14
          text-[15px] text-[#17243b]
          shadow-[0_12px_35px_rgba(122,79,22,0.12)]
          outline-none backdrop-blur-2xl
          placeholder:text-[#7a4f16]/45
          transition-all duration-300
          focus:border-[#b88932]/50
          focus:bg-white/65
          focus:shadow-[0_14px_40px_rgba(184,137,50,0.20)]
        "
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
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7a4f16]/50 transition hover:text-[#b88932]"
        >
          <X size={19} />
        </button>
      )}
    </div>
  );
}