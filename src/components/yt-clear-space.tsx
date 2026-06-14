import { YTMark } from "@/components/yt-mark";
import { YTWordmarkClearSpaceSvg } from "@/components/yt-wordmark-clear-space-svg";

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
 * The wordmark is 5389×520 and fills its viewBox edge-to-edge, so we nest it
 * inside a larger canvas with a 260-unit border (1/2 the mark glyph height) on
 * every side and visualize that border with a dashed grid + shaded cells. The
 * viewBox is padded a few units so the outer frame lines aren't clipped.
 */
export function YTWordmarkClearSpace(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-4 -4 5919 1050"
      aria-hidden
      {...props}
    >
      {/* Shaded clear-space cells (left up, right down) */}
      <path
        className="fill-current/8"
        d="M2826 1h260v260h-260zM2826 781h260v260h-260zM1 261h260v260H1zM5650 521h260v260h-260z"
      />

      {/* Dashed grid: outer frame, wordmark frame, and cell guides.
          Stroke + dash are scaled ~3x so they render at the same on-screen
          size as YTMarkClearSpace despite the much larger coordinate system. */}
      <path
        className="stroke-current/30"
        strokeWidth={3}
        strokeDasharray="24 12"
        d="M1 1h5909M1 261h5909M1 781h5909M1 1041h5909M1 1v1040M261 1v1040M5650 1v1040M5910 1v1040M2826 1v260M3086 1v260M2826 781v260M3086 781v260M1 521h260M5650 521h260"
      />

      {/* Wordmark */}
      <YTWordmarkClearSpaceSvg x={261} y={261} width={5389} height={520} />
    </svg>
  );
}
