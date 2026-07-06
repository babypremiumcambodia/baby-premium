"use client";

import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function TelegramDebug() {
  const telegramUser = useTelegramUser();

  return (
    <p className="mt-2 text-xs text-gray-500">
      Telegram User: {telegramUser?.id ?? "Not detected"}
    </p>
  );
}