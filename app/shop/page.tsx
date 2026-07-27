import { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="p-6">Loading shop...</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}