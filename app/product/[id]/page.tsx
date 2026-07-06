import Link from "next/link";
import ProductDetail from "@/components/products/ProductDetail";
import { getProduct } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-premium px-5 py-8">
      <div className="mx-auto max-w-md">
        <Link
          href="/shop"
          className="font-semibold text-gold"
        >
          ← Back
        </Link>

        <ProductDetail product={product} />
      </div>
    </main>
  );
}