import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { YTMarkIsometric } from "@/features/portfolio/components/yt-mark-isometric";

export const metadata: Metadata = {
  title: "OG Image",
  robots: { index: false, follow: false },
};

// Dev-only canvas for capturing the static OG image uploaded to the CDN.
export default function OgImagePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-800 p-8">
      <div
        id="og-image"
        className="dark flex h-[630px] w-[1200px] shrink-0 items-center justify-center overflow-hidden bg-background px-24 text-foreground"
      >
        <YTMarkIsometric />
      </div>
    </div>
  );
}
