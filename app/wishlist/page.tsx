"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ProductCard from "@/components/products/ProductCard";
import GlassCard from "@/components/ui/GlassCard";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useLanguage } from "@/components/language/LanguageProvider";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  brand: string | null;
  price: number;
  image: string;
  stock: number;
};

export default function WishlistPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const wishlistItems = useWishlistStore((state) => state.items);

  const [favoriteProducts, setFavoriteProducts] = useState<
    Product[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavoriteProducts() {
      const favoriteIds = wishlistItems.map((item) => item.id);

      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, price, image, stock")
        .in("id", favoriteIds)
        .eq("active", true);

      if (error) {
        console.error("Failed to load wishlist:", error);
        setFavoriteProducts([]);
      } else {
        setFavoriteProducts(
          (data ?? []).map((product) => ({
            ...product,
            id: Number(product.id),
            price: Number(product.price),
            stock: Number(product.stock ?? 0),
          }))
        );
      }

      setLoading(false);
    }

    loadFavoriteProducts();
  }, [wishlistItems]);

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[#7a4f16] shadow-sm backdrop-blur-xl transition active:scale-95 ${khmerText}`}
        >
          <ArrowLeft className="h-4 w-4" />

          {language === "km" ? "ត្រឡប់ក្រោយ" : "Back"}
        </button>

        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km"
            ? "បញ្ជីចំណូលចិត្ត"
            : "My Wishlist"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "ផលិតផលដែលអ្នកចូលចិត្ត។"
            : "Your favorite baby products."}
        </p>

        {loading ? (
          <GlassCard className="mt-8 text-center">
            <p className={`text-gray-500 ${khmerText}`}>
              {language === "km"
                ? "កំពុងផ្ទុកផលិតផល..."
                : "Loading products..."}
            </p>
          </GlassCard>
        ) : favoriteProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 items-stretch gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
                stock={product.stock}
              />
            ))}
          </div>
        ) : (
          <GlassCard className="mt-8 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Heart className="h-8 w-8 text-red-400" />
            </div>

            <h2
              className={`mt-4 font-bold ${
                language === "km"
                  ? "font-khmer text-lg leading-8"
                  : "text-lg"
              }`}
            >
              {language === "km"
                ? "មិនទាន់មានផលិតផលដែលចូលចិត្ត"
                : "No favorites yet"}
            </h2>

            <p
              className={`mt-2 text-sm text-gray-500 ${khmerText}`}
            >
              {language === "km"
                ? "ចុចរូបបេះដូងលើផលិតផល ដើម្បីរក្សាទុកនៅទីនេះ។"
                : "Tap the heart on a product to save it here."}
            </p>
          </GlassCard>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}