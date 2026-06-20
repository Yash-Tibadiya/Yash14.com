import { registryConfig } from "@/config/registry";
import { SITE_INFO } from "@/config/site";
import { getDocsByCategory } from "@/features/doc/data/documents";

const components = getDocsByCategory("components");

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const content = `# Components

A shadcn-compatible registry of pixel-perfect, uniquely crafted components.

Install any component with the shadcn CLI using the \`${registryConfig.namespace}\` namespace:

\`\`\`bash
npx shadcn@latest add ${registryConfig.namespace}/<component-name>
\`\`\`

${components
  .map(
    (doc) =>
      `## ${doc.metadata.title}

${doc.metadata.description}

- Docs: ${SITE_INFO.url}/components/${doc.slug}
- Install: \`npx shadcn@latest add ${registryConfig.namespace}/${doc.slug}\`
- Last updated: ${formatDate(doc.metadata.updatedAt)}`,
  )
  .join("\n\n")}
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
