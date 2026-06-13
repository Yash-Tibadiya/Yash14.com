import { Download } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { YTMark } from "@/components/yt-mark";
import { YTWordmark } from "@/components/yt-wordmark";
import { BRAND_ASSETS, SITE_INFO } from "@/config/site";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel";
import { USER } from "@/features/portfolio/data/user";

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu),
);

const MARK_ASSET = "/assets/yash14-brand/yash14-mark.svg";
const LOGOTYPE_ASSET = "/assets/yash14-brand/yash14-logotype.svg";

const PAGE_TITLE = "Brand";
const PAGE_DESCRIPTION = `Key elements of the ${USER.displayName} visual identity, including the mark, logotype, clear space, and color.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/brand",
  },
  openGraph: {
    title: `${PAGE_TITLE} – ${SITE_INFO.name}`,
    description: PAGE_DESCRIPTION,
    url: "/brand",
  },
};

export default function BrandPage() {
  return (
    <div className="mx-auto md:max-w-3xl">
      {/* Intro */}
      <Panel>
        <PanelHeader>
          <PanelTitle>{PAGE_TITLE}</PanelTitle>
        </PanelHeader>
        <PanelDescription className="px-4">
          {PAGE_DESCRIPTION} Right-click any logo on this page to copy it as SVG
          or download the full brand assets pack.
        </PanelDescription>
      </Panel>

      {/* Mark */}
      <Panel>
        <PanelHeader>
          <PanelTitle>Mark</PanelTitle>
        </PanelHeader>

        <BrandContextMenu>
          <PanelContent className="flex items-center justify-center py-16">
            <YTMark className="h-16 w-auto text-foreground sm:h-20" />
          </PanelContent>
        </BrandContextMenu>

        <div className="screen-line-top flex justify-center p-4">
          <Button asChild variant="outline" size="sm">
            <a href={MARK_ASSET} download>
              <Download />
              Download Mark
            </a>
          </Button>
        </div>
      </Panel>

      {/* Logotype */}
      <Panel>
        <PanelHeader>
          <PanelTitle>Logotype</PanelTitle>
        </PanelHeader>

        <BrandContextMenu>
          <PanelContent className="flex items-center justify-center px-8 py-16">
            <YTWordmark className="h-8 w-auto text-foreground sm:h-10" />
          </PanelContent>
        </BrandContextMenu>

        <div className="screen-line-top flex justify-center p-4">
          <Button asChild variant="outline" size="sm">
            <a href={LOGOTYPE_ASSET} download>
              <Download />
              Download Logotype
            </a>
          </Button>
        </div>
      </Panel>

      {/* Clear Space */}
      <Panel>
        <PanelHeader>
          <PanelTitle>Clear Space</PanelTitle>
        </PanelHeader>

        <PanelDescription className="px-4">
          Maintain a clear space of 1/2 the height of the Mark on all sides of
          the logo, except in limited cases where the logo remains clearly
          recognizable and legible.
        </PanelDescription>

        <PanelContent className="screen-line-top flex items-center justify-center py-16">
          <div className="inline-block border border-dashed border-line p-(--clear-space) [--clear-space:--spacing(8)] sm:[--clear-space:--spacing(10)]">
            <div className="border border-dashed border-line p-(--clear-space)">
              <YTMark className="h-16 w-auto text-foreground sm:h-20" />
            </div>
          </div>
        </PanelContent>
      </Panel>

      {/* Color */}
      <Panel>
        <PanelHeader>
          <PanelTitle>Color</PanelTitle>
        </PanelHeader>

        <PanelDescription className="px-4">
          The identity is monochrome. Use Ink on light surfaces and Paper on
          dark surfaces to keep the mark legible.
        </PanelDescription>

        <PanelContent className="screen-line-top grid grid-cols-1 gap-px p-0 sm:grid-cols-2">
          <ColorSwatch name="Ink" hex="#09090B" className="bg-[#09090B]" />
          <ColorSwatch name="Paper" hex="#FFFFFF" className="bg-white" />
        </PanelContent>
      </Panel>

      {/* Download all */}
      <Panel>
        <PanelContent className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-balance text-muted-foreground">
            Download the complete brand assets pack including the mark,
            logotype, and icon in SVG.
          </p>
          <Button asChild>
            <a href={BRAND_ASSETS.url} download>
              <Download />
              Download Brand Assets
            </a>
          </Button>
        </PanelContent>
      </Panel>

      <Separator />
    </div>
  );
}

function ColorSwatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-background p-4">
      <div
        className={`size-12 shrink-0 rounded-lg border border-line ${className ?? ""}`}
        aria-hidden
      />
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="font-mono text-sm text-muted-foreground tabular-nums">
          {hex}
        </span>
      </div>
    </div>
  );
}
