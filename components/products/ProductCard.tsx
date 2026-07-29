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
      <GlassCard className="rounded-[20px] p-2.5">
        <Image
          src={image}
          alt={name}
          width={140}
          height={140}
          className="mx-auto h-24 w-full object-contain"
        />

        {brand && (
          <p className="mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            {brand}
          </p>
        )}

        <h3 className="mt-1 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-slate-900">
          {name}
        </h3>

        <p className="mt-0.5 text-base font-bold leading-5 text-gold">
          ${Number(price).toFixed(2)}
        </p>

        <div className="mt-1">
          {outOfStock ? (
            <span
              className={`inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-semibold text-red-600 ${khmerText}`}
            >
              {language === "km"
                ? "អស់ពីស្តុក"
                : "Out of Stock"}
            </span>
          ) : stock <= 5 ? (
            <span
              className={`inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[8px] font-semibold text-orange-600 ${khmerText}`}
            >
              {language === "km"
                ? "នៅសល់តិច"
                : "Few Left"}
            </span>
          ) : (
            <span
              className={`inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-semibold text-green-700 ${khmerText}`}
            >
              {language === "km"
                ? "មានស្តុក"
                : "In Stock"}
            </span>
          )}
        </div>

        <div className="flex gap-1 pt-2">
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
            className={`flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1.5 text-[9px] font-semibold text-white transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gold hover:opacity-90 active:scale-[0.98]"
            } ${khmerText}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />

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
              language === "km"
                ? "បន្ថែម ឬដកចេញពីចំណូលចិត្ត"
                : "Toggle favorite"
            }
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleItem(id);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-sm transition active:scale-95"
          >
            <Heart
              className={`h-4 w-4 ${
                favoriteActive
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </GlassCard>
    </Link>
  );
}