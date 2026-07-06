"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import BottomNavigation from "@/components/layout/BottomNavigation";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  stock: number;
};

export default function ShopClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Shop</h1>

        <p className="mt-2 text-gray-500">
          Find premium products for your baby
        </p>

        <div className="mt-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />

        <div className="mt-8 grid gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              image={product.image}
              stock={product.stock}
            />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}