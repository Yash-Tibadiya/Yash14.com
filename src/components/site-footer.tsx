import type { BuildInfo } from "@/lib/build-info";

import { cn } from "@/lib/utils";
import registry from "../../registry.json";
import packageJson from "../../package.json";
import { getBuildInfo } from "@/lib/build-info";
import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { SOCIAL } from "@/features/portfolio/data/social-links";
import { SiteFooterLinks } from "@/components/site-footer-links";
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand";

const INSPIRED_BY = [
  "Tailwind CSS",
  "shadcn/ui",
  "Vercel",
  "Evil Charts",
  "Devouring Details",
  "Skiper UI",
  "Making Software",
  "shadcncraft",
];

const SITE_TITLE = "chanhdai.com";
const SITE_SUBTITLE = packageJson.description;

const STACK = [
  `next@${packageJson.dependencies.next.replace(/^\^/, "")}`,
  `react@${packageJson.dependencies.react.replace(/^\^/, "")}`,
  `tailwindcss@${packageJson.devDependencies.tailwindcss.replace(/^\^/, "")}`,
];

export function SiteFooter() {
  const xLink = SOCIAL.x;

  const build = getBuildInfo();

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="screen-line-top mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-4xl">
        <div className="screen-line-bottom h-1" />

        <div className="relative">
          <div className="screen-line-bottom flex flex-col items-start gap-x-4 gap-y-1 px-4 py-3 font-mono text-sm sm:flex-row sm:items-baseline sm:justify-between">
            <span className="font-medium">{SITE_TITLE}</span>
            <span className="font-sans text-muted-foreground">
              {SITE_SUBTITLE}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line font-mono md:grid-cols-4">
            <Field label="Crafted by">
              <a
                className="link-underline"
                href={xLink?.href}
                target="_blank"
                rel="noopener"
              >
                {xLink?.handle}
              </a>
            </Field>

            <Field label="Build">
              <BuildValue build={build} />
            </Field>

            <Field label="Date">
              <time dateTime={build.date}>{build.date}</time>
            </Field>

            <Field label="Registry">
              {registry.items.length}{" "}
              {registry.items.length === 1 ? "item" : "items"}
            </Field>

            <Field label="Deployed on">
              <span className="font-sans" aria-hidden>
                ▲
              </span>
              <span className="sr-only">Vercel</span>
            </Field>

            <Field label="Source code">
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </Field>

            <Field label="License">
              <a
                className="link-underline"
                href={LICENSE.url}
                target="_blank"
                rel="noopener"
              >
                {LICENSE.name}
              </a>
            </Field>

            <Field label="Typeface">Geist</Field>

            <Field className="col-span-2" label="Stack">
              <ul className="flex flex-col gap-0.5">
                {STACK.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </Field>

            <Field className="col-span-2" label="Analytics">
              <ul className="flex flex-col gap-0.5">
                <li>PostHog</li>
              </ul>
            </Field>

            <Field className="col-span-2 md:col-span-4" label="Inspired by">
              <ol className="-mx-4 grid grid-cols-2 gap-x-px gap-y-0.5 font-sans md:grid-cols-4">
                {INSPIRED_BY.map((name, index) => (
                  <li className="flex gap-2 px-4" key={name}>
                    <span
                      className="font-mono text-muted-foreground/80"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {name}
                  </li>
                ))}
              </ol>
            </Field>
          </dl>
        </div>

        <div className="screen-line-top h-4" />

        <div className="screen-line-top pt-4">
          <figure className="relative mx-auto flex flex-col items-center px-4 text-center z-10 pb-3">
            <blockquote className="w-full text-center">
              <p className="font-serif italic tracking-tight text-lg sm:text-2xl md:text-3xl">
                “Learn continually. There‘s always{" "}
                <span className="bg-linear-to-r from-[#7182ff] via-[#3cff52] to-[#ff7a00] bg-clip-text text-transparent">
                  one more thing{" "}
                </span>{" "}
                to learn”
              </p>
            </blockquote>
            <figcaption className="mt-2 text-right text-sm opacity-85 flex flex-col items-center">
              ~ Steve Jobs
            </figcaption>
          </figure>
        </div>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <SiteFooterLinks />
        </div>

        {/* <div className="*:absolute *:z-2 *:flex *:size-2 *:border *:border-line *:bg-background">
          <div className="bottom-[-3.5px] left-[-4.5px]" />
          <div className="right-[-4.5px] bottom-[-3.5px]" />
        </div> */}
      </div>

      <div
        className={cn(
          "max-w-screen overflow-x-hidden bg-background px-2",
          "transition-shadow duration-300",
        )}
      >
        <div
          className="mx-auto flex items-center justify-center before:z-1 before:transition-[background-color] md:max-w-7xl"
          data-header-container
        >
          <SiteFooterInteractiveLogotype text="YASH 14" />
        </div>
      </div>
    </footer>
  );
}

function BuildValue({ build }: { build: BuildInfo }) {
  if (!build.commitShortSha) {
    return <span className="text-muted-foreground">unavailable</span>;
  }

  return (
    <>
      {build.commitUrl ? (
        <a
          className="link-underline"
          href={build.commitUrl}
          target="_blank"
          rel="noopener"
        >
          {build.commitShortSha}
        </a>
      ) : (
        build.commitShortSha
      )}

      {build.environment !== "production" && (
        <span className="text-muted-foreground">
          {" "}
          ({build.environment === "development" ? "local" : build.environment})
        </span>
      )}
    </>
  );
}

function Field({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        className,
      )}
    >
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}
