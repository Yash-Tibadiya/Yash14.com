import { Panel } from "../panel";
import { Suspense } from "react";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import { getGitHubContributions } from "@/features/portfolio/data/github-contributions";

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel className="screen-line-top-none">
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>

      <div className="h-px" />
    </Panel>
  );
}
