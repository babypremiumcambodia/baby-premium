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
        cursor-pointer
        items-center
        gap-2
        rounded-full
        border
        border-white/40
        px-5
        py-3
        text-sm
        font-semibold
        shadow-lg
        transition-all
        duration-200
        hover:scale-[1.03]
        hover:shadow-xl
        active:scale-95
      "
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}