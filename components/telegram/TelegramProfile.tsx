"use client";

import { useTelegramUser } from "@/hooks/useTelegramUser";

export default function TelegramProfile() {
  const user = useTelegramUser();

  if (!user) return null;

  return (
    <div className="mb-6 flex items-center gap-4 rounded-3xl bg-white/80 p-4 shadow">
      {user.photo_url ? (
        <img
          src={user.photo_url}
          alt={user.first_name}
          className="h-14 w-14 rounded-full"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl font-bold text-white">
          {user.first_name?.charAt(0)}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold">
          Hello, {user.first_name} 👋
        </h2>

        {user.username && (
          <p className="text-sm text-gray-500">
            @{user.username}
          </p>
        )}
      </div>
    </div>
  );
}