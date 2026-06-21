"use client";

import { useId } from "react";
import type { Transition } from "motion/react";
import { motion } from "motion/react";

import { metalClickSound } from "@/lib/soundcn/metal-click";
import { useSound } from "@/hooks/soundcn/use-sound";

/**
 * "YT" monogram drawn in true isometric (30°). Each cell of the flat mark
 * (src/components/yt-mark.tsx) is extruded into a plate, projected onto the
 * isometric floor so the elevated edge sits top-left and the form reads from
 * top-left down to bottom-right. Only outer silhouette edges are stroked —
 * internal seams between adjacent blocks are omitted — and the whole monogram
 * presses in like a button on tap.
 */

// Isometric floor layout: rows run toward the front-right, columns toward the
// front-left. Derived from the flat YT mark, mirrored so the top is on the
// left. true = a filled block.
const GRID = [
  [true, true, true, true, false, true],
  [false, true, false, true, false, true],
  [false, true, false, false, true, false],
  [false, true, false, false, true, false],
];

const COLS = 6;
const ROWS = 4;

// True isometric (30°) projection constants.
const COS = -55.4256; // 64 · cos30° — horizontal run of one tile edge
const SIN = 32; //       64 · sin30° — vertical rise of one tile edge
const ZUNIT = 64; //     vertical pixels per 1 unit of plate height
const OX = 320; //     shift so every projected x ≥ 0
const OY = 10; //        shift so every projected y ≥ 0

const TOP_NORMAL = 0.5; //  resting plate thickness
const TOP_PRESSED = 0.25; // pressed-in plate thickness

// A point is [floorX, floorY, isTop]; isTop picks the animated top plane (z)
// versus the fixed base plane (z = 0).
type Point = [number, number, number];

function projectPoint([fx, fy, isTop]: Point, topZ: number) {
  const z = isTop ? topZ : 0;
  const x = (fx - fy) * COS + OX;
  const y = (fx + fy) * SIN - z * ZUNIT + OY;
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

function pathD(points: Point[], topZ: number, close: boolean) {
  return `M${points.map((p) => projectPoint(p, topZ)).join("L")}${close ? "Z" : ""}`;
}

const filled = (c: number, r: number) =>
  r >= 0 && r < ROWS && c >= 0 && c < COLS && GRID[r][c];
const eastExposed = (c: number, r: number) => filled(c, r) && !filled(c + 1, r);
const southExposed = (c: number, r: number) =>
  filled(c, r) && !filled(c, r + 1);

type Geometry = {
  sideFills: Point[][];
  topFills: Point[][];
  edges: Point[][];
};

function buildGeometry(): Geometry {
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (GRID[r][c]) cells.push([c, r]);
    }
  }
  // Back-to-front so nearer plates paint over farther ones.
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

  const topFills: Point[][] = [];
  const sideFills: Point[][] = [];
  for (const [c, r] of cells) {
    topFills.push([
      [c, r, 1],
      [c + 1, r, 1],
      [c + 1, r + 1, 1],
      [c, r + 1, 1],
    ]);
    if (!filled(c + 1, r)) {
      sideFills.push([
        [c + 1, r, 1],
        [c + 1, r + 1, 1],
        [c + 1, r + 1, 0],
        [c + 1, r, 0],
      ]);
    }
    if (!filled(c, r + 1)) {
      sideFills.push([
        [c, r + 1, 1],
        [c + 1, r + 1, 1],
        [c + 1, r + 1, 0],
        [c, r + 1, 0],
      ]);
    }
  }

  // Outline = boundary edges only (omit seams between adjacent blocks).
  const edgeMap = new Map<string, Point[]>();
  const keyOf = (p: Point) => p.join(",");
  const addEdge = (a: Point, b: Point) => {
    const ka = keyOf(a);
    const kb = keyOf(b);
    const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    if (!edgeMap.has(key)) edgeMap.set(key, [a, b]);
  };

  // Top-plane edges where filled meets empty.
  for (let x = 0; x <= COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (filled(x - 1, y) !== filled(x, y)) addEdge([x, y, 1], [x, y + 1, 1]);
    }
  }
  for (let y = 0; y <= ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (filled(x, y - 1) !== filled(x, y)) addEdge([x, y, 1], [x + 1, y, 1]);
    }
  }

  // Visible wall bottoms and their silhouette verticals (skip verticals shared
  // with a coplanar neighbouring wall so stems read as one continuous face).
  for (const [c, r] of cells) {
    if (!filled(c + 1, r)) {
      addEdge([c + 1, r, 0], [c + 1, r + 1, 0]);
      if (!eastExposed(c, r - 1)) addEdge([c + 1, r, 1], [c + 1, r, 0]);
      if (!eastExposed(c, r + 1)) addEdge([c + 1, r + 1, 1], [c + 1, r + 1, 0]);
    }
    if (!filled(c, r + 1)) {
      addEdge([c, r + 1, 0], [c + 1, r + 1, 0]);
      if (!southExposed(c - 1, r)) addEdge([c, r + 1, 1], [c, r + 1, 0]);
      if (!southExposed(c + 1, r))
        addEdge([c + 1, r + 1, 1], [c + 1, r + 1, 0]);
    }
  }

  return { topFills, sideFills, edges: [...edgeMap.values()] };
}

const GEO = buildGeometry();

type Shape = { normal: string; pressed: string };

const toShape = (points: Point[], close: boolean): Shape => ({
  normal: pathD(points, TOP_NORMAL, close),
  pressed: pathD(points, TOP_PRESSED, close),
});

const SIDE_FILLS = GEO.sideFills.map((p) => toShape(p, true));
const TOP_FILLS = GEO.topFills.map((p) => toShape(p, true));
const EDGES = GEO.edges.map((e) => toShape(e, false));

const GUIDE_LINES = [
  "M-700 855L1230 -259",
  "M-700 727L1230 -387",
  "M-700 596L1230 -511",
  "M-700 -255.5L1300 892",
  "M-700 -322L1300 830",
  "M-700 -453L1300 706",
  "M-700 -520L1300 644",
];

export function YTMarkIsometric() {
  const patternId = useId();

  const transition: Transition = {
    type: "spring",
    mass: 0.5,
    damping: 18,
    stiffness: 200,
  };

  const [play] = useSound(metalClickSound);

  const variantsFor = (shape: Shape) => ({
    normal: { d: shape.normal },
    pressed: { d: shape.pressed },
  });

  return (
    <motion.svg
      className="h-auto w-full touch-manipulation overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="-31 -20 617 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
        {GUIDE_LINES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Recessed wall faces */}
      {SIDE_FILLS.map((shape, i) => (
        <motion.path
          key={`side-${i}`}
          className="fill-background"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {/* Hatched top faces */}
      {TOP_FILLS.map((shape, i) => (
        <motion.path
          key={`top-bg-${i}`}
          className="fill-background"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}
      {TOP_FILLS.map((shape, i) => (
        <motion.path
          key={`top-pattern-${i}`}
          fill={`url(#${patternId})`}
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {/* Outer silhouette outline */}
      {EDGES.map((shape, i) => (
        <motion.path
          key={`edge-${i}`}
          stroke="var(--stroke)"
          strokeWidth="1"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}
    </motion.svg>
  );
}
