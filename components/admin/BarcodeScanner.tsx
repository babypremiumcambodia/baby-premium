"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onDetected: (code: string) => void;
  trigger?: React.ReactNode;
};

export default function BarcodeScanner({ onDetected, trigger }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result) {
          onDetected(result.getText());
          setScanning(false);
        }
      })
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch((error) => {
        alert(error.message);
        setScanning(false);
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, [scanning, onDetected]);

  return (
    <>
      <div onClick={() => setScanning(true)}>{trigger}</div>

      {scanning && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-5 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-[28px] p-5 shadow-2xl">
            <h2 className="text-center text-2xl font-bold text-gold">
              Scan Product Barcode
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Align the barcode inside the camera frame.
            </p>

            <video
              ref={videoRef}
              className="mt-5 w-full rounded-2xl bg-black"
            />

            <button
              type="button"
              onClick={() => setScanning(false)}
              className="mt-5 w-full rounded-full border py-3 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}