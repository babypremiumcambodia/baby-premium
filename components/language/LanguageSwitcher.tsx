"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/45 p-1 shadow-[0_8px_25px_rgba(122,79,22,0.12)] backdrop-blur-2xl">
      <Languages size={17} className="ml-2 text-[#b88932]" />

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          language === "en"
            ? "bg-[#b88932] text-white shadow-sm"
            : "text-[#7a4f16]"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("km")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          language === "km"
            ? "bg-[#b88932] text-white shadow-sm"
            : "text-[#7a4f16]"
        }`}
      >
        ខ្មែរ
      </button>
    </div>
  );
}