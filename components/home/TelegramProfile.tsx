"use client";

import { useTelegramUser } from "@/hooks/useTelegramUser";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function TelegramProfile() {
  const user = useTelegramUser();
  const { language } = useLanguage();

  if (!user) return null;

  const customerName =
    user.first_name ??
    (language === "km" ? "អតិថិជន" : "Customer");

  return (
    <div className="glass inline-flex min-w-0 items-center gap-1.5 rounded-full px-1.5 py-1">
      {user.photo_url ? (
        <img
          src={user.photo_url}
          alt={customerName}
          className="h-7 w-7 shrink-0 rounded-full border border-white/70 object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
          {(user.first_name?.charAt(0) ?? "U").toUpperCase()}
        </div>
      )}

      <div className="min-w-0 pr-1.5">
        <p
          className={`text-xs text-gray-500 ${
            language === "km"
              ? "font-khmer leading-5"
              : ""
          }`}
        >
          {language === "km" ? "សួស្តី" : "Hello"}
        </p>

        <p
          className={`max-w-[100px] truncate font-semibold text-slate-900 ${
            language === "km"
              ? "font-khmer text-sm leading-4"
              : "text-[11px]"
          }`}
        >
          {customerName}
        </p>
      </div>
    </div>
  );
}