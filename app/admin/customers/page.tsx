export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import AdminCustomersClient from "@/components/admin/AdminCustomersClient";

export default async function AdminCustomersPage() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("customer_name, phone, telegram_chat_id, total");

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>{error.message}</p>
      </main>
    );
  }

  const customerMap = new Map();

  for (const order of orders ?? []) {
    const key =
      order.telegram_chat_id?.toString() ||
      order.phone ||
      order.customer_name ||
      `customer-${Math.random()}`;

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        key,
        name: order.customer_name || "Customer",
        phone: order.phone || "-",
        telegramId: order.telegram_chat_id?.toString() || "-",
        lovePoints: 0,
      });
    }

    const customer = customerMap.get(key);
    const total = Number(order.total ?? 0);

    customer.lovePoints += Math.floor(total);
  }

  const customers = Array.from(customerMap.values());

  return <AdminCustomersClient customers={customers} />;
}