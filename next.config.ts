import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR on Cloudflare Workers via @opennextjs/cloudflare
  // Do NOT use output: 'export' — we need SSR for R2 data fetching
  // Note: Edge runtime is set per-route via `export const runtime = 'edge'`
  images: {
    // Allow R2 public bucket URL for next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.travelingbeku.com",
        pathname: "/**",
      },
    ],
  },
  // Required for Cloudflare Workers compatibility
  experimental: {
    serverActions: {
      allowedOrigins: ["127.0.0.1:8787", "localhost:8787", "travelingbeku.com", "www.travelingbeku.com"],
      bodySizeLimit: "10mb",
    },
  },
  // 2. Kill the 'fs' dependency at the bundler level
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
