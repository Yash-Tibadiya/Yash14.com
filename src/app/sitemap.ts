import type { MetadataRoute } from "next";

import { blockCategories } from "@/config/registry";
import { SITE_INFO } from "@/config/site";
import { getAllBlockStaticParams } from "@/lib/blocks";
import { getDocsByCategory } from "@/features/doc/data/documents";

export const revalidate = false;
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const components = getDocsByCategory("components").map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt).toISOString(),
  }));

  const blockCategoryPages = blockCategories.map((category) => ({
    url: `${SITE_INFO.url}/blocks/${category.name}`,
    lastModified: new Date().toISOString(),
  }));

  const blocks = (await getAllBlockStaticParams()).map(
    ({ category, name }) => ({
      url: `${SITE_INFO.url}/blocks/${category}/${name}`,
      lastModified: new Date().toISOString(),
    }),
  );

  const routes = ["", "/components", "/components/showcase", "/blocks"].map(
    (route) => ({
      url: `${SITE_INFO.url}${route}`,
      lastModified: new Date().toISOString(),
    }),
  );

  return [...routes, ...components, ...blockCategoryPages, ...blocks];
}
