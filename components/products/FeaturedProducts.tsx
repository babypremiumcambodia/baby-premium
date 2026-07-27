import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/products";

export default async function FeaturedProducts() {
  const products = await getProducts();

  const featuredProducts = products.slice(0, 6);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          Featured Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Our most popular products
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={Number(product.id)}
            name={product.name}
            brand={product.brand ?? null}
            price={Number(product.price)}
            image={product.image}
            stock={Number(product.stock ?? 0)}
          />
        ))}
      </div>
    </section>
  );
}