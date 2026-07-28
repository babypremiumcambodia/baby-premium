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

  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite(id));
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteActive = mounted && isFavorite;
  const outOfStock = stock <= 0;

  return (
    <Link href={`/product/${id}`} className="block h-full">
      <GlassCard className="flex h-full flex-col rounded-[28px] p-4">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={180}
            height={180}
            className="mx-auto h-36 w-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col">
          {brand && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              {brand}
            </p>
          )}

          <h3 className="mt-1 line-clamp-2 min-h-[42px] text-[15px] font-semibold leading-5 text-slate-900">
            {name}
          </h3>

          <p className="mt-1 text-xl font-bold tracking-tight text-gold">
            ${price.toFixed(2)}
          </p>

          <div className="mt-2">
            {outOfStock ? (
              <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                {language === "km" ? "អស់ពីស្តុក" : "Out of Stock"}
              </span>
            ) : stock <= 5 ? (
              <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
                {language === "km" ? "នៅសល់តិច" : "Few Left"}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                {language === "km" ? "មានស្តុក" : "In Stock"}
              </span>
            )}
          </div>

          <div className="mt-auto flex gap-2 pt-4">
            <button
              type="button"
              disabled={outOfStock}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                const added = addItem({
                  id,
                  name,
                  price,
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
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-semibold text-white transition ${
                outOfStock
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gold hover:opacity-90 active:scale-[0.98]"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />

              {outOfStock
                ? language === "km"
                  ? "មិនមាន"
                  : "Unavailable"
                : language === "km"
                  ? "ទិញឥឡូវនេះ"
                  : "Add"}
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
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-md backdrop-blur-xl transition active:scale-95"
            >
              <Heart
                className={`h-5 w-5 ${
                  favoriteActive
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}