import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },
  serverExternalPackages: ["cloudinary"],
};

export default nextConfig;
