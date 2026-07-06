import HomeHeader from "@/components/home/HomeHeader";
import HeroBanner from "@/components/home/HeroBanner";
import SearchBar from "@/components/home/SearchBar";
import PopularBrands from "@/components/brands/PopularBrands";
import LovePointsCard from "@/components/home/LovePointsCard";
import CategoryGrid from "@/components/home/CategoryGrid";
import ThankYouGift from "@/components/home/ThankYouGift";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import TelegramProfile from "@/components/telegram/TelegramProfile";


export default function Home() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <HomeHeader />

        <TelegramProfile />

        <HeroBanner />

        <SearchBar />

        <PopularBrands />

        <LovePointsCard />

        <ThankYouGift />

        <FeaturedProducts />

        <CategoryGrid />
      </div>

      <BottomNavigation />

    </main>
  );
}