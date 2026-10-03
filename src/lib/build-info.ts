import { config } from "@/config";
import packageJson from "../../package.json";
import { USER } from "@/features/portfolio/data/user";
import { SOURCE_CODE_GITHUB_URL } from "@/config/site";

/**
 * Reads the Vercel deployment environment variables, inlined at build time by
 * `next.config.ts` so client components can use them. Set them in `.env.local`
 * to exercise the non-development rendering.
 */

const SHORT_SHA_LENGTH = 7;

export type BuildEnvironment = "production" | "preview" | "development";

export type BuildInfo = {
  commitShortSha: string | null;
  /** Null while running locally, where HEAD is often unpushed. */
  commitUrl: string | null;
  environment: BuildEnvironment;
  /** YYYY-MM-DD, in the site owner's time zone. */
  date: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: USER.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Stamped by `next.config.ts` at build time. */
const BUILD_DATE = dateFormatter.format(
  config.build.timestamp ? new Date(config.build.timestamp) : new Date(),
);

function resolveEnvironment(): BuildEnvironment {
  const vercelEnv = config.build.vercelEnv;
  return vercelEnv === "production" || vercelEnv === "preview"
    ? vercelEnv
    : "development";
}

export function getBuildInfo(): BuildInfo {
  const environment = resolveEnvironment();
  const commitSha = config.build.commitSha || undefined;

  return {
    commitShortSha: commitSha?.slice(0, SHORT_SHA_LENGTH) ?? null,
    commitUrl:
      commitSha && environment !== "development"
        ? `${SOURCE_CODE_GITHUB_URL}/commit/${commitSha}`
        : null,
    environment,
    date: BUILD_DATE,
  };
}

const STACK_ITEMS: { name: string; href: string }[] = [
  { name: "next", href: "https://nextjs.org" },
  { name: "react", href: "https://react.dev" },
  { name: "shadcn", href: "https://ui.shadcn.com" },
  { name: "motion", href: "https://motion.dev" },
  { name: "tailwindcss", href: "https://tailwindcss.com" },
];

const declaredVersions: Record<string, string | undefined> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

export type StackItem = {
  name: string;
  version: string;
  href: string;
};

/** The stack as `{ name, version, href }` entries, e.g. next 16.3.3 → nextjs.org. */
export function getStack(): StackItem[] {
  return STACK_ITEMS.flatMap(({ name, href }) => {
    // Drops the range prefix, so `^4.3.3` reads as a version.
    const version = declaredVersions[name]?.replace(/^[^\d]*/, "");
    return version ? [{ name, version, href }] : [];
  });
}
