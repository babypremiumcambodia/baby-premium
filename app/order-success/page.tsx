import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-premium flex items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-[32px] p-8 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />

        <h1 className="mt-6 text-3xl font-bold">
          Thank You!
        </h1>

        <p className="mt-3 text-gray-500">
          Your order has been received successfully.
        </p>

        <div className="mt-8 rounded-2xl bg-white/50 p-5">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="mt-2 text-xl font-bold">BP240001</p>

          <p className="mt-4 text-sm text-gray-500">
            Estimated Delivery
          </p>

          <p className="font-semibold">
            Tomorrow • 2 PM – 5 PM
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 block rounded-full bg-gold py-4 font-semibold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}