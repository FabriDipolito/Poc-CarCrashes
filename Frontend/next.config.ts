import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allows to import from /public without problems
    unoptimized: false,
  },
};

export default nextConfig;
