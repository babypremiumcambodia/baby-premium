import BrandCard from "./BrandCard";
import { brands } from "@/data/brands";

export default function PopularBrands() {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">
        Popular Brands
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            name={brand.name}
            logo={brand.logo}
          />
        ))}
      </div>
    </section>
  );
}