export function YTMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 390 260"
      aria-hidden
      {...props}
    >
      <rect
        x="195"
        y="65"
        width="65"
        height="195"
        transform="rotate(-90 195 65)"
        fill="currentColor"
      />
      <rect x="130" width="65" height="130" fill="currentColor" />
      <rect x="65" y="130" width="65" height="130" fill="currentColor" />
      <rect width="65" height="130" fill="currentColor" />
      <rect x="260" y="65" width="65" height="195" fill="currentColor" />
    </svg>
  );
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 390 260"><rect x="195" y="65" width="65" height="195" transform="rotate(-90 195 65)" fill="currentColor"/><rect x="130" width="65" height="130" fill="currentColor"/><rect x="65" y="130" width="65" height="130" fill="currentColor"/><rect width="65" height="130" fill="currentColor"/><rect x="260" y="65" width="65" height="195" fill="currentColor"/></svg>`;
}
