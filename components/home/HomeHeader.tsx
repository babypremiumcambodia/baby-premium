import { Crown } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          Good Evening
        </p>

        <p className="font-khmer mt-1 text-sm font-medium text-gray-500 leading-none">
  បេប៊ី ព្រីមៀម
</p>
      </div>

      <div className="glass flex h-14 w-14 items-center justify-center rounded-full">
        <Crown className="h-7 w-7 text-yellow-500" />
      </div>
    </header>
  );
}