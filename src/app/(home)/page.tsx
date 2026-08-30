import type { Metadata } from "next";
import type { ProfilePage, WithContext } from "schema-dts";

import { JSON_LD_ID } from "@/config/json-ld";
import { GitHubContributions } from "@/features/portfolio/components/github-contributions";
import { Overview } from "@/features/portfolio/components/overview";
import { ProfileHeader } from "@/features/portfolio/components/profile-header";
import { SocialLinks } from "@/features/portfolio/components/social-links";
import { Hello } from "@/features/portfolio/components/hello";
import { USER } from "@/features/portfolio/data/user";
import { JsonLdScript } from "@/lib/json-ld";
import { absoluteUrl, cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={getProfilePageJsonLd()} />

      <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
        <div className="mx-auto md:max-w-4xl">
          <ProfileHeader />
          <Separator />

          <Overview />
          <SocialLinks />
          <GitHubContributions />
          <Separator />

          <Hello />
          {/* <SponsorsCarousel /> */}
          <Separator />

          {/* <TechStack /> */}
          {/* <Separator /> */}

          {/* <Components /> */}
          {/* <Separator /> */}

          {/* <Experiences /> */}
          {/* <Separator /> */}

          {/* <Projects /> */}
          {/* <Separator /> */}

          {/* <Certifications /> */}
          {/* <Separator /> */}

          {/* <Bookmarks /> */}
          {/* <Separator /> */}

          {/* <Suspense fallback={<InsightsSkeleton />}> */}
          {/* <Insights /> */}
          {/* </Suspense> */}
          {/* <Separator /> */}
        </div>
      </div>
    </>
  );
}

function getProfilePageJsonLd(): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/"),
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    // Reference the Person defined in the WebSite node (rendered globally in
    // the root layout) so both blocks resolve to the same entity.
    mainEntity: { "@id": JSON_LD_ID.person },
  };
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x border-line",
        className,
      )}
    ></div>
  );
}
