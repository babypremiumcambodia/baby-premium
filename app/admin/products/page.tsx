import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getProducts, archiveProduct } from "@/lib/products";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminProductsPage() {
  const products = await getProducts();

  async function handleArchive(formData: FormData) {
    "use server";

    const id = Number(formData.get("id"));

    await archiveProduct(id);

    revalidatePath("/admin/products");
    revalidatePath("/shop");
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Products</h1>

          <Link
            href="/admin/products/new"
            className="rounded-full bg-gold px-5 py-3 font-semibold text-white"
          >
            + Add Product
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {products.map((product) => (
            <GlassCard
              key={product.id}
              className="flex items-center justify-between"
            >
              <div>
                <h2 className="font-bold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>

                <p className="mt-2 font-semibold text-gold">
                  ${Number(product.price).toFixed(2)}
                </p>

                <p className="text-sm">Stock: {product.stock}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-full border px-4 py-2"
                >
                  Edit
                </Link>

                <form action={handleArchive}>
                  <input type="hidden" name="id" value={product.id} />

                  <button className="rounded-full bg-red-500 px-4 py-2 text-white">
                    Archive
                  </button>
                </form>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}