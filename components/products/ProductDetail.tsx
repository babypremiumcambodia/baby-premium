"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

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

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = product.stock <= 0;

  return (
    <div className="glass relative z-10 mt-6 rounded-[32px] p-6">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="mx-auto"
      />

      {product.brand && (
        <p className="mt-6 text-sm font-semibold text-gold">
          {product.brand}
        </p>
      )}

      <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

      <p className="mt-4 text-3xl font-bold text-gold">
        ${product.price.toFixed(2)}
      </p>

      <div className="mt-4">
        {product.stock === 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            🔴 Out of Stock
          </span>
        ) : product.stock <= 5 ? (
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
        onClick={() => {
          const added = addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          });

          if (!added) {
            alert(`Only ${product.stock} items are available.`);
            return;
          }

          router.push("/cart");
        }}
        className={`relative z-[9999] mt-8 w-full cursor-pointer rounded-full py-4 font-semibold text-white ${
          outOfStock ? "bg-gray-400" : "bg-gold"
        }`}
      >
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}