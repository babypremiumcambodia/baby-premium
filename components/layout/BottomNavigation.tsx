"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Gift,
  ShoppingCart,
  User,
} from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useLanguage } from "@/components/language/LanguageProvider";

const navItems = [
  {
    href: "/",
    label: { en: "Home", km: "ទំព័រដើម" },
    icon: Home,
  },
  {
    href: "/shop",
    label: { en: "Shop", km: "ហាង" },
    icon: ShoppingBag,
  },
  {
    href: "/rewards",
    label: { en: "Rewards", km: "រង្វាន់" },
    icon: Gift,
  },
  {
    href: "/cart",
    label: { en: "Cart", km: "កន្ត្រក" },
    icon: ShoppingCart,
  },
  {
    href: "/profile",
    label: { en: "Me", km: "ខ្ញុំ" },
    icon: User,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const { language } = useLanguage();

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="glass fixed bottom-5 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-around rounded-[32px] px-3 py-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 ${
              active ? "text-gold" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-gold" : "text-gray-500"
                }`}
              />

              {item.href === "/cart" && cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>

            <span
               className={`max-w-full truncate text-[10px] font-medium ${
               language === "km"
               ? "font-khmer leading-5"
               : "leading-4"
               }`}
               >
  {item.label[language]}
</span>
          </Link>
        );
      })}
    </nav>
  );
}