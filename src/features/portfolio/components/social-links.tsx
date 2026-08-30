"use client";

import { cn } from "@/lib/utils";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";
import { Button } from "@/components/base/ui/button";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { Panel, PanelContent } from "@/features/portfolio/components/panel";
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";

const ASCII_ROWS = [
  {
    id: "row-1",
    pattern: "░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██",
  },
  {
    id: "row-2",
    pattern: "▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░",
  },
  {
    id: "row-3",
    pattern: "░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██▓▓▒▒░░ ░▒▓█▓▒░ ░░▒▒▓▓██",
  },
];

function AsciiWall({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 flex w-1/2 flex-col justify-center overflow-hidden select-none",
        isLeft
          ? "left-0 items-end mask-[linear-gradient(90deg,black_0%,black_25%,transparent_90%)]"
          : "right-0 items-start mask-[linear-gradient(270deg,black_0%,black_25%,transparent_90%)]",
      )}
      aria-hidden
    >
      {ASCII_ROWS.map((row, i) => (
        <pre
          key={row.id}
          className={cn(
            "bg-[linear-gradient(90deg,var(--color-muted-foreground)_0%,var(--color-foreground)_50%,var(--color-muted-foreground)_100%)] bg-size-[200%_100%] bg-clip-text font-mono text-[10px] leading-4 whitespace-nowrap text-transparent opacity-20",
            isLeft
              ? "animate-[ascii-shimmer_6s_linear_infinite]"
              : "animate-[ascii-shimmer-reverse_6s_linear_infinite]",
          )}
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          {row.pattern.repeat(10)}
        </pre>
      ))}
    </div>
  );
}

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <PanelContent className="relative overflow-hidden">
        <AsciiWall side="left" />
        <AsciiWall side="right" />

        <ul className="relative z-10 flex flex-wrap justify-center gap-2">
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
        @keyframes ascii-shimmer-reverse {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>
    </Panel>
  );
}
