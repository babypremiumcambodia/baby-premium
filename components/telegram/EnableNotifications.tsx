"use client";

import { Bell } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function EnableNotifications() {
  const { language } = useLanguage();

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <div className="glass mt-4 rounded-[28px] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
          <Bell className="h-5 w-5 text-gold" />
        </div>

        <div className="min-w-0">
          <h3
            className={`font-bold text-slate-900 ${
              language === "km"
                ? "font-khmer leading-8"
                : ""
            }`}
          >
            {language === "km"
              ? "បើកការជូនដំណឹងអំពីការបញ្ជាទិញ"
              : "Enable Order Notifications"}
          </h3>

          <p
            className={`mt-1 text-sm text-gray-500 ${khmerText}`}
          >
            {language === "km"
              ? "ទទួលការជូនដំណឹង នៅពេលការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់ កំពុងរៀបចំ ដឹកជញ្ជូន ឬបានដឹកជញ្ជូនរួចរាល់"
              : "Get updates when your order is confirmed, prepared, shipped, or delivered"}
          </p>
        </div>
      </div>

      <a
        href="https://t.me/babypremiumbabybot"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 block rounded-full bg-gold py-3 text-center font-semibold text-white transition hover:opacity-90 active:scale-[0.98] ${khmerText}`}
      >
        {language === "km"
          ? "បើកការជូនដំណឹង"
          : "Enable Notifications"}
      </a>
    </div>
  );
}