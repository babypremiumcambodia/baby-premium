import BottomNavigation from "@/components/layout/BottomNavigation";
import LovePointsCard from "@/components/home/LovePointsCard";
import ThankYouGift from "@/components/home/ThankYouGift";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Baby Premium+</h1>
        <p className="mt-2 text-gray-500">Love Points & Thank You Gifts</p>

        <LovePointsCard />

        <ThankYouGift />
      </div>

      <BottomNavigation />
    </main>
  );
}