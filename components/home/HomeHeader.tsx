"use client";

import { Crown } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function HomeHeader() {
  const { language } = useLanguage();

  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {language === "km" ? "សូមស្វាគមន៍" : "Welcome,"}
        </p>

        <p
          className={`mt-1 text-sm font-medium leading-none text-gray-500 ${
            language === "km" ? "font-khmer" : ""
          }`}
        >
          {language === "km" ? "បេប៊ី ព្រីមៀម" : "Baby Premium"}
        </p>
      </div>

    </header>
  );
}