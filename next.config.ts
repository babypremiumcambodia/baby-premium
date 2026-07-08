import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
  ],
};

export default nextConfig;