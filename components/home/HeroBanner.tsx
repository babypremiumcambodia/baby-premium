import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="glass mt-6 overflow-hidden rounded-[36px] p-7">
      <p className="text-sm font-semibold tracking-[0.25em] text-gold">
        BABY PREMIUM+
      </p>

      <h2 className="mt-4 text-4xl font-bold leading-tight">
        Premium Baby
        <br />
        Nutrition
      </h2>

      <p className="mt-3 text-gray-500">
        Trusted brands from Australia,
        New Zealand & Europe.
      </p>

      <button className="mt-7 flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-white">
        Shop Now
        <ArrowRight size={18} />
      </button>
    </section>
  );
}