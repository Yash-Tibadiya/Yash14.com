import type { Metadata } from "next";
import { Suspense } from "react";
import type { ProfilePage, WithContext } from "schema-dts";

import { JSON_LD_ID } from "@/config/json-ld";
// import { About } from "@/features/portfolio/components/about"
// import { Bookmarks } from "@/features/portfolio/components/bookmarks"
// import { Certifications } from "@/features/portfolio/components/certifications"
// import { Components } from "@/features/portfolio/components/components"
// import { Experiences } from "@/features/portfolio/components/experiences"
// import {
//   Insights,
//   InsightsSkeleton,
// } from "@/features/portfolio/components/insights"
// import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header";
// import { Projects } from "@/features/portfolio/components/projects"
// import { SocialLinks } from "@/features/portfolio/components/social-links-v2"
// import { TechStack } from "@/features/portfolio/components/tech-stack"
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

          {/* <Overview /> */}
          {/* <SocialLinks /> */}
          {/* <Separator /> */}

          {/* <About /> */}
          {/* <Separator /> */}

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
