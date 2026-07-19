"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { UTM_PARAMS } from "@/config/site";
import { Panel, PanelContent } from "@/features/portfolio/components/panel";
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { addQueryParams } from "@/utils/url";
import { Button } from "@/components/base/ui/button";

const ASCII_ROWS = [
  "░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██",
  "▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░",
  "░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██",
];

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <PanelContent className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center overflow-hidden select-none [mask-image:linear-gradient(90deg,transparent_0%,black_35%)]"
          aria-hidden
        >
          {ASCII_ROWS.map((row, i) => (
            <pre
              key={i}
              className="bg-[linear-gradient(90deg,var(--color-muted-foreground)_0%,var(--color-foreground)_50%,var(--color-muted-foreground)_100%)] bg-size-[200%_100%] bg-clip-text font-mono text-[10px] leading-4 whitespace-nowrap text-transparent opacity-20 animate-[ascii-shimmer_6s_linear_infinite]"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              {row.repeat(10)}
            </pre>
          ))}
        </div>

        <ul className="relative z-10 flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((item) => (
            <li key={item.name}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4.5 bg-background! rounded-sm"
                      variant="outline"
                      size="icon-sm"
                      nativeButton={false}
                      render={
                        <a
                          href={addQueryParams(item.href, UTM_PARAMS)}
                          target="_blank"
                          rel="noopener"
                        >
                          {SOCIAL_ICONS[item.name]}
                          <span className="sr-only">{item.title}</span>
                        </a>
                      }
                    />
                  }
                />
                <TooltipContent>
                  {item.title} ({item.handle})
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </PanelContent>

      <style>{`
        @keyframes ascii-shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
      `}</style>
    </Panel>
  );
}
