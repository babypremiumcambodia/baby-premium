"use client";

import TelegramProfile from "@/components/telegram/TelegramProfile";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function HomeHeader() {
  const { language } = useLanguage();

  return (
    <header className="relative flex min-h-12 items-center">
      <div className="min-w-0 max-w-[105px]">
        <p
          className={`truncate text-sm text-gray-500 ${
            language === "km"
              ? "font-khmer leading-5"
              : ""
          }`}
        >
          {language === "km"
            ? "សូមស្វាគមន៍"
            : "Welcome,"}
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

      <div className="absolute left-1/2 -translate-x-1/2">
        <TelegramProfile />
      </div>
    </header>
  );
}