"use client";

import type React from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

export function CardSpotlight({
  children,
  radius = 350,
  color,
  className,
  spotlightClassName,
  ...props
}: {
  radius?: number;
  color?: string;
  spotlightClassName?: string;
} & React.ComponentProps<"div">) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn("group/spotlight relative", className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover/spotlight:opacity-100",
          "bg-neutral-300/55 dark:bg-neutral-800/50",
          spotlightClassName,
        )}
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}
