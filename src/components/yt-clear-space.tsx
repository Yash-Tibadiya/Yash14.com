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
 * The wordmark is 5345×520 and fills its viewBox edge-to-edge, so we nest it
 * inside a larger canvas with a 260-unit border (1/2 the mark glyph height) on
 * every side and visualize that border with a dashed grid + shaded cells. The
 * viewBox is padded a few units so the outer frame lines aren't clipped.
 */
export function YTWordmarkClearSpace(props: React.ComponentProps<"svg">) {
  const CELL = 260;
  const RIGHT = 5866; // outer-right frame x
  const TOP_Y = 1; // top clear-space strip (above the wordmark)
  const BOTTOM_Y = 781; // bottom clear-space strip (below the wordmark)
  const FRAME_X = new Set([1, 261, 5606, 5866]); // verticals already drawn

  const square = (x: number, y: number) =>
    `M${x} ${y}h${CELL}v${CELL}h-${CELL}z`;
  const guides = (x: number, y: number) =>
    [x, x + CELL]
      .filter((edge) => !FRAME_X.has(edge))
      .map((edge) => `M${edge} ${y}v${CELL}`)
      .join("");

  // Symmetric block pattern, mirrored about the canvas center. The period is
  // 4 cells (1 block + a 3-cell gap). The top row carries a block on the
  // center line; the bottom row is offset half a period so its center is a
  // gap flanked by blocks. Each row is its own left/right mirror image and the
  // two rows interleave.
  const center = (1 + RIGHT) / 2;
  const STEP = 4 * CELL;
  const PAD = CELL; // horizontal inset so blocks never hug the outer frame
  const rowX = (firstOffset: number) => {
    const xs: number[] = [];
    for (let off = firstOffset; ; off += STEP) {
      const left = center - CELL / 2 + off;
      const leftMirror = center - CELL / 2 - off;
      const fitsR = left >= 1 + PAD && left + CELL <= RIGHT - PAD;
      const fitsL = leftMirror >= 1 + PAD && leftMirror + CELL <= RIGHT - PAD;
      if (!fitsR && !fitsL) break;
      if (fitsR) xs.push(left);
      if (fitsL && off !== 0) xs.push(leftMirror);
    }
    return xs;
  };
  const topX = rowX(0); // block on the center line
  const bottomX = rowX(2 * CELL); // gap on the center line

  const shaded =
    topX.map((x) => square(x, TOP_Y)).join("") +
    bottomX.map((x) => square(x, BOTTOM_Y)).join("") +
    square(1, 521) + // left side cell (down)
    square(5606, 521); // right side cell (down)

  const cellGuides =
    topX.map((x) => guides(x, TOP_Y)).join("") +
    bottomX.map((x) => guides(x, BOTTOM_Y)).join("");

  const frame =
    // outer frame + wordmark frame (horizontals then verticals)
    "M1 1h5865M1 261h5865M1 781h5865M1 1041h5865" +
    "M1 1v1040M261 1v1040M5606 1v1040M5866 1v1040" +
    // side-cell dividers (left + right cells)
    "M1 521h260M5606 521h260";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-4 -4 5875 1050"
      aria-hidden
      {...props}
    >
      {/* Shaded clear-space cells */}
      <path className="fill-current/8" d={shaded} />

      {/* Dashed grid: outer frame, wordmark frame, and cell guides.
          Stroke + dash are scaled ~3x so they render at the same on-screen
          size as YTMarkClearSpace despite the much larger coordinate system. */}
      <path
        className="stroke-current/30"
        strokeWidth={3}
        strokeDasharray="24 12"
        d={frame + cellGuides}
      />

      {/* Wordmark */}
      <YTWordmarkClearSpaceSvg x={261} y={261} width={5345} height={520} />
    </svg>
  );
}
