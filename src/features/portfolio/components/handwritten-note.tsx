import { cn } from "@/lib/utils";

function HandwrittenNote({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="handwritten-note"
      className={cn(
        "pointer-events-none absolute font-handwritten text-xl/none tracking-normal text-muted-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

/** Curves down and to the right. Rotate or mirror it to aim at the subject. */
function HandwrittenArrow({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("h-12 w-24 shrink-0 text-muted-foreground", className)}
      viewBox="0 0 96 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 4c1 21 12 28 74 33" strokeDasharray="5 4" />
      <path d="m68 29 11 8-12 6" />
    </svg>
  );
}

export { HandwrittenArrow, HandwrittenNote };
