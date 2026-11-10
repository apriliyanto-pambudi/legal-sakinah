import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Legal Sakinah — Next.js 16 App Router */
  experimental: {
    serverActions: {
      // App max upload = 5 MB; +headroom multipart/form-data (docs Next.js)
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
