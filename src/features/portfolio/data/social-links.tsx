import type { SocialProfile } from "@/features/portfolio/types/social-links";

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  x: {
    title: "X",
    handle: "@Yash_Tibadiya",
    href: "https://x.com/Yash_Tibadiya",
  },
  github: {
    title: "GitHub",
    handle: "Yash-Tibadiya",
    href: "https://github.com/Yash-Tibadiya",
  },
  linkedin: {
    title: "LinkedIn",
    handle: "Yash Timbadiya",
    href: "https://www.linkedin.com/in/yash-timbadiya-51a972249",
  },
} satisfies Record<string, SocialProfile>;

export type SocialName = keyof typeof SOCIAL;

export type SocialLink = SocialProfile & { name: SocialName };

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }));
