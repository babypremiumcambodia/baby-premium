import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", Number(id))
    .single();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", Number(id));

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Invoice not found.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/admin/orders/${id}`}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-white"
          >
            <Printer className="h-5 w-5" />
            Print
          </button>
        </div>

        <GlassCard className="bg-white p-10">

          <div className="flex justify-between border-b pb-6">

            <div>
              <h1 className="text-4xl font-bold text-gold">
                Baby Premium
              </h1>

              <p className="mt-3 text-gray-500">
                Premium Baby Formula & Baby Care
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold">
                Invoice
              </h2>

              <p className="mt-2">
                Invoice #
                {String(order.id).padStart(6, "0")}
              </p>

              <p>
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-10">

            <div>
              <h3 className="font-bold">
                Customer
              </h3>

              <p className="mt-3">
                {order.customer_name}
              </p>

              <p>{order.phone}</p>

              <p>{order.address}</p>
            </div>

            <div className="text-right">

              <h3 className="font-bold">
                Status
              </h3>

              <p className="mt-3 capitalize">
                {order.status}
              </p>

            </div>

          </div>

          <table className="mt-10 w-full border-collapse">

            <thead>

              <tr className="border-b">

                <th className="py-3 text-left">
                  Product
                </th>

                <th className="text-center">
                  Qty
                </th>

                <th className="text-right">
                  Price
                </th>

                <th className="text-right">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {items?.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="py-4">
                    {item.product_name}
                  </td>

                  <td className="text-center">
                    {item.quantity}
                  </td>

                  <td className="text-right">
                    ${Number(item.price).toFixed(2)}
                  </td>

                  <td className="text-right font-semibold">
                    $
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="mt-10 flex justify-end">

            <div className="w-72">

              <div className="flex justify-between text-lg">

                <span>Subtotal</span>

                <span>
                  ${Number(order.total).toFixed(2)}
                </span>

              </div>

              <div className="mt-3 flex justify-between border-t pt-4 text-2xl font-bold">

                <span>Total</span>

                <span className="text-gold">
                  ${Number(order.total).toFixed(2)}
                </span>

              </div>

            </div>

          </div>

          <div className="mt-16 border-t pt-8 text-center text-sm text-gray-500">

            Thank you for shopping with Baby Premium ❤️

          </div>

        </GlassCard>

      </div>
    </main>
  );
}