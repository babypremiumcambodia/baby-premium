"use client";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { useLanguage } from "@/components/language/LanguageProvider";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  const { language } = useLanguage();
  const featuredProducts = products.slice(0, 4);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2
            className={`font-bold text-slate-900 ${
              language === "km"
                ? "font-khmer text-xl leading-9"
                : "text-xl"
            }`}
          >
            {language === "km"
              ? "ផលិតផលពិសេស"
              : "Featured Products"}
          </h2>

          <p
            className={`mt-1 text-sm text-gray-500 ${
              language === "km"
                ? "font-khmer leading-7"
                : "leading-6"
            }`}
          >
            {language === "km"
              ? "ពេញនិយមប្រើប្រាស់ Baby Premium+"
              : "Popular picks from Baby Premium+"}
          </p>
        </div>

        <Link
          href="/shop"
          className={`shrink-0 text-sm font-semibold text-gold ${
            language === "km"
              ? "font-khmer leading-7"
              : ""
          }`}
        >
          {language === "km" ? "មើលទាំងអស់" : "View All"}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {featuredProducts.map((product) => (
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
    </section>
  );
}