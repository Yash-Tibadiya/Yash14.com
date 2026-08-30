"use client";

import Link from "next/link";
import { toast } from "sonner";
import { copyText } from "@/utils/copy";
import { BRAND_ASSETS } from "@/config/site";
import { getMarkSVG, YTMark } from "./yt-mark";
import { getWordmarkSVG } from "./yt-wordmark";
import { useTiks } from "@rexa-developer/tiks/react";
import { Download, SquareDashed, Type } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { success } = useTiks();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-fit">
        <ContextMenuItem
          onClick={() => {
            copyText(getMarkSVG());
            toast.success("Mark as SVG copied");
            success();
          }}
        >
          <YTMark />
          Copy Mark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(getWordmarkSVG());
            toast.success("Logotype as SVG copied");
            success();
          }}
        >
          <Type />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem asChild>
          <Link href="/brand-guidelines">
            <SquareDashed />
            Brand Guidelines
          </Link>
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <a href={BRAND_ASSETS.url} download>
            <Download />
            Download Brand Assets
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default BrandContextMenu;
