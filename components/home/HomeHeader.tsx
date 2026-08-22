"use client";

import TelegramProfile from "@/components/telegram/TelegramProfile";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function HomeHeader() {
  const { language } = useLanguage();

  return (
    <header className="relative flex min-h-12 items-center">
      <div className="w-[140px] shrink-0">
        <p
          className={`whitespace-nowrap text-sm text-gray-500 ${
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
            className={`mt-1 whitespace-nowrap text-[12px] font-medium text-gray-500 ${
             language === "km"
             ? "font-khmer leading-5"
             : "leading-4"
             }`}
             >
              {language === "km"
               ? "បេប៊ី ព្រីមៀម"
               : "B. Premium & Essentials"}
              </p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <TelegramProfile />
      </div>
    </header>
  );
}