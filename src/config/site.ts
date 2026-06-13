import type { Route } from "next";

import type { NavItem } from "@/types/nav";
import { USER } from "@/features/portfolio/data/user";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://yash14.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const LICENSE = {
  name: "MIT License",
  url: "https://github.com/Yash-Tibadiya/Portfolio/blob/main/LICENSE",
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Components",
    href: "/components",
  },
  {
    title: "Blocks",
    href: "/blocks",
  },
];

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
];

export const X_HANDLE = "@Yash_Tibadiya";
export const GITHUB_USERNAME = "Yash-Tibadiya";
export const SOURCE_CODE_GITHUB_REPO = "Yash-Tibadiya/Portfolio";
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/Yash-Tibadiya/Portfolio";

export const UTM_PARAMS = {
  utm_source: "yash14.com",
};

export const BRAND_ASSETS = {
  url: `${SITE_INFO.url}/assets/yash14-brand.zip`,
};
