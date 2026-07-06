"use client";

import BottomNavigation from "@/components/layout/BottomNavigation";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { useWishlistStore } from "@/lib/wishlistStore";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items);

  const favoriteProducts = products.filter((product) =>
    wishlistItems.some((item) => item.id === product.id)
  );

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <p className="mt-2 text-gray-500">Your favorite baby products</p>

        <div className="mt-8 grid gap-5">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No favorite products yet.
            </p>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}