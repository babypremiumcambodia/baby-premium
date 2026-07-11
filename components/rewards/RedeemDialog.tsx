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
  const remaining = lovePoints - reward.points_required;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-5 pb-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold">Redeem Reward</h2>

        {reward.image && (
          <img
            src={reward.image}
            alt={reward.name}
            className="mx-auto mt-5 h-32 object-contain"
          />
        )}

        <h3 className="mt-5 text-xl font-bold">{reward.name}</h3>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Cost</span>
            <span className="font-semibold text-gold">
              {reward.points_required} LP
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Current Balance</span>
            <span className="font-semibold">{lovePoints} LP</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">After Redemption</span>
            <span className="font-semibold">{remaining} LP</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white py-3 font-semibold text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onRedeem}
            className="rounded-full bg-gold py-3 font-semibold text-white"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}