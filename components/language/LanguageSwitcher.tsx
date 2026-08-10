"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  // Hide the language selector only on the POS page
  if (pathname.startsWith("/admin/pos")) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#ead7b7] bg-white/90 p-1 shadow-sm backdrop-blur">
      <Languages className="ml-2 h-4 w-4 text-[#b88932]" />

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