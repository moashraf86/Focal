import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
