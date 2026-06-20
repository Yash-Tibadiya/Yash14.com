import { LICENSE, SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { cn } from "@/lib/utils";
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand";
import { SiteFooterLinks } from "@/components/site-footer-links";
import { getSocialLinkByName } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";

export function SiteFooter() {
  const xLink = getSocialLinkByName("x");

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="screen-line-top mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-4xl">
        <div className="screen-line-bottom h-1" />

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          <Item>
            <dt>Crafted by</dt>
            <dd>
              <a
                className="link-underline"
                href={xLink?.href}
                target="_blank"
                rel="noopener"
              >
                {USER.displayName}
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Inspired by</dt>
            <dd>
              <ul>
                <li>tailwindcss.com</li>
                <li>ui.shadcn.com</li>
                <li>vercel.com</li>
                <li>devouringdetails.com</li>
              </ul>
            </dd>
          </Item>

          <Item>
            <dt>Deployed on</dt>
            <dd>Vercel</dd>
          </Item>

          <Item>
            <dt>Analytics</dt>
            <dd>
              <ul>
                <li>PostHog</li>
              </ul>
            </dd>
          </Item>

          <Item>
            <dt>Source code</dt>
            <dd>
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </dd>
          </Item>

          <Item>
            <dt>License</dt>
            <dd>
              <a
                className="link-underline"
                href={LICENSE.url}
                target="_blank"
                rel="noopener"
              >
                {LICENSE.name}
              </a>
            </dd>
          </Item>
        </dl>

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
          className="mx-auto flex h-64 items-center justify-center before:z-1 before:transition-[background-color] md:max-w-7xl"
          data-header-container
        >

          <SiteFooterInteractiveLogotype text="YASH 14" />
        </div>
      </div>

      {/* <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-24" />
      </div> */}
    </footer>
  );
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />;
}
