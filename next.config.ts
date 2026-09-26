import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    BUILD_TIMESTAMP: new Date().toISOString(),
    // Inlined so the client-rendered footer can read them.
    VERCEL_ENV: process.env.VERCEL_ENV ?? "",
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "assets.yash14.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/rss",
        destination: "/components/rss",
      },
      {
        source: "/registry/rss",
        destination: "/components/rss",
      },
      {
        source: "/components/:slug.mdx",
        destination: "/doc.mdx/:slug",
      },
    ];
  },
};

export default nextConfig;
