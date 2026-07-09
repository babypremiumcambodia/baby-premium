"use client";

import { ScanLine } from "lucide-react";
import BarcodeScanner from "@/components/admin/BarcodeScanner";

export default function BarcodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="glass flex items-center rounded-xl border border-white/30 bg-white/40 px-4 py-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Barcode"
        className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
      />

      <BarcodeScanner
        onDetected={onChange}
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