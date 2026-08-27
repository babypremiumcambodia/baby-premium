"use client";

import { useEffect, useState } from "react";
import type { Area } from "react-easy-crop";
import { useParams, useRouter } from "next/navigation";
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

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
        subcategory: data.subcategory ?? "",
        price: String(data.price ?? ""),
        stock: String(data.stock ?? ""),
        barcode: data.barcode ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
      });

      setPreview(data.image ?? "");
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

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

    // Allows selecting the same file again if needed.
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

      /*
       * IMPORTANT:
       * Every replacement gets a NEW filename.
       *
       * We do not overwrite the previous image.
       * This prevents the browser/Supabase CDN from
       * continuing to display an old cached image.
       */
      const fileName =
        `products/${id}-${Date.now()}-product.png`;

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

      const newImageUrl = data.publicUrl;

      if (!newImageUrl) {
        throw new Error(
          "Could not get the new product image URL."
        );
      }

      /*
       * Put the NEW URL into the form.
       * handleSave() will save this URL to products.image.
       */
      setForm((previous) => ({
        ...previous,
        image: newImageUrl,
      }));

      /*
       * Immediately show the newly uploaded image
       * in the Edit Product preview.
       */
      setPreview(newImageUrl);

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

    if (!id || Number.isNaN(id)) {
      alert("Invalid product ID.");
      return;
    }

    setSaving(true);

    try {
      /*
       * Save everything, including the NEW image URL.
       *
       * .select().single() makes Supabase return the
       * updated product so we can confirm the update
       * actually happened.
       */
      const { data, error } = await supabase
        .from("products")
        .update({
          name: form.name.trim(),
          brand: form.brand.trim(),
          category: form.category,
          subcategory: form.subcategory,
          price: Number(form.price),
          stock: Number(form.stock),
          barcode: form.barcode.trim(),
          description: form.description.trim(),
          image: form.image,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Product was not updated.");
      }

      alert("Product updated!");

      /*
       * Go back to Products and refresh the route
       * so the latest product information/image is used.
       */
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not update the product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-xl px-5 py-8">

        {/* Back */}
        <div className="mb-6">
          <AdminBackButton />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Edit Product
          </h1>
        </div>

        <div className="space-y-4">

          {/* Product name */}
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          {/* Brand */}
          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            className="w-full rounded-xl border bg-white p-4"
          >
            <option value="">
              Select Category
            </option>

            <option value="Formula">
              Formula
            </option>

            <option value="Milk">
              Milk
            </option>

            <option value="Food & Nutrition">
              Food & Nutrition
            </option>

            <option value="Diapers">
              Diapers
            </option>

            <option value="Essentials">
              Essentials
            </option>
          </select>

          {/* Subcategory */}
          {form.category && (
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full rounded-xl border bg-white p-4"
            >
              <option value="">
                Select Product Type
              </option>

              {(subcategoryOptions[form.category] ?? []).map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>
          )}

          {/* Price */}
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

          {/* Stock */}
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

          {/* Barcode */}
          <BarcodeInput
            value={form.barcode}
            onChange={(code) =>
              setForm((previous) => ({
                ...previous,
                barcode: code,
              }))
            }
          />

          {/* Replace image */}
          <label className="block rounded-xl border bg-white p-4">
            <span className="font-semibold">
              Replace Product Image
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageSelect}
              className="mt-3 block w-full"
            />
          </label>

          {/* Current / replacement image preview */}
          {preview && (
            <div className="rounded-[24px] border border-white/70 bg-white/30 p-4">
              <img
                key={preview}
                src={preview}
                alt="Product preview"
                className="mx-auto aspect-square w-full max-w-[260px] object-contain"
              />

              <p className="mt-2 text-center text-xs text-gray-500">
                Current product image
              </p>
            </div>
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="h-40 w-full rounded-xl border p-4"
          />

          {/* Save */}
          <button
            type="button"
            disabled={saving || uploading}
            onClick={handleSave}
            className="w-full rounded-full bg-gold py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading Image…"
              : saving
                ? "Saving…"
                : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Image cropper */}
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