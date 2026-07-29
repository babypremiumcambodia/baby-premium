"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { useLanguage } from "@/components/language/LanguageProvider";

type ProductProps = {
  id: number;
  name: string;
  brand?: string | null;
  price: number;
  image: string;
  stock?: number;
};

export default function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  stock = 0,
}: ProductProps) {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();

  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );

  const isFavorite = useWishlistStore((state) =>
    state.isFavorite(id)
  );

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteActive = mounted && isFavorite;
  const outOfStock = stock <= 0;

  const khmerText =
    language === "km" ? "font-khmer leading-5" : "";

  return (
    <Link
      href={`/product/${id}`}
      className="block self-start"
    >
      <GlassCard className="rounded-[24px] border border-white/80 !bg-white/45 p-2.5 shadow-[0_12px_35px_rgba(122,79,22,0.06)] backdrop-blur-[30px]">
        <div className="relative">
  <Image
    src={image}
    alt={name}
    width={140}
    height={140}
    className="mx-auto h-24 w-full object-contain"
  />

  <span
    className={`absolute -right-2.5 -top-1 rounded-full border border-[#d8c49a]/55 bg-white/15 px-2 py-1 text-[8px] font-semibold text-[#a48754] shadow-sm backdrop-blur-xl ${
  language === "km"
    ? "font-khmer leading-4"
    : ""
}`}
  >
    {language === "km" ? "ព័ត៌មាន" : "Details"}
  </span>
</div>

        
        {brand && (
          <p className="-ml-2 mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            {brand}
          </p>
        )}

        <h3 className="-ml-2 mt-1 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-slate-900">
          {name}
        </h3>
        <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="-ml-2 mt-0.5 text-base font-bold leading-5 text-gold">
          ${Number(price).toFixed(2)}
        </p>

        
          {outOfStock ? (
            <span
              className={`relative -right-2.5 inline-flex rounded-full border border-red-200/60 bg-white/15 px-2 py-0.5 text-[8px] font-semibold text-red-500/80 shadow-sm backdrop-blur-xl ${khmerText}`}
              >
              {language === "km"
                ? "អស់ពីស្តុក"
                : "Out of Stock"}
            </span>
          ) : stock <= 5 ? (
            <span
              className={`relative -right-2.5 inline-flex rounded-full border border-orange-200/60 bg-white/15 px-2 py-0.5 text-[8px] font-semibold text-orange-500/80 shadow-sm backdrop-blur-xl ${khmerText}`}
              >
              {language === "km"
                ? "នៅសល់តិច"
                : "Few Left"}
            </span>
          ) : (
            <span
              className={`relative -right-2.5 inline-flex rounded-full border border-emerald-200/60 bg-white/15 px-2 py-0.5 text-[8px] font-semibold text-emerald-600/80 shadow-sm backdrop-blur-xl ${khmerText}`}
              >
              {language === "km"
                ? "មានស្តុក"
                : "In Stock"}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-0">
          <button
            type="button"
            disabled={outOfStock}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              const added = addItem({
                id,
                name,
                price: Number(price),
                image,
                stock,
              });

              if (!added) {
                alert(
                  language === "km"
                    ? `មានផលិតផលតែ ${stock} ប៉ុណ្ណោះក្នុងស្តុក។`
                    : `Only ${stock} items are available.`
                );
              }
            }}
            className={`relative -left-2 flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[10px] font-semibold text-white transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gold hover:opacity-90 active:scale-[0.98]"
            } ${khmerText}`}
          >
            <ShoppingCart className="h-5 w-5 shrink-0" />

            <span className="truncate">
              {outOfStock
                ? language === "km"
                  ? "មិនមាន"
                  : "Unavailable"
                : language === "km"
                  ? "ទិញឥឡូវនេះ"
                  : "Add"}
            </span>
          </button>

          <button
  type="button"
  aria-label={
    favoriteActive
      ? language === "km"
        ? "ដកចេញពីចំណូលចិត្ត"
        : "Remove from wishlist"
      : language === "km"
        ? "បន្ថែមទៅចំណូលចិត្ត"
        : "Add to wishlist"
  }
  onClick={(event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(id);
  }}
  className={`relative -right-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-2xl transition-all duration-200 active:scale-90 ${
    favoriteActive
      ? "border-red-200/70 bg-red-50/40 shadow-[0_5px_16px_rgba(239,68,68,0.16)]"
      : "border-white/70 bg-white/20 shadow-[0_5px_16px_rgba(23,36,59,0.08)]"
  }`}
>
  <Heart
    className={`h-[18px] w-[18px] transition-all duration-200 ${
      favoriteActive
        ? "scale-110 fill-red-500 text-red-500"
        : "text-slate-400"
    }`}
    strokeWidth={2}
  />
</button>
        </div>
      </GlassCard>
    </Link>
  );
}