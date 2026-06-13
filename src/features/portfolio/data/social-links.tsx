import { Icons } from "@/components/icons";
import type { SocialLink } from "@/features/portfolio/types/social-links";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "x",
    icon: <Icons.x />,
    title: "X",
    handle: "@Yash_Tibadiya",
    href: "https://x.com/Yash_Tibadiya",
  },
  {
    name: "github",
    icon: <Icons.github />,
    title: "GitHub",
    handle: "Yash-Tibadiya",
    href: "https://github.com/Yash-Tibadiya",
  },
  {
    name: "linkedin",
    icon: <Icons.linkedin />,
    title: "LinkedIn",
    handle: "Yash Timbadiya",
    href: "https://www.linkedin.com/in/yash-timbadiya-51a972249",
  },
  {
    name: "Email",
    icon: <Icons.email />,
    title: "Email",
    handle: "tibadiyayash@gmail.com",
    href: "mailto:tibadiyayash@gmail.com",
  },
];

export function getSocialLinkByName(name: string) {
  return SOCIAL_LINKS.find((link) => link.name === name);
}
