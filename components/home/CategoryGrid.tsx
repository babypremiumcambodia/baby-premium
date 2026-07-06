const categories = [
  {
    name: "Baby Formula",
    icon: "🍼",
  },
  {
    name: "Diapers",
    icon: "👶",
  },
  {
    name: "Baby Care",
    icon: "🧴",
  },
  {
    name: "Nutrition",
    icon: "🥛",
  },
  {
    name: "Feeding",
    icon: "🍼",
  },
  {
    name: "Promotions",
    icon: "🎁",
  },
];

export default function CategoryGrid() {
  return (
    <>
      <h2 className="mt-8 mb-4 text-2xl font-bold">
        Shop Categories
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((item) => (
          <button
            key={item.name}
            className="
              glass
              rounded-[28px]
              p-5
              text-left
              transition-all
              hover:scale-[1.03]
            "
          >
            <div className="text-3xl">
              {item.icon}
            </div>

            <p className="mt-4 font-semibold">
              {item.name}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}