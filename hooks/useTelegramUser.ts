"use client";

import { useEffect, useState } from "react";

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const telegramUser =
      window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (telegramUser) {
      window.Telegram?.WebApp?.ready();
      setUser(telegramUser);
    }
  }, []);

  return user;
}