"use client";

type Props = {
  selected: string;
  onChange: (category: string) => void;
};

const categories = [
  "All",
  "Formula",
  "Milk",
  "Food & Nutrition",
  "Diapers",
  "Essentials",
  
];

export default function CategoryFilter({
  selected,
  onChange,
}: Props) {
  return (
    <div className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const active = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`
              shrink-0
              rounded-full
              px-5
              py-3
              text-sm
              font-semibold
              transition-all
              duration-300
              backdrop-blur-2xl
              border
              ${
                active
                  ? "border-gold/70 bg-gold/20 text-gold shadow-[0_8px_30px_rgba(212,175,55,0.18)]"
                  : "border-white/40 bg-white/10 text-slate-700 hover:bg-white/20 hover:border-white/60"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}