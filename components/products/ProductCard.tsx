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
      <GlassCard className="product-glass rounded-[24px] p-2.5">

  <div className="pointer-events-none absolute inset-0">
  <span className="absolute left-0 top-0 h-25 w-14 rounded-tl-[24px] border-l-[1.5px] border-t-[1.5px] border-[#e4cfa0]/45 shadow-[-2px_-2px_8px_rgba(228,207,160,0.10)]" />

  <span className="absolute right-0 top-0 h-25 w-14 rounded-tr-[24px] border-r-[1.5px] border-t-[1.5px] border-[#e4cfa0]/45 shadow-[2px_-2px_8px_rgba(228,207,160,0.10)]" />

  <span className="absolute bottom-0 left-0 h-25 w-14 rounded-bl-[24px] border-b-[1.5px] border-l-[1.5px] border-[#e4cfa0]/45 shadow-[-2px_2px_8px_rgba(228,207,160,0.10)]" />

  <span className="absolute bottom-0 right-0 h-25 w-14 rounded-br-[24px] border-b-[1.5px] border-r-[1.5px] border-[#e4cfa0]/45 shadow-[2px_2px_8px_rgba(228,207,160,0.10)]" />
</div>

        <div className="relative">
  <Image
    src={image}
    alt={name}
    width={140}
    height={140}
    className="mx-auto h-24 w-full object-contain"
  />

</div>

        
        {brand && (
          <p className="-ml-2 mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-gray-400">
            {brand}
          </p>
        )}

        <h3 className="-ml-2 mt-1 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-4 text-slate-900">
          {name}
        </h3>
        <div className="mt-0.5 flex min-w-0 items-center gap-1">
  <p className="-ml-2 mt-0.5 shrink-0 text-[15px] font-bold leading-5 text-gold">
    ${Number(price).toFixed(2)}
  </p>

  <span
  className={`pointer-events-none flex min-w-0 flex-1 translate-x-2 items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(5,150,105,0.90),rgba(110,231,183,0.92))] px-1 py-1 text-[7px] font-semibold text-white shadow-[3px_4px_16px_rgba(5,150,105,0.18),inset_0_1px_1px_rgba(255,255,255,0.65)] backdrop-blur-xl ${
      language === "km"
        ? "font-khmer text-[6px] leading-4 tracking-[-0.05em]"
        : "tracking-[-0.02em]"
    }`}
  >
    {language === "km"
      ? "លក្ខណៈពិសេស និងអត្ថប្រយោជន៍"
      : "Features & Benefits"}
  </span>
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
            className={`relative -left-2 -mr-2 flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[10px] font-semibold text-white transition ${
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
    ? "border-red-200/80 bg-[linear-gradient(to_top,rgba(239,68,68,0.92),rgba(251,113,133,0.88))] text-white shadow-[3px_4px_16px_rgba(239,68,68,0.20),inset_0_1px_1px_rgba(255,255,255,0.60)]"
    : "border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.20))] shadow-[3px_4px_16px_rgba(23,36,59,0.10),inset_0_1px_1px_rgba(255,255,255,0.75)]"
}`}
>
  <Heart
  className={`h-[18px] w-[18px] transition-all duration-200 ${
    favoriteActive
      ? "scale-110 fill-white text-white"
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