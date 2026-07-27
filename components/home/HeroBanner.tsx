import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="glass mt-6 overflow-hidden rounded-[36px] p-6">
      <p className="text-xs font-semibold tracking-[0.28em] text-gold">
        BABY PREMIUM+
      </p>

      <h2 className="mt-3 text-3xl font-bold leading-tight">
        Everyday Baby
        <br />
        Essentials
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        Trusted brands from Australia,
        <br />
        New Zealand, USA & Europe.
      </p>

      <button className="mt-6 flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-white transition hover:opacity-90">
        Shop Now
        <ArrowRight size={18} />
      </button>
    </section>
  );
}