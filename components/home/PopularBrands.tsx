import Link from "next/link";

const brands = [
  "Aptamil",
  "A2 Platinum",
  "Bellamy's",
  "Bubs",
  "Ensure",
  "Glucerna",
  "Huggies",
  "PediaSure",
];

export default function PopularBrands() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Popular Brands
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Shop your trusted favourites
          </p>
        </div>

        <Link
          href="/shop"
          className="text-sm font-semibold text-gold"
        >
          View All
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/shop?brand=${encodeURIComponent(brand)}`}
            className="
              flex-shrink-0
              rounded-full
              border
              border-white/60
              bg-white/50
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              backdrop-blur-xl
              transition
              active:scale-95
            "
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  );
}