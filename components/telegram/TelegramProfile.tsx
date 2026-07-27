"use client";

import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function TelegramProfile() {
  const user = useTelegramUser();

  if (!user) return null;

  return (
    <div className="mb-6 flex min-h-[90px] items-center gap-4 rounded-3xl bg-white/80 px-5 py-4 shadow">
      {user.photo_url ? (
        <img
          src={user.photo_url}
          alt={user.first_name ?? "Telegram user"}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl font-bold text-white">
          {(user.first_name?.charAt(0) ?? "U").toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm text-gray-500">Hello,</p>

        <h2 className="truncate text-2xl font-bold leading-tight text-slate-900">
          {user.first_name ?? "Customer"} 
        </h2>

        {user.username && (
          <p className="mt-0.5 truncate text-xs text-gray-500">
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
}