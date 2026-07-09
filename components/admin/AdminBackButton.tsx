"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AdminBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="
        glass
        inline-flex
        items-center
        gap-2
        rounded-xl
        px-4
        py-2
        text-sm
        font-medium
        transition-all
        hover:scale-105
      "
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}