import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

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
  const featuredProducts = products.slice(0, 4);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Featured Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Popular picks from Baby Premium+
          </p>
        </div>

        <Link
          href="/shop"
          className="flex-shrink-0 text-sm font-semibold text-gold"
        >
          View All
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