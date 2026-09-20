"use client";

import type { Components } from "react-markdown";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { UTM_PARAMS } from "@/config/site";
import Markdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import { LinkPreview } from "@/components/link-preview";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";

const markdownComponents: Components = {
  a: ({ href, children, className, rel, target }) => {
    if (!href) {
      return <span>{children}</span>;
    }

    return (
      <LinkPreview
        url={href}
        className={cn("link-underline", className)}
        rel={typeof rel === "string" ? rel : undefined}
        target={typeof target === "string" ? target : undefined}
        side="top"
      >
        {children}
      </LinkPreview>
    );
  },
};

export function MarkdownLinkPreview({ children }: { children: string }) {
  return (
    <Markdown
      components={markdownComponents}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
        [rehypeAddQueryParams, UTM_PARAMS],
      ]}
    >
      {children}
    </Markdown>
  );
}
