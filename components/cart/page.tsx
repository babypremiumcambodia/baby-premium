import BottomNavigation from "@/components/layout/BottomNavigation";
import GlassCard from "@/components/ui/GlassCard";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-md px-5 pt-8 pb-28">
        <h1 className="text-4xl font-bold">Cart</h1>
        <p className="mt-2 text-gray-500">Your selected products</p>

        <GlassCard className="mt-6">
          <p className="font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-gray-500">
            Add products from the shop to start your order.
          </p>
        </GlassCard>
      </div>

      <BottomNavigation />
    </main>
  );
}