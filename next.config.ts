import type { NextConfig } from "next";

import { config } from "./src/config";
import { execFileSync } from "node:child_process";

function getGitCommitSha() {
  const deploymentSha =
    config.build.vercelCommitSha ?? config.github.actionsCommitSha;

  if (deploymentSha) return deploymentSha;

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    BUILD_GIT_COMMIT_SHA: getGitCommitSha(),
  },
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
