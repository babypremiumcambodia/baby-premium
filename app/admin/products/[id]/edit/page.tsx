"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        name: data.name ?? "",
        brand: data.brand ?? "",
        category: data.category ?? "",
        price: String(data.price ?? ""),
        stock: String(data.stock ?? ""),
        description: data.description ?? "",
        image: data.image ?? "",
      });
    }

    loadProduct();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        image: form.image,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product updated!");
    router.push("/admin/products");
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-xl px-5 py-8">
        <div className="mb-8 flex items-center gap-4">
  <Link
    href="/admin/products"
    className="rounded-full bg-white p-3 shadow"
  >
    <ArrowLeft className="h-5 w-5" />
  </Link>

  <h1 className="text-4xl font-bold">Edit Product</h1>
</div>

        <div className="mt-8 space-y-4">
          <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border p-4" />
          <input name="brand" value={form.brand} onChange={handleChange} className="w-full rounded-xl border p-4" />
          <input name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border p-4" />
          <input name="price" value={form.price} onChange={handleChange} className="w-full rounded-xl border p-4" />
          <input name="stock" value={form.stock} onChange={handleChange} className="w-full rounded-xl border p-4" />
          <input name="image" value={form.image} onChange={handleChange} className="w-full rounded-xl border p-4" />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="h-40 w-full rounded-xl border p-4"
          />

          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-full bg-gold py-4 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}