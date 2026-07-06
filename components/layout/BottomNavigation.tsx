"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/rewards", label: "Rewards", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/profile", label: "Me", icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="glass fixed bottom-5 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-around rounded-[32px] px-3 py-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
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
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}