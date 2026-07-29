"use client";

import TelegramProfile from "@/components/home/TelegramProfile";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function HomeHeader() {
  const { language } = useLanguage();

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`text-sm text-gray-500 ${
            language === "km" ? "font-khmer leading-5" : ""
          }`}
        >
          {language === "km" ? "សូមស្វាគមន៍" : "Welcome,"}
        </p>

        <p
          className={`mt-1 truncate text-sm font-medium leading-none text-gray-500 ${
            language === "km" ? "font-khmer" : ""
          }`}
        >
          {language === "km"
            ? "បេប៊ី ព្រីមៀម"
            : "Baby Premium"}
        </p>
      </div>

      <TelegramProfile />
    </header>
  );
}