"use client";

import { useState } from "react";
import Cropper, {
  type Area,
  type Point,
} from "react-easy-crop";

type ProductImageCropperProps = {
  image: string;
  uploading: boolean;
  onCancel: () => void;
  onConfirm: (area: Area) => void;
};

export default function ProductImageCropper({
  image,
  uploading,
  onCancel,
  onConfirm,
}: ProductImageCropperProps) {
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] =
    useState<Area | null>(null);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-lg">
      <div className="w-full max-w-lg rounded-[28px] bg-[#fffaf0] p-4 shadow-2xl">
        <h2 className="mb-3 text-center text-lg font-bold text-slate-900">
          Crop Product Image
        </h2>

        <div className="relative h-[55vh] min-h-[320px] max-h-[520px] overflow-hidden rounded-[22px] bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            showGrid
            cropShape="rect"
            objectFit="contain"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => {
              setCroppedArea(pixels);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Zoom
          </label>

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) =>
              setZoom(Number(event.target.value))
            }
            className="w-full accent-[#b88932]"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={onCancel}
            className="flex-1 rounded-full border border-gray-300 bg-white py-3 font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!croppedArea || uploading}
            onClick={() => {
              if (croppedArea) {
                onConfirm(croppedArea);
              }
            }}
            className="flex-1 rounded-full bg-gold py-3 font-semibold text-white disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}