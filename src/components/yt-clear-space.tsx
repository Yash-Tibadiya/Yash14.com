import { YTMark } from "@/components/yt-mark";
import { YTWordmark } from "@/components/yt-wordmark";

/**
 * Clear-space demo for the YT mark.
 *
 * The mark is 390×260 and fills its viewBox edge-to-edge, so we nest it inside
 * a larger canvas with a 130-unit border (1/2 the mark height) on every side
 * and visualize that border with a dashed grid + shaded cells. The viewBox is
 * padded a few units so the outer frame lines aren't clipped at the edges.
 */
export function YTMarkClearSpace(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-4 -4 660 530"
      aria-hidden
      {...props}
    >
      {/* Shaded clear-space cells (left up, right down) */}
      <path
        className="fill-current/8"
        d="M261 1h130v130h-130zM261 391h130v130h-130zM1 131h130v130H1zM521 261h130v130h-130z"
      />

      {/* Dashed grid: outer frame, mark frame, and cell guides */}
      <path
        className="stroke-current/30"
        strokeDasharray="8 4"
        d="M1 1h650M1 131h650M1 391h650M1 521h650M1 1v520M131 1v520M521 1v520M651 1v520M261 1v130M391 1v130M261 391v130M391 391v130M1 261h130M521 261h130"
      />

      {/* Mark */}
      <YTMark x={131} y={131} width={390} height={260} />
    </svg>
  );
}

/**
 * Clear-space demo for the YT wordmark.
 *
 * The wordmark is 5307×569 and fills its viewBox edge-to-edge, so we nest it
 * inside a larger canvas with a 200-unit border (1/2 the mark glyph height) on
 * every side and visualize that border with a dashed grid + shaded cells. The
 * viewBox is padded a few units so the outer frame lines aren't clipped.
 */
export function YTWordmarkClearSpace(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-4 -4 5717 979"
      aria-hidden
      {...props}
    >
      {/* Shaded clear-space cells (left up, right down) */}
      <path
        className="fill-current/8"
        d="M2754 1h200v200h-200zM2754 770h200v200h-200zM1 201h200v200H1zM5508 570h200v200h-200z"
      />

      {/* Dashed grid: outer frame, wordmark frame, and cell guides */}
      <path
        className="stroke-current/30"
        strokeDasharray="8 4"
        d="M1 1h5707M1 201h5707M1 770h5707M1 970h5707M1 1v969M201 1v969M5508 1v969M5708 1v969M2754 1v200M2954 1v200M2754 770v200M2954 770v200M1 401h200M5508 570h200"
      />

      {/* Wordmark */}
      <YTWordmark x={201} y={201} width={5307} height={569} />
    </svg>
  );
}
