import "server-only";

import type { Activity } from "@/features/portfolio/components/contribution-graph";

import { config } from "@/config";
import { unstable_cache } from "next/cache";
import { GITHUB_USERNAME } from "@/config/site";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export const getGitHubContributions = unstable_cache(
  async () => {
    const res = await fetch(
      `${config.github.contributionsApiUrl}/v4/${GITHUB_USERNAME}?y=last`,
    );
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as GitHubContributionsResponse;
    return data.contributions ?? [];
  },
  ["github-contributions"],
  { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
);
