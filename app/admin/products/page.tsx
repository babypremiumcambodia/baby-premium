export const dynamic = "force-dynamic";
export const revalidate = 0;

import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { getProducts, archiveProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";

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
    <AdminProductsClient
      products={products}
      handleArchive={handleArchive}
    />
  );
}