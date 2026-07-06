"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onDetected: (code: string) => void;
};

export default function BarcodeScanner({ onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            onDetected(result.getText());
            setScanning(false);
          }
        }
      )
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
    <div className="rounded-xl border bg-white p-4">
      <button
        type="button"
        onClick={() => setScanning(true)}
        className="w-full rounded-full bg-gold py-3 font-semibold text-white"
      >
        Scan Barcode
      </button>

      {scanning && (
        <div className="mt-4">
          <video
            ref={videoRef}
            className="w-full rounded-xl"
          />

          <button
            type="button"
            onClick={() => setScanning(false)}
            className="mt-3 w-full rounded-full border py-3 font-semibold"
          >
            Stop Scanner
          </button>
        </div>
      )}
    </div>
  );
}