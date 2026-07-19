"use client";

import { motion } from "motion/react";
import { UTM_PARAMS } from "@/config/site";
import { Panel, PanelContent } from "@/features/portfolio/components/panel";
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { addQueryParams } from "@/utils/url";

export function SocialLinks() {
  return (
    <Panel>
      <h2 className="sr-only">Social Links</h2>

      <PanelContent className="font-mono text-sm">
        <div
          className="flex items-center gap-2 text-muted-foreground select-none"
          aria-hidden
        >
          <span className="text-emerald-500">➜</span>
          <span className="text-sky-500">~/socials</span>
          <span>$</span>
          <span>ls --connect</span>
          <span className="inline-block h-4 w-[0.5ch] animate-caret-blink bg-muted-foreground/70" />
        </div>

        <ul className="mt-3 flex flex-col">
          {SOCIAL_LINKS.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <a
                className="group flex items-center gap-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                href={addQueryParams(item.href, UTM_PARAMS)}
                target="_blank"
                rel="noopener"
              >
                <span className="select-none text-muted-foreground/50 transition-colors group-hover:text-emerald-500">
                  [{String(index + 1).padStart(2, "0")}]
                </span>

                <span className="text-foreground/70 transition-all duration-300 group-hover:scale-110 group-hover:text-foreground [&_svg]:size-4">
                  {SOCIAL_ICONS[item.name]}
                </span>

                <span className="shrink-0 transition-colors group-hover:text-foreground">
                  {item.title}
                </span>

                <span
                  className="flex-1 overflow-hidden text-clip whitespace-nowrap text-muted-foreground/30 select-none transition-colors group-hover:text-muted-foreground/50"
                  aria-hidden
                >
                  {"· ".repeat(80)}
                </span>

                <span className="shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground max-sm:hidden">
                  {item.handle}
                </span>

                <span
                  className="shrink-0 select-none transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  ↗
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}
