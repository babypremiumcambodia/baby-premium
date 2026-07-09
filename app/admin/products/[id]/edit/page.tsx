"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminBackButton from "@/components/admin/AdminBackButton";
import BarcodeInput from "@/components/admin/BarcodeInput";

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
    barcode: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

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
        barcode: data.barcode ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
      });

      setPreview(data.image ?? "");
    }

    if (id) loadProduct();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      image: data.publicUrl,
    }));

    setPreview(data.publicUrl);
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
        barcode: form.barcode,
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
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Edit Product</h1>
        </div>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <BarcodeInput
  value={form.barcode}
  onChange={(code) =>
    setForm((prev) => ({
      ...prev,
      barcode: code,
    }))
  }
/>

          <label className="block rounded-xl border bg-white p-4">
            <span className="font-semibold">Upload Product Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-3 block w-full"
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Product preview"
              className="mx-auto h-48 object-contain"
            />
          )}

          <textarea
            name="description"
            placeholder="Description"
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