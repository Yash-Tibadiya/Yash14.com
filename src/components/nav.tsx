import type { Route } from "next";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";

export function Nav({
  items,
  activeId,
  className,
  exactMatch = false,
}: {
  items: NavItem<Route>[];
  activeId?: string;
  className?: string;
  exactMatch?: boolean;
}) {
  return (
    <nav
      data-active-id={activeId}
      className={cn("flex items-center gap-4", className)}
    >
      {items.map(({ title, href }) => {
        const isActive = exactMatch
          ? activeId === href
          : activeId === href ||
            (href === "/" // Home page
              ? ["/", "/index"].includes(activeId || "")
              : activeId?.startsWith(href));

        return (
          <NavItem
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
          >
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}

export function NavItem({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "text-sm font-medium text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
