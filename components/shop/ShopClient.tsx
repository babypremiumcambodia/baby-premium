"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useLanguage } from "@/components/language/LanguageProvider";

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
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get("brand") ?? "";

  const [search, setSearch] = useState(
  searchParams.get("search") ?? ""
);
  const [selectedCategory, setSelectedCategory] = useState(
  searchParams.get("category") ?? "All"
);

  const filteredProducts = products.filter((product) => {
    const productBrand = product.brand ?? "";
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      productBrand.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

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
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km" ? "ហាងទំនិញ" : "Shop"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "ជ្រើសរើសតែផលិតផលដែលល្អសម្រាប់កូនៗ"
            : "Find premium products for you and your little one."}
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
            <div className="min-w-0">
              <p
                className={`text-xs text-gray-500 ${
                  language === "km"
                    ? "font-khmer leading-6"
                    : ""
                }`}
              >
                {language === "km"
                  ? "ម៉ាកដែលបានជ្រើសរើស"
                  : "Selected brand"}
              </p>

              <p className="truncate font-semibold text-slate-900">
                {selectedBrand}
              </p>
            </div>

            <Link
              href="/shop"
              className={`ml-3 shrink-0 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gold ${
                language === "km"
                  ? "font-khmer leading-6"
                  : ""
              }`}
            >
              {language === "km" ? "សម្អាត" : "Clear"}
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
              <h2
                className={`font-bold ${
                  language === "km"
                    ? "font-khmer text-xl leading-9"
                    : "text-xl"
                }`}
              >
                {language === "km"
                  ? "រកមិនឃើញផលិតផល"
                  : "No products found"}
              </h2>

              <p
                className={`mt-2 text-sm text-gray-500 ${
                  language === "km"
                    ? "font-khmer leading-7"
                    : "leading-6"
                }`}
              >
                {language === "km"
                  ? "សូមសាកល្បងស្វែងរក ប្រភេទ ឬម៉ាកផ្សេងទៀត។"
                  : "Try another search, category, or brand."}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}