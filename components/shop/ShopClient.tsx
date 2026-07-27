"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import BottomNavigation from "@/components/layout/BottomNavigation";

type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  image: string;
  stock: number;
};

export default function ShopClient({
  products,
}: {
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get("brand") ?? "";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const productBrand = product.brand ?? "";

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      productBrand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesBrand =
      !selectedBrand ||
      productBrand.toLowerCase() === selectedBrand.toLowerCase();

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Shop</h1>

        <p className="mt-2 text-gray-500">
          Find premium products
        </p>

        <div className="mt-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        {selectedBrand && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/60 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-xl">
            <div>
              <p className="text-xs text-gray-500">
                Selected brand
              </p>

              <p className="font-semibold text-slate-900">
                {selectedBrand}
              </p>
            </div>

            <Link
              href="/shop"
              className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gold"
            >
              Clear
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 items-stretch gap-4">
  {filteredProducts.map((product) => (
    <ProductCard
      key={product.id}
      id={product.id}
      name={product.name}
      brand={product.brand}
      price={Number(product.price)}
      image={product.image}
      stock={product.stock}
    />
  ))}

  {filteredProducts.length === 0 && (
    <div className="col-span-2 rounded-3xl border border-white/60 bg-white/50 px-5 py-10 text-center backdrop-blur-xl">
      <h2 className="text-xl font-bold">No products found</h2>

      <p className="mt-2 text-sm text-gray-500">
        Try another search, category, or brand.
      </p>
    </div>
  )}
</div>
      </div>

      <BottomNavigation />
    </main>
  );
}