"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function SearchBar() {
  const router = useRouter();
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchText = search.trim();

    if (searchText) {
      router.push(`/shop?search=${encodeURIComponent(searchText)}`);
    } else {
      router.push("/shop");
    }
  }

  return (
    <form
  onSubmit={handleSubmit}
  className="group relative mt-6 flex items-center rounded-[24px] border border-white/70 backdrop-blur-[24px]"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    boxShadow:
      "0 10px 30px rgba(122, 79, 22, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.75)",
  }}
>
      <Search className="pointer-events-none absolute left-5 h-5 w-5 text-gold" />

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={
          language === "km"
            ? "ស្វែងរកផលិតផលសម្រាប់កូនៗ..."
            : "Search baby products..."
        }
        aria-label={
          language === "km"
            ? "ស្វែងរកផលិតផល"
            : "Search products"
        }
        className={`w-full bg-transparent py-4 pl-14 pr-14 outline-none placeholder:text-gray-500 ${
          language === "km"
            ? "font-khmer text-sm leading-7"
            : ""
        }`}
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label={
            language === "km"
              ? "សម្អាតការស្វែងរក"
              : "Clear search"
          }
          className="absolute right-5 text-gray-400 transition hover:text-gold"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}