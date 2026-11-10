import type { NextConfig } from "next";

function r2RemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim();
  if (!base) return [];
  try {
    const url = new URL(base);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  /* Legal Sakinah — Next.js 16 App Router */
  experimental: {
    serverActions: {
      // App max upload = 5 MB; +headroom multipart/form-data (docs Next.js)
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [...(r2RemotePatterns() ?? [])],
  },
};

export default nextConfig;
