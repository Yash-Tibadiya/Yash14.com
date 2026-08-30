import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Caveat, IBM_Plex_Serif } from "next/font/google";

import { cn } from "@/lib/utils";

const fontSans = GeistSans;
const fontMono = GeistMono;

const fontSerif = IBM_Plex_Serif({
  weight: ["400"],
  display: "swap",
  variable: "--font-serif",
});

const fontHandwritten = Caveat({
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-handwritten",
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  fontHandwritten.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-mono:var(--font-geist-mono)]",
);
