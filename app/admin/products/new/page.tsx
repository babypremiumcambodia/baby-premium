"use client";

import { useState } from "react";
import type { Area } from "react-easy-crop";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createCroppedPng } from "@/lib/cropImage";
import AdminBackButton from "@/components/admin/AdminBackButton";
import BarcodeInput from "@/components/admin/BarcodeInput";
import ProductImageCropper from "@/components/admin/ProductImageCropper";

const subcategoryOptions: Record<string, string[]> = {
  Formula: [
    "Cow's Milk",
    "A2 & Organic",
    "Goat Milk",
    "Sensitive & Allergy",
  ],
  Milk: [
    "Kids Milk",
    "Adult & Senior",
    "Pregnancy",
  ],
  "Food & Nutrition": [
    "Cereal",
    "Snacks",
    "Yogurt",
    "Vitamins & Supplements",
  ],
  Diapers: [
    "Pants",
    "Tape",
    "Pads",
  ],
  Essentials: [
    "Baby Wipes",
    "Bath & Skincare",
    "Feeding",
    "Accessories",
  ],
};

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    barcode: "",
    description: "",
    image: "",
  });

  const [preview, setPreview] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleCategoryChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setForm((previous) => ({
      ...previous,
      category: event.target.value,
      subcategory: "",
    }));
  }

  function handleImageSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const temporaryUrl = URL.createObjectURL(file);

    setSelectedImage(temporaryUrl);
    event.target.value = "";
  }

  async function handleCroppedUpload(cropArea: Area) {
    if (!selectedImage) return;

    setUploading(true);

    try {
      const pngBlob = await createCroppedPng(
        selectedImage,
        cropArea
      );

      const fileName =
        `products/${Date.now()}-product.png`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, pngBlob, {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setForm((previous) => ({
        ...previous,
        image: data.publicUrl,
      }));

      setPreview(data.publicUrl);

      URL.revokeObjectURL(selectedImage);
      setSelectedImage("");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not crop and upload the image."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleCropCancel() {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage("");
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Please enter the product name.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    if (!form.subcategory) {
      alert("Please select a product type.");
      return;
    }

    if (!form.image) {
      alert("Please upload and crop a product image.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .insert({
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price),
        stock: Number(form.stock),
        barcode: form.barcode.trim(),
        description: form.description.trim(),
        image: form.image,
        active: true,
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product added successfully!");
    router.push("/admin/products");
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Add Product
          </h1>
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

          <select
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            className="w-full rounded-xl border bg-white p-4"
          >
            <option value="">Select Category</option>
            <option value="Formula">Formula</option>
            <option value="Milk">Milk</option>
            <option value="Food & Nutrition">
              Food & Nutrition
            </option>
            <option value="Diapers">Diapers</option>
            <option value="Essentials">Essentials</option>
          </select>

          {form.category && (
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full rounded-xl border bg-white p-4"
            >
              <option value="">Select Product Type</option>

              {(subcategoryOptions[form.category] ?? []).map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          )}

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <BarcodeInput
            value={form.barcode}
            onChange={(code) =>
              setForm((previous) => ({
                ...previous,
                barcode: code,
              }))
            }
          />

          <label className="block rounded-xl border bg-white p-4">
            <span className="font-semibold">
              Upload Product Image
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageSelect}
              className="mt-3 block w-full"
            />
          </label>

          {preview && (
            <div className="rounded-[24px] border border-white/70 bg-white/30 p-4">
              <img
                src={preview}
                alt="Cropped product preview"
                className="mx-auto aspect-square w-full max-w-[260px] object-contain"
              />

              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setForm((previous) => ({
                    ...previous,
                    image: "",
                  }));
                }}
                className="mt-3 w-full text-sm font-semibold text-red-500"
              >
                Remove Image
              </button>
            </div>
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
            disabled={saving || uploading}
            onClick={handleSave}
            className="w-full rounded-full bg-gold py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>

      {selectedImage && (
        <ProductImageCropper
          image={selectedImage}
          uploading={uploading}
          onCancel={handleCropCancel}
          onConfirm={handleCroppedUpload}
        />
      )}
    </main>
  );
}