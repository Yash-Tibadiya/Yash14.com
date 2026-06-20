import { registryConfig } from "@/config/registry";
import { SITE_INFO } from "@/config/site";
import { getDocsByCategory } from "@/features/doc/data/documents";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";

const components = getDocsByCategory("components");

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const aboutText = `## About

${USER.about.trim()}

### Personal Information

- Name: ${USER.displayName}
- Pronouns: ${USER.pronouns}
- Job Title: ${USER.jobTitle}
- Location: ${USER.address}
- Website: ${USER.website}

### Work

${USER.jobs
  .map((job) => `- ${job.title} at [${job.company}](${job.website})`)
  .join("\n")}

### Social Links

${SOCIAL_LINKS.map((item) => `- [${item.title}](${item.href})`).join("\n")}
`;

const componentsText = `## Components

A shadcn-compatible registry. Install any component with: \`npx shadcn@latest add ${registryConfig.namespace}/<component-name>\`

${components
  .map(
    (doc) =>
      `### ${doc.metadata.title}

${doc.metadata.description}

Source: ${SITE_INFO.url}/components/${doc.slug}
Install: npx shadcn@latest add ${registryConfig.namespace}/${doc.slug}
Last updated: ${formatDate(doc.metadata.updatedAt)}

${doc.content.trim()}`,
  )
  .join("\n\n")}
`;

const content = `<SYSTEM>This document contains comprehensive information about ${USER.displayName}'s portfolio and component registry. It includes personal details, current work, social links, and the full documentation for every component published on ${SITE_INFO.url}. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${USER.displayName}'s work as a ${USER.jobTitle}.</SYSTEM>

# ${SITE_INFO.name}

> A personal portfolio and shadcn-compatible component registry by ${USER.displayName} — a ${USER.jobTitle} based in ${USER.address}.

${aboutText}
${componentsText}`;

export const revalidate = false;
export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
