import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // for image support with static export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  env: {
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  },
};

export default nextConfig;
