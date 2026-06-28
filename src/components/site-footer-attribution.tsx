"use client";

import { LinkPreview } from "@/components/link-preview";
import { getSocialLinkByName } from "@/features/portfolio/data/social-links";

export function SiteFooterAttribution() {
  const xLink = getSocialLinkByName("x");
  const githubLink = getSocialLinkByName("github");

  return (
    <div className="screen-line-top px-4 py-4 text-center font-mono text-sm text-balance text-muted-foreground">
      Built by{" "}
      <LinkPreview
        url={xLink?.href ?? "https://x.com/Yash_Tibadiya"}
        side="top"
        className="link-underline transition-colors hover:text-foreground"
      >
        Yash_Tibadiya
      </LinkPreview>
      . The source code is available on{" "}
      <LinkPreview
        url={githubLink?.href ?? "https://github.com/Yash-Tibadiya"}
        side="top"
        className="link-underline transition-colors hover:text-foreground"
      >
        GitHub
      </LinkPreview>
      .
    </div>
  );
}
