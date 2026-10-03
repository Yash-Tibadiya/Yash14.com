import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_INFO } from "@/config/site";
import { readFile } from "node:fs/promises";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_IMAGE_CONTENT_TYPE = "image/png";

type OgImageOptions = {
  title: string;
  description?: string;
};

const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

async function loadFonts() {
  const [medium, semiBold, mono] = await Promise.all([
    readFile(join(FONTS_DIR, "Geist-Medium.ttf")),
    readFile(join(FONTS_DIR, "Geist-SemiBold.ttf")),
    readFile(join(FONTS_DIR, "GeistMono-Regular.ttf")),
  ]);

  return [
    {
      name: "Geist",
      data: medium,
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: semiBold,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: mono,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

export async function renderOgImage({ title, description }: OgImageOptions) {
  const host = new URL(SITE_INFO.url).host;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontFamily: "Geist",
      }}
    >
      <svg
        aria-hidden="true"
        width="96"
        height="64"
        viewBox="0 0 390 260"
        fill="#fafafa"
      >
        <rect x="195" y="0" width="195" height="65" />
        <rect x="130" width="65" height="130" />
        <rect x="65" y="130" width="65" height="130" />
        <rect width="65" height="130" />
        <rect x="260" y="65" width="65" height="195" />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: "Geist Mono",
          fontSize: 24,
          color: "#71717a",
        }}
      >
        {host}
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts: await loadFonts(),
    },
  );
}
