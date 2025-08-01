import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    scrollRestoration: false,
  },
};

export default nextConfig;
