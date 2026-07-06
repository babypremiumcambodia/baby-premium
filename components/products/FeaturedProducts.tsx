import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Featured Products</h2>

      <div className="grid gap-5">
        {products.map((product) => (
          <ProductCard
            id={product.id}
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}