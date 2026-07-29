"use client";

import Link from "next/link";
import {
  Heart,
  Gift,
  Package,
  ChevronRight,
  User,
  Truck,
} from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";
import { useCustomer } from "@/hooks/useCustomer";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function ProfilePage() {
  const { customer, loading } = useCustomer();
  const { language } = useLanguage();

  const displayName = loading
    ? language === "km"
      ? "កំពុងផ្ទុក..."
      : "Loading..."
    : customer
      ? `${customer.first_name ?? ""} ${
          customer.last_name ?? ""
        }`.trim() ||
        customer.username ||
        (language === "km"
          ? "សមាជិក Baby Premium+"
          : "Baby Premium+ Member")
      : language === "km"
        ? "សមាជិក ឬ អតិថិជនថ្មី"
        : "Membership/Guest User";

  const menuTextClass =
    language === "km"
      ? "font-khmer font-semibold leading-7"
      : "font-semibold";

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km"
            ? "ប្រវត្តិរូបរបស់ខ្ញុំ"
            : "My Profile"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "គ្រប់គ្រងគណនី និងមើលព័ត៌មានរបស់អ្នក"
            : "Manage your account and view your information"}
        </p>

        <GlassCard className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/20">
              <User className="h-8 w-8 text-gold" />
            </div>

            <div className="min-w-0 flex-1">
              <h2
                className={`truncate text-xl font-bold ${
                  language === "km"
                    ? "font-khmer leading-9"
                    : ""
                }`}
              >
                {displayName}
              </h2>

              {customer?.username && (
                <p className="truncate text-sm text-gray-500">
                  @{customer.username}
                </p>
              )}

              <p
                className={`mt-2 font-semibold text-gold ${
                  language === "km"
                    ? "font-khmer leading-7"
                    : ""
                }`}
              >
                {customer?.love_points ?? 0} Love Points
              </p>
            </div>
          </div>
        </GlassCard>

        <Link href="/wishlist">
          <GlassCard className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Heart className="h-6 w-6 shrink-0 text-red-500" />

                <span className={menuTextClass}>
                  {language === "km"
                    ? "បញ្ជីចំណូលចិត្ត"
                    : "My Wishlist"}
                </span>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/orders">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Package className="h-6 w-6 shrink-0 text-gold" />

                <span className={menuTextClass}>
                  {language === "km"
                    ? "ការបញ្ជាទិញរបស់ខ្ញុំ"
                    : "My Orders"}
                </span>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/track-order">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Truck className="h-6 w-6 shrink-0 text-gold" />

                <span className={menuTextClass}>
                  {language === "km"
                    ? "តាមដានការបញ្ជាទិញ"
                    : "Track Order"}
                </span>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/rewards">
          <GlassCard className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Gift className="h-6 w-6 shrink-0 text-gold" />

                <span className={menuTextClass}>
                  {language === "km"
                    ? "កាដូរសម្រាប់ការសន្សំពិន្ទុ"
                    : "Thank You Gifts"}
                </span>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </div>
          </GlassCard>
        </Link>
      </div>

      <BottomNavigation />
    </main>
  );
}