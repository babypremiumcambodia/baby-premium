import GlassCard from "@/components/ui/GlassCard";

export default function GiftCard() {
  return (
    <GlassCard className="mt-5">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl gold-glow">
          🎁
        </div>

        <div>
          <p className="text-sm text-gray-500">Thank You Gift</p>
          <h3 className="text-xl font-bold">Ready Soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            55 LP remaining
          </p>
        </div>
      </div>

      <button className="mt-5 w-full rounded-full bg-gold py-4 font-semibold text-white gold-glow">
        💝 Open Gift
      </button>
    </GlassCard>
  );
}