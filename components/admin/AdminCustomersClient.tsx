"use client";

import { useState } from "react";
import AdminBackButton from "@/components/admin/AdminBackButton";
import GlassCard from "@/components/ui/GlassCard";
import { Search } from "lucide-react";

type Customer = {
  key: string;
  name: string;
  phone: string;
  telegramId: string;
  lovePoints: number;
};

export default function AdminCustomersClient({
  customers,
}: {
  customers: Customer[];
}) {
  const [search, setSearch] = useState("");

  const keyword = search.trim().toLowerCase();

  const filtered = customers.filter((customer) => {
    if (!keyword) return true;

    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <h1 className="text-4xl font-bold">Customers</h1>

        <p className="mt-2 text-sm text-gray-500">
          {keyword
            ? `Showing ${filtered.length} of ${customers.length} customers`
            : `${customers.length} Customers`}
        </p>

        <div className="glass mt-6 flex items-center rounded-full border border-white/30 px-5 py-3">
          <Search className="mr-4 h-5 w-5 text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone number..."
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <GlassCard className="py-12 text-center">
              <div className="text-5xl">👤</div>

              <h2 className="mt-4 text-xl font-bold">
                No customers found
              </h2>
            </GlassCard>
          ) : (
            filtered.map((customer) => (
              <GlassCard key={customer.key}>
                <h2 className="text-xl font-bold">
                  👤 {customer.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  📞 {customer.phone || "-"}
                </p>

                <p className="mt-2 text-gray-500">
                  💬 Telegram ID
                </p>

                <p className="font-semibold">
                  {customer.telegramId || "-"}
                </p>

                <p className="mt-4 text-lg font-bold text-gold">
                  ❤️ {customer.lovePoints.toLocaleString()} LP
                </p>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </main>
  );
}