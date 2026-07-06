import { Crown } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          Good Evening
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight">
          Baby Premium
        </h1>
      </div>

      <div className="glass flex h-14 w-14 items-center justify-center rounded-full">
        <Crown className="h-7 w-7 text-yellow-500" />
      </div>
    </header>
  );
}