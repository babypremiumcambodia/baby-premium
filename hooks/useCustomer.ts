"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegramUser } from "@/hooks/useTelegramUser";

type Customer = {
  id: number;
  telegram_user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  address: string | null;
  love_points: number;
};

export function useCustomer() {
  const telegramUser = useTelegramUser();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      if (!telegramUser?.id) {
        setLoading(false);
        return;
      }

      const telegramId = String(telegramUser.id);

      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("*")
        .eq("telegram_user_id", telegramId)
        .maybeSingle();

      if (existingCustomer) {
        setCustomer(existingCustomer);
        setLoading(false);
        return;
      }

      const { data: newCustomer, error } = await supabase
        .from("customers")
        .insert({
          telegram_user_id: telegramId,
          first_name: telegramUser.first_name ?? null,
          last_name: telegramUser.last_name ?? null,
          username: telegramUser.username ?? null,
        })
        .select("*")
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setCustomer(newCustomer);
      setLoading(false);
    }

    loadCustomer();
  }, [telegramUser]);

  return { customer, loading };
}