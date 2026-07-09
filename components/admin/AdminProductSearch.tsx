"use client";

import { useEffect, useRef } from "react";
import { Search, ScanLine } from "lucide-react";
import BarcodeScanner from "@/components/admin/BarcodeScanner";

export default function AdminProductSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="glass mt-6 flex items-center rounded-full border border-white/30 px-5 py-3 shadow-xl">
      <Search className="mr-4 h-6 w-6 text-gray-500" />

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, brand, category, or barcode..."
        className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-500"
      />

      <BarcodeScanner
        onDetected={(code) => onChange(code)}
        trigger={
          <button
            type="button"
            className="ml-3 flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white"
          >
            <ScanLine size={18} />
            Scan
          </button>
        }
      />
    </div>
  );
}