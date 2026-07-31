"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const banners = [
  "/banners/banner-1.png",
  "/banners/banner-2.png",
  "/banners/banner-3.png",
  "/banners/banner-4.png",
];

export default function BannerSlider() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentBanner(
        (current) => (current + 1) % banners.length
      );
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="banner-glow mt-6">
      <div className="relative aspect-[2/1] overflow-hidden rounded-[25px] bg-transparent">
        {banners.map((banner, index) => (
          <Image
            key={banner}
            src={banner}
            alt={`Baby Premium banner ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 448px"
            className={`object-cover transition-opacity duration-700 ${
              index === currentBanner
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-xl">
          {banners.map((banner, index) => (
            <button
              key={banner}
              type="button"
              onClick={() => setCurrentBanner(index)}
              aria-label={`View banner ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentBanner === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}