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
    <div className="glass inline-flex h-10 min-w-0 items-center gap-1.5 rounded-full border border-white/60 !bg-white/15 px-1.5 shadow-[0_6px_20px_rgba(23,36,59,0.06)] backdrop-blur-2xl">
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
          className={`text-[9px] text-gray-500 ${
            language === "km"
              ? "font-khmer leading-4"
              : ""
          }`}
        >
          {language === "km" ? "សួស្តី" : "Hello"}
        </p>

        <p
          className={`truncate font-normal text-slate-900 ${
  language === "km"
    ? "max-w-[100px] font-khmer text-[10px] leading-4"
    : "max-w-[75px] text-[9px] leading-3"
}`}
        >
          {customerName}
        </p>
      </div>
    </div>
  );
}