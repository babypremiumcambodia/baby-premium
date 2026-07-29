import HomeHeader from "@/components/home/HomeHeader";
import HeroBanner from "@/components/home/HeroBanner";
import SearchBar from "@/components/home/SearchBar";
import BannerSlider from "@/components/home/BannerSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <HomeHeader />

        <HeroBanner />

        <SearchBar />

        <BannerSlider />

        <CategoryGrid />

        <FeaturedProducts products={products} />
      </div>

      <BottomNavigation />
    </main>
  );
}