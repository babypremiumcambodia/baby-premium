"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminBackButton from "@/components/admin/AdminBackButton";

export default function NewRewardPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    points_required: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

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
      .from("rewards")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("rewards")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      image: data.publicUrl,
    }));

    setPreview(data.publicUrl);
  }

  async function handleSave() {
    if (!form.name || !form.points_required) {
      alert("Please enter reward name and love points.");
      return;
    }

    const { error } = await supabase.from("rewards").insert({
      name: form.name,
      description: form.description,
      points_required: Number(form.points_required),
      image: form.image,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Reward added successfully!");
    router.push("/admin/rewards");
  }

  return (
    <main className="min-h-screen bg-premium">
      <div className="mx-auto max-w-xl px-5 py-8">
        <div className="mb-6">
          <AdminBackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Add Reward</h1>
        </div>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Reward Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            name="points_required"
            placeholder="Love Points Required"
            value={form.points_required}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <label className="block rounded-xl border bg-white p-4">
            <span className="font-semibold">Upload Reward Image</span>

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
              alt="Preview"
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
            Save Reward
          </button>
        </div>
      </div>
    </main>
  );
}