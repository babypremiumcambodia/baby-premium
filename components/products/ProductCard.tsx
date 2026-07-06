"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: number;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  stock = 0,
}: ProductProps) {
  const [mounted, setMounted] = useState(false);

  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite(id));
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteActive = mounted && isFavorite;
  const outOfStock = stock <= 0;

  return (
    <Link href={`/product/${id}`}>
      <GlassCard className="p-4">
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={220}
            height={220}
            className="mx-auto object-contain"
          />

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleItem(id);
            }}
            className="absolute right-2 top-2 rounded-full bg-white/70 p-2"
          >
            <Heart
              className={`h-5 w-5 ${
                favoriteActive ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <h3 className="mt-4 font-semibold">{name}</h3>

        <p className="mt-2 text-xl font-bold text-gold">
          ${price.toFixed(2)}
        </p>

        <div className="mt-2">
          {stock === 0 ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              🔴 Out of Stock
            </span>
          ) : stock <= 5 ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
              🟠 Only a Few Left
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              🟢 In Stock
            </span>
          )}
        </div>

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
              alert(`Only ${stock} items are available.`);
            }
          }}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-white ${
            outOfStock ? "bg-gray-400" : "bg-gold"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </GlassCard>
    </Link>
  );
}