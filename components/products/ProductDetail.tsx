"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useLanguage } from "@/components/language/LanguageProvider";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  brand?: string;
  category: string;
  description: string;
  stock: number;
  active: boolean;
};

export default function ProductDetail({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <div className="glass relative z-10 mt-6 rounded-[32px] p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className={`inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[#7a4f16] shadow-sm backdrop-blur-xl transition active:scale-95 ${khmerText}`}
      >
        <ArrowLeft className="h-4 w-4" />

        {language === "km" ? "ត្រឡប់ក្រោយ" : "Back"}
      </button>

      <div className="mt-5 overflow-hidden rounded-[26px] bg-white/35 p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          priority
          className="mx-auto h-72 w-full object-contain"
        />
      </div>

      {product.brand && (
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-gold">
          {product.brand}
        </p>
      )}

      <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900">
        {product.name}
      </h1>

      <p className="mt-4 text-3xl font-bold text-gold">
        ${Number(product.price).toFixed(2)}
      </p>

      <div className="mt-4">
        {outOfStock ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 ${khmerText}`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500" />

            {language === "km"
              ? "អស់ពីស្តុក"
              : "Out of Stock"}
          </span>
        ) : lowStock ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-600 ${khmerText}`}
          >
            <span className="h-2 w-2 rounded-full bg-orange-500" />

            {language === "km"
              ? `នៅសល់តែ ${product.stock}`
              : `Only ${product.stock} Left`}
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 ${khmerText}`}
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />

            {language === "km"
              ? "មានក្នុងស្តុក"
              : "In Stock"}
          </span>
        )}
      </div>

      {product.description && (
        <div className="mt-6 border-t border-white/60 pt-5">
          <h2
            className={`font-bold text-slate-900 ${
              language === "km"
                ? "font-khmer text-lg leading-8"
                : "text-lg"
            }`}
          >
            {language === "km"
              ? "ព័ត៌មានផលិតផល"
              : "Product Details"}
          </h2>

          <p
            className={`mt-2 text-sm text-gray-500 ${
              language === "km"
                ? "font-khmer leading-7"
                : "leading-6"
            }`}
          >
            {product.description}
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          const added = addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            stock: product.stock,
          });

          if (!added) {
            alert(
              language === "km"
                ? `មានផលិតផលតែ ${product.stock} ប៉ុណ្ណោះក្នុងស្តុក។`
                : `Only ${product.stock} items are available.`
            );
            return;
          }

          router.push("/cart");
        }}
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold text-white transition active:scale-[0.98] ${
          outOfStock
            ? "cursor-not-allowed bg-gray-400"
            : "bg-gold hover:opacity-90"
        } ${khmerText}`}
      >
        <ShoppingCart className="h-5 w-5" />

        {outOfStock
          ? language === "km"
            ? "អស់ពីស្តុក"
            : "Out of Stock"
          : language === "km"
            ? "ដាក់ចូលកន្ត្រក"
            : "Add to Cart"}
      </button>
    </div>
  );
}