import { SITE_INFO } from "@/config/site";
import { getDocsByCategory } from "@/features/doc/data/documents";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";

const components = getDocsByCategory("components");

const content = `# ${SITE_INFO.name}

> A personal portfolio and shadcn-compatible component registry by ${USER.displayName} — a ${USER.jobTitle} based in ${USER.address}.

${USER.about.trim()}

## Docs

- [About](${SITE_INFO.url}/about.md): A quick intro to ${USER.displayName}, current work, and how to connect.
- [Components](${SITE_INFO.url}/components.md): The shadcn-compatible component registry and how to install from it.
- [Full context](${SITE_INFO.url}/llms-full.txt): Everything on this site, including full component docs, in a single document.

## Components

${components
  .map(
    (doc) =>
      `- [${doc.metadata.title}](${SITE_INFO.url}/components/${doc.slug}.mdx): ${doc.metadata.description}`,
  )
  .join("\n")}

## Connect

${SOCIAL_LINKS.map((item) => `- [${item.title}](${item.href})`).join("\n")}
`;

export const revalidate = false;
export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
