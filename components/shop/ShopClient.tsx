"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/products/SearchBar";
import CategoryFilter from "@/components/products/CategoryFilter";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useLanguage } from "@/components/language/LanguageProvider";

type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  image: string;
  stock: number;
};

type SubcategoryOption = {
  value: string;
  label: {
    en: string;
    km: string;
  };
};

const subcategoryOptions: Record<
  string,
  SubcategoryOption[]
> = {
  Formula: [
    {
      value: "Cow's Milk",
      label: {
        en: "Cow's Milk",
        km: "ទឹកដោះគោ",
      },
    },
    {
      value: "A2 & Organic",
      label: {
        en: "A2 & Organic",
        km: "A2 និងសរីរាង្គ",
      },
    },
    {
      value: "Goat Milk",
      label: {
        en: "Goat Milk",
        km: "ទឹកដោះពពែ",
      },
    },
    {
      value: "Sensitive & Allergy",
      label: {
        en: "Sensitive & Allergy",
        km: "ងាយប្រតិកម្ម និងអាឡែស៊ី",
      },
    },
  ],

  Milk: [
    {
      value: "Kids Milk",
      label: {
        en: "Kids Milk",
        km: "សម្រាប់កូនៗ",
      },
    },
    {
      value: "Adult & Senior",
      label: {
        en: "Adult & Senior",
        km: "មនុស្សពេញវ័យ និងមនុស្សចាស់",
      },
    },
    {
      value: "Pregnancy",
      label: {
        en: "Pregnancy",
        km: "សម្រាប់ស្ត្រីមានផ្ទៃពោះ និងបំបៅដោះកូន",
      },
    },
  ],

  "Food & Nutrition": [
    {
      value: "Cereal",
      label: {
        en: "Cereal",
        km: "បបរ",
      },
    },
    {
      value: "Snacks",
      label: {
        en: "Snacks",
        km: "នំ",
      },
    },
    {
      value: "Yogurt",
      label: {
        en: "Yogurt",
        km: "យ៉ាអួ",
      },
    },
    {
      value: "Vitamins & Supplements",
      label: {
        en: "Vitamins & Supplements",
        km: "វីតាមីន និងអាហារបំប៉ន",
      },
    },
  ],

  Diapers: [
    {
      value: "Pants",
      label: {
        en: "Pants",
        km: "ខោទឹកនោមស្លៀក",
      },
    },
    {
      value: "Tape",
      label: {
        en: "Tape",
        km: "ខោទឹកនោមបកបិត",
      },
    },
    {
      value: "Pads",
      label: {
        en: "Pads",
        km: "កម្រាលទ្រនាប់",
      },
    },
  ],

  Essentials: [
    {
      value: "Baby Wipes",
      label: {
        en: "Baby Wipes",
        km: "ក្រដាសសើម",
      },
    },
    {
      value: "Bath & Skincare",
      label: {
        en: "Bath & Skincare",
        km: "សម្រាប់ងូតទឹក និងថែរក្សាស្បែក",
      },
    },
    {
      value: "Feeding",
      label: {
        en: "Feeding",
        km: "សម្ភារៈបំបៅ",
      },
    },
    {
      value: "Accessories",
      label: {
        en: "Accessories",
        km: "សម្ភារៈបន្ថែម",
      },
    },
  ],
};

export default function ShopClient({
  products,
}: {
  products: Product[];
}) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  const selectedBrand =
    searchParams.get("brand") ?? "";

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") ?? "All"
    );

  const [selectedSubcategory, setSelectedSubcategory] =
    useState(
      searchParams.get("subcategory") ?? ""
    );

  const availableSubcategories =
    subcategoryOptions[selectedCategory] ?? [];

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedSubcategory("");
  }

  const filteredProducts = products.filter((product) => {
    const productBrand = product.brand ?? "";
    const productSubcategory =
      product.subcategory ?? "";

    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchText) ||
      productBrand
        .toLowerCase()
        .includes(searchText) ||
      product.category
        .toLowerCase()
        .includes(searchText) ||
      productSubcategory
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSubcategory =
      !selectedSubcategory ||
      productSubcategory === selectedSubcategory;

    const matchesBrand =
      !selectedBrand ||
      productBrand.toLowerCase() ===
        selectedBrand.toLowerCase();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesBrand
    );
  });

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pb-28 pt-8">
        <h1
          className={`font-bold ${
            language === "km"
              ? "font-khmer text-3xl leading-[1.6]"
              : "text-4xl leading-tight"
          }`}
        >
          {language === "km"
            ? "ហាងទំនិញ"
            : "Shop"}
        </h1>

        <p
          className={`text-gray-500 ${
            language === "km"
              ? "font-khmer mt-3 text-sm leading-7"
              : "mt-2 text-sm leading-6"
          }`}
        >
          {language === "km"
            ? "ជ្រើសរើសតែផលិតផលដែលល្អសម្រាប់កូនៗ"
            : "Find premium products"}
        </p>

        <div className="mt-6">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <CategoryFilter
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />

{availableSubcategories.length > 0 && (
  <section className="mt-5">
    <p
      className={`mb-3 text-[12px] font-semibold text-slate-600 ${
        language === "km"
          ? "font-khmer leading-7"
          : ""
      }`}
    >
      {language === "km"
        ? "ជ្រើសរើសតាមប្រភេទ"
        : "Shop by Type"}
    </p>

    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => setSelectedSubcategory("")}
        className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-2xl transition-all duration-300 ${
          selectedSubcategory === ""
            ? "border-gold/60 !bg-transparent text-gold shadow-none"
            : "border-white/40 bg-white/15 text-slate-600 hover:border-white/60 hover:bg-white/30"
        } ${
          language === "km"
            ? "font-khmer leading-6"
            : ""
        }`}
      >
        {language === "km"
          ? "ទាំងអស់"
          : "All Types"}
      </button>

      {availableSubcategories.map((option) => {
        const active =
          selectedSubcategory === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setSelectedSubcategory(option.value)
            }
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-2xl transition-all duration-300 ${
              active
                ? "border-gold/60 !bg-transparent text-gold shadow-none"
                : "border-white/40 bg-white/15 text-slate-600 hover:border-white/60 hover:bg-white/30"
            } ${
              language === "km"
                ? "font-khmer leading-6"
                : ""
            }`}
          >
            {option.label[language]}
          </button>
        );
      })}
    </div>
  </section>
)}

        {selectedBrand && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/60 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-xl">
            <div className="min-w-0">
              <p
                className={`text-xs text-gray-500 ${
                  language === "km"
                    ? "font-khmer leading-6"
                    : ""
                }`}
              >
                {language === "km"
                  ? "ម៉ាកដែលបានជ្រើសរើស"
                  : "Selected brand"}
              </p>

              <p className="truncate font-semibold text-slate-900">
                {selectedBrand}
              </p>
            </div>

            <Link
              href="/shop"
              className={`ml-3 shrink-0 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gold ${
                language === "km"
                  ? "font-khmer leading-6"
                  : ""
              }`}
            >
              {language === "km"
                ? "សម្អាត"
                : "Clear"}
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 items-stretch gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={Number(product.price)}
              image={product.image}
              stock={product.stock}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-2 rounded-3xl border border-white/60 bg-white/50 px-5 py-10 text-center backdrop-blur-xl">
              <h2
                className={`font-bold ${
                  language === "km"
                    ? "font-khmer text-xl leading-9"
                    : "text-xl"
                }`}
              >
                {language === "km"
                  ? "រកមិនឃើញផលិតផល"
                  : "No products found"}
              </h2>

              <p
                className={`mt-2 text-sm text-gray-500 ${
                  language === "km"
                    ? "font-khmer leading-7"
                    : "leading-6"
                }`}
              >
                {language === "km"
                  ? "សូមសាកល្បងជ្រើសរើសប្រភេទផ្សេងទៀត"
                  : "Try another search, category, or product type"}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}