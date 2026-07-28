"use client";

import { useLanguage } from "@/components/language/LanguageProvider";

type Reward = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  points_required: number;
};

type RedeemDialogProps = {
  reward: Reward;
  lovePoints: number;
  onClose: () => void;
  onRedeem: () => void;
};

export default function RedeemDialog({
  reward,
  lovePoints,
  onClose,
  onRedeem,
}: RedeemDialogProps) {
  const { language } = useLanguage();

  const remainingPoints =
    lovePoints - reward.points_required;

  const khmerText =
    language === "km" ? "font-khmer leading-7" : "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/30 px-5 py-8 backdrop-blur-md">
      <button
        type="button"
        aria-label={
          language === "km"
            ? "បិទការប្ដូរកាដូរ"
            : "Close redeem dialog"
        }
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 max-h-[calc(100dvh-48px)] w-full max-w-sm overflow-y-auto rounded-[32px] border border-white/70 bg-white/90 p-6 pb-7 shadow-2xl backdrop-blur-2xl">
        <h2
          className={`font-bold text-slate-800 ${
            language === "km"
              ? "font-khmer text-2xl leading-[1.6]"
              : "text-3xl"
          }`}
        >
          {language === "km"
            ? "ប្តូរយកកាដូរ"
            : "Redeem Reward"}
        </h2>

        {reward.image && (
          <img
            src={reward.image}
            alt={reward.name}
            className="mx-auto mt-5 h-28 w-28 rounded-2xl bg-white object-contain p-2"
          />
        )}

        <h3 className="mt-5 text-2xl font-bold leading-9 text-slate-800">
          {reward.name}
        </h3>

        <div className="mt-7 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <span
              className={`text-slate-500 ${khmerText} ${
                language === "en" ? "text-lg" : ""
              }`}
            >
              {language === "km"
                ? "ពិន្ទុដែលត្រូវការ"
                : "Cost"}
            </span>

            <span className="shrink-0 text-lg font-bold text-gold">
              {reward.points_required} LP
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span
              className={`text-slate-500 ${khmerText} ${
                language === "en" ? "text-lg" : ""
              }`}
            >
              {language === "km"
                ? "ពិន្ទុបច្ចុប្បន្ន"
                : "Current Balance"}
            </span>

            <span className="shrink-0 text-lg font-bold text-slate-800">
              {lovePoints} LP
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span
              className={`text-slate-500 ${khmerText} ${
                language === "en" ? "text-lg" : ""
              }`}
            >
              {language === "km"
                ? "ពិន្ទុក្រោយប្តូរ"
                : "After Redemption"}
            </span>

            <span className="shrink-0 text-lg font-bold text-slate-800">
              {remainingPoints} LP
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full border border-white/70 bg-white/70 py-4 font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition active:scale-95 ${khmerText}`}
          >
            {language === "km" ? "បោះបង់" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={onRedeem}
            className={`rounded-full bg-gold py-4 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 ${khmerText}`}
          >
            {language === "km"
              ? "ប្តូរយកកាដូរ"
              : "Redeem"}
          </button>
        </div>
      </div>
    </div>
  );
}