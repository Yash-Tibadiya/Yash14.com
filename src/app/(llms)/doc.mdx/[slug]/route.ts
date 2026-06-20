import { notFound } from "next/navigation";

import { getAllDocs } from "@/features/doc/data/documents";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    slug: doc.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const post = getAllDocs().find((doc) => doc.slug === slug);

  if (!post) {
    notFound();
  }

  const text = `# ${post.metadata.title}

${post.metadata.description}

${post.content.trim()}

Last updated on ${new Date(post.metadata.updatedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  )}`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
