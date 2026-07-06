"use client";

type Props = {
  selected: string;
  onChange: (category: string) => void;
};

const categories = [
  "All",
  "Baby Formula",
  "Diapers",
  "Baby Care",
  "Nutrition",
];

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold ${
            selected === category
              ? "bg-gold text-white"
              : "glass text-gray-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}