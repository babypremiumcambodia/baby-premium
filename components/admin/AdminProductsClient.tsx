"use client";

import { useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import AdminBackButton from "@/components/admin/AdminBackButton";
import AdminProductSearch from "@/components/admin/AdminProductSearch";

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  price: number;
  stock: number;
};

export default function AdminProductsClient({
  products,
  handleArchive,
}: {
  products: Product[];
  handleArchive: (formData: FormData) => void;
}) {
  const [search, setSearch] = useState("");

  const keyword = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (!keyword) return true;

    return (
      product.name?.toLowerCase().includes(keyword) ||
      product.brand?.toLowerCase().includes(keyword) ||
      product.category?.toLowerCase().includes(keyword) ||
      product.barcode?.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Products</h1>

            <p className="mt-2 text-sm text-gray-500">
              {keyword
                ? `Showing ${filteredProducts.length} of ${products.length} products`
                : `${products.length} Products`}
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-full bg-gold px-5 py-3 font-semibold text-white transition hover:scale-105"
          >
            + Add Product
          </Link>
        </div>

        <AdminProductSearch
          value={search}
          onChange={setSearch}
        />

        <div className="mt-8 space-y-4">
          {filteredProducts.length === 0 ? (
            <GlassCard className="py-12 text-center">
              <div className="text-5xl">📦</div>

              <h2 className="mt-4 text-xl font-bold">
                No products found
              </h2>

              <p className="mt-2 text-gray-500">
                Try another product name or scan a barcode.
              </p>
            </GlassCard>
          ) : (
            filteredProducts.map((product) => (
              <GlassCard
                key={product.id}
                className="flex items-center justify-between"
              >
                <div>
                  <h2 className="text-lg font-bold">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {product.brand}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Barcode: {product.barcode || "-"}
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <span className="font-semibold text-gold">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <span className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-full border px-4 py-2 transition hover:bg-white/20"
                  >
                    Edit
                  </Link>

                  <form action={handleArchive}>
                    <input
                      type="hidden"
                      name="id"
                      value={product.id}
                    />

                    <button
                      className="rounded-full bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                    >
                      Archive
                    </button>
                  </form>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </main>
  );
}