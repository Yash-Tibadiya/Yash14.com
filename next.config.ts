import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
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
