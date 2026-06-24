"use client";

import { useEffect, useId, useState } from "react";
import type { Transition } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

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
// const OX = 320; //     shift so every projected x ≥ 0
//TODO: Uncomment this when the design is finalized
const OX = 360; //     shift so every projected x ≥ 0
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
  sideFillsBehindTraffic: Point[][];
  topFills: Point[][];
  wallEdges: Point[][];
  wallEdgesBehindTraffic: Point[][];
  topEdges: Point[][];
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
  const sideFillsBehindTraffic: Point[][] = [];
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
      const wall: Point[] = [
        [c, r + 1, 1],
        [c + 1, r + 1, 1],
        [c + 1, r + 1, 0],
        [c, r + 1, 0],
      ];
      if (r === ROWS - 1) {
        sideFillsBehindTraffic.push(wall);
      } else {
        sideFills.push(wall);
      }
    }
  }

  // Outline = boundary edges only (omit seams between adjacent blocks).
  const wallEdgeMap = new Map<string, Point[]>();
  const wallEdgeBehindTrafficMap = new Map<string, Point[]>();
  const topEdgeMap = new Map<string, Point[]>();
  const keyOf = (p: Point) => p.join(",");
  const addEdge = (
    a: Point,
    b: Point,
    layer: "wall" | "top",
    behindTraffic = false,
  ) => {
    const ka = keyOf(a);
    const kb = keyOf(b);
    const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    if (layer === "top") {
      if (!topEdgeMap.has(key)) topEdgeMap.set(key, [a, b]);
      return;
    }
    const map = behindTraffic ? wallEdgeBehindTrafficMap : wallEdgeMap;
    if (!map.has(key)) map.set(key, [a, b]);
  };

  // Top-plane edges where filled meets empty.
  for (let x = 0; x <= COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (filled(x - 1, y) !== filled(x, y))
        addEdge([x, y, 1], [x, y + 1, 1], "top");
    }
  }
  for (let y = 0; y <= ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (filled(x, y - 1) !== filled(x, y))
        addEdge([x, y, 1], [x + 1, y, 1], "top");
    }
  }

  // Visible wall bottoms and their silhouette verticals (skip verticals shared
  // with a coplanar neighbouring wall so stems read as one continuous face).
  for (const [c, r] of cells) {
    const southBehindTraffic = r === ROWS - 1;
    if (!filled(c + 1, r)) {
      addEdge([c + 1, r, 0], [c + 1, r + 1, 0], "wall");
      if (!eastExposed(c, r - 1)) addEdge([c + 1, r, 1], [c + 1, r, 0], "wall");
      if (!eastExposed(c, r + 1))
        addEdge([c + 1, r + 1, 1], [c + 1, r + 1, 0], "wall");
    }
    if (!filled(c, r + 1)) {
      addEdge([c, r + 1, 0], [c + 1, r + 1, 0], "wall", southBehindTraffic);
      if (!southExposed(c - 1, r))
        addEdge([c, r + 1, 1], [c, r + 1, 0], "wall", southBehindTraffic);
      if (!southExposed(c + 1, r))
        addEdge([c + 1, r + 1, 1], [c + 1, r + 1, 0], "wall", southBehindTraffic);
    }
  }

  return {
    topFills,
    sideFills,
    sideFillsBehindTraffic,
    wallEdges: [...wallEdgeMap.values()],
    wallEdgesBehindTraffic: [...wallEdgeBehindTrafficMap.values()],
    topEdges: [...topEdgeMap.values()],
  };
}

const GEO = buildGeometry();

type Shape = { normal: string; pressed: string };

const toShape = (points: Point[], close: boolean): Shape => ({
  normal: pathD(points, TOP_NORMAL, close),
  pressed: pathD(points, TOP_PRESSED, close),
});

const SIDE_FILLS = GEO.sideFills.map((p) => toShape(p, true));
const SIDE_FILLS_BEHIND_TRAFFIC = GEO.sideFillsBehindTraffic.map((p) =>
  toShape(p, true),
);
const TOP_FILLS = GEO.topFills.map((p) => toShape(p, true));
const WALL_EDGES = GEO.wallEdges.map((e) => toShape(e, false));
const WALL_EDGES_BEHIND_TRAFFIC = GEO.wallEdgesBehindTraffic.map((e) =>
  toShape(e, false),
);
const TOP_EDGES = GEO.topEdges.map((e) => toShape(e, false));

const SURFACE_FILL = "var(--background)";

// const GUIDE_LINES = [
//   "M-700 855L1230 -259",
//   "M-700 727L1230 -387",
//   "M-700 596L1230 -511",
//   "M-700 -255.5L1300 892",
//   "M-700 -322L1300 830",
//   "M-700 -453L1300 706",
//   "M-700 -520L1300 644",
// ];

const GUIDE_LINES = [
  "M-700 879L1230 -237",
  "M-700 751L1230 -365",
  "M-700 620L1230 -489",
  "M-700 -282L1300 873",
  "M-700 -348L1300 811",
  "M-700 -474L1300 680.5",
  "M-700 -542L1300 619",
];

const GUIDE_DASH = "4 2";
const GUIDE_DASH_PERIOD = 6;

const guideLineTransition: Transition = {
  repeat: Infinity,
  duration: 0.7,
  // duration: 1.4,
  ease: "linear",
};

// The diagonal corridor between two adjacent ascending guide lines.

// 1st Background
// Top edge: "M-700 -542L1300 619", bottom edge: "M-700 -474L1300 680.5".
const BAND_0 = {
  top: "M-700 -542L1300 619",
  bottom: "M-700 -474L1300 680.5",
} as const;
const BAND_FILL = `${BAND_0.top}L1300 680.5L-700 -474Z`;
// 2nd Background
const BAND_1 = {
  top: "M-700 -348L1300 811",
  bottom: "M-700 -282L1300 873",
} as const;
const BAND_FILL_2 = `${BAND_1.top}L1300 873L-700 -282Z`;

// ----------------------------------------------------------------- traffic --
// Cars and trucks ride the two corridors. They reuse the block projection so
// each vehicle reads as a small isometric plate: forward (u) runs down the
// corridor (the +fy axis), side (v) crosses it (+fx) and up (w) is +z. One
// floor unit = 64px, matching the monogram. Vehicles are painted *before* the
// blocks, so the "YT" occludes them like a tunnel mouth as they pass beneath.
const FWD = { x: -COS, y: SIN }; //  ( 55.43,  32) — along the corridor
const VSIDE = { x: COS, y: SIN }; // (-55.43,  32) — across the corridor
const VUP = { x: 0, y: -ZUNIT }; //  (     0, -64) — vertical

const vproj = (u: number, v: number, w: number): [number, number] => [
  u * FWD.x + v * VSIDE.x + w * VUP.x,
  u * FWD.y + v * VSIDE.y + w * VUP.y,
];

const poly = (corners: Array<[number, number]>) =>
  `M${corners.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

type Box = { u: [number, number]; v: [number, number]; w: [number, number] };

// The three viewer-facing faces of a local box: the down-left side (v = max),
// the down-right front (u = max) and the top (w = max).
function boxFaces({ u: [u0, u1], v: [v0, v1], w: [w0, w1] }: Box) {
  return {
    side: poly([
      vproj(u0, v1, w0),
      vproj(u1, v1, w0),
      vproj(u1, v1, w1),
      vproj(u0, v1, w1),
    ]),
    front: poly([
      vproj(u1, v0, w0),
      vproj(u1, v1, w0),
      vproj(u1, v1, w1),
      vproj(u1, v0, w1),
    ]),
    top: poly([
      vproj(u0, v0, w1),
      vproj(u1, v0, w1),
      vproj(u1, v1, w1),
      vproj(u0, v1, w1),
    ]),
  };
}

type Prim = { d: string; fill: string; stroked: boolean };

const boxPrims = (b: Box): Prim[] => {
  const f = boxFaces(b);
  return [
    { d: f.side, fill: "var(--v-side)", stroked: true },
    { d: f.front, fill: "var(--v-front)", stroked: true },
    { d: f.top, fill: "var(--v-top)", stroked: true },
  ];
};

// A wheel patch sits on the visible side plane (v fixed) as a small rectangle
// spanning the (u, w) plane.
const wheelPrim = (
  u: [number, number],
  w: [number, number],
  v: number,
): Prim => ({
  d: poly([
    vproj(u[0], v, w[0]),
    vproj(u[1], v, w[0]),
    vproj(u[1], v, w[1]),
    vproj(u[0], v, w[1]),
  ]),
  fill: "var(--v-wheel)",
  stroked: false,
});

// Each vehicle is a back-to-front list of primitives: lower/farther boxes first
// so nearer/upper boxes paint over them.

// function buildCar(): Prim[] {
//   const body: Box = { u: [-0.52, 0.52], v: [-0.26, 0.26], w: [0.05, 0.19] };
//   const cabin: Box = { u: [-0.3, 0.18], v: [-0.2, 0.2], w: [0.19, 0.33] };
//   return [
//     ...boxPrims(body),
//     wheelPrim([0.24, 0.42], [0, 0.11], 0.26),
//     wheelPrim([-0.42, -0.24], [0, 0.11], 0.26),
//     ...boxPrims(cabin),
//   ];
// }

function buildCar(): Prim[] {
  const body: Box = { u: [-0.47, 0.47], v: [-0.23, 0.23], w: [0.05, 0.17] };
  const cabin: Box = { u: [-0.27, 0.16], v: [-0.18, 0.18], w: [0.17, 0.3] };
  return [
    ...boxPrims(body),
    wheelPrim([0.22, 0.38], [0, 0.1], 0.23),
    wheelPrim([-0.38, -0.22], [0, 0.1], 0.23),
    ...boxPrims(cabin),
  ];
}

function buildTruck(): Prim[] {
  const chassis: Box = { u: [-0.92, 0.92], v: [-0.27, 0.27], w: [0.04, 0.15] };
  const cargo: Box = { u: [-0.9, 0.34], v: [-0.29, 0.29], w: [0.15, 0.5] };
  const cab: Box = { u: [0.37, 0.9], v: [-0.26, 0.26], w: [0.15, 0.4] };
  return [
    ...boxPrims(chassis),
    wheelPrim([0.54, 0.78], [0, 0.12], 0.29),
    wheelPrim([-0.58, -0.34], [0, 0.12], 0.29),
    wheelPrim([-0.88, -0.64], [0, 0.12], 0.29),
    ...boxPrims(cargo),
    ...boxPrims(cab),
  ];
}

const CAR_PRIMS = buildCar();
const TRUCK_PRIMS = buildTruck();

function VehicleShape({ kind }: { kind: "car" | "truck" }) {
  const prims = kind === "truck" ? TRUCK_PRIMS : CAR_PRIMS;
  return (
    <g strokeLinejoin="round">
      {prims.map((p, i) => (
        <path
          // biome-ignore lint/suspicious/noArrayIndexKey: static, ordered list
          key={i}
          d={p.d}
          fill={p.fill}
          stroke={p.stroked ? "var(--v-stroke)" : "none"}
          strokeWidth={p.stroked ? 0.9 : 0}
        />
      ))}
    </g>
  );
}

// Centreline of each corridor in screen space: derived from the matching
// BAND_* top/bottom edges, clipped to the svg viewBox. Extra runout at both
// ends keeps the loop reset off-screen so vehicles exit naturally instead of
// popping away at the bottom edge.
const VIEWBOX = { x: -31, y: -20, w: 617, h: 315 };
const PATH_PAD = 45;
const PATH_RUNOUT = 240; // travel past the padded viewBox before looping

type BandPath = {
  start: [number, number];
  dir: [number, number];
  dist: number;
};

function parseBandLine(d: string): [[number, number], [number, number]] {
  const m = d.match(/^M([-\d.]+)\s+([-\d.]+)L([-\d.]+)\s+([-\d.]+)/);
  if (!m) throw new Error(`Invalid band line: ${d}`);
  return [
    [Number(m[1]), Number(m[2])],
    [Number(m[3]), Number(m[4])],
  ];
}

function bandTrafficPath(
  top: string,
  bottom: string,
  view = VIEWBOX,
  pad = PATH_PAD,
  runout = PATH_RUNOUT,
): BandPath {
  const [t0, t1] = parseBandLine(top);
  const [b0, b1] = parseBandLine(bottom);
  const c0: [number, number] = [(t0[0] + b0[0]) / 2, (t0[1] + b0[1]) / 2];
  const c1: [number, number] = [(t1[0] + b1[0]) / 2, (t1[1] + b1[1]) / 2];
  const dx = c1[0] - c0[0];
  const dy = c1[1] - c0[1];
  const fullLen = Math.hypot(dx, dy);
  const dir: [number, number] = [dx / fullLen, dy / fullLen];

  const yMin = view.y - pad;
  const yMax = view.y + view.h + pad;
  const tStart = Math.max(0, Math.min(1, (yMin - c0[1]) / dy));
  const tEnd = Math.max(0, Math.min(1, (yMax - c0[1]) / dy));
  const lo = Math.max(0, Math.min(tStart, tEnd) - runout / fullLen);
  const hi = Math.min(1, Math.max(tStart, tEnd) + runout / fullLen);

  return {
    start: [c0[0] + lo * dx, c0[1] + lo * dy],
    dir,
    dist: (hi - lo) * fullLen,
  };
}

const TRAFFIC_BANDS: BandPath[] = [
  bandTrafficPath(BAND_0.top, BAND_0.bottom),
  bandTrafficPath(BAND_1.top, BAND_1.bottom),
];

type VehicleSpec = {
  kind: "car" | "truck";
  band: number;
  phase: number; // 0..1 starting offset along the corridor
  duration: number; // seconds for one full pass
};
const TRAFFIC: VehicleSpec[] = [
  { kind: "car", band: 0, phase: 0.0, duration: 5 },
  { kind: "car", band: 0, phase: 0.4, duration: 5 },
  { kind: "car", band: 1, phase: 0.15, duration: 7 },
  // { kind: "truck", band: 0, phase: 0.4, duration: 9 },
  // { kind: "truck", band: 1, phase: 0.15, duration: 8 },
  { kind: "car", band: 1, phase: 0.55, duration: 7 },
];

function vehicleTranslate(band: BandPath, phase: number) {
  const [sx, sy] = band.start;
  return {
    x: sx + phase * band.dist * band.dir[0],
    y: sy + phase * band.dist * band.dir[1],
  };
}

function Vehicle({
  spec,
  reduce,
  animateTraffic,
}: {
  spec: VehicleSpec;
  reduce: boolean | null;
  animateTraffic: boolean;
}) {
  const band = TRAFFIC_BANDS[spec.band];
  const [sx, sy] = band.start;
  const ex = sx + band.dist * band.dir[0];
  const ey = sy + band.dist * band.dir[1];

  if (reduce || !animateTraffic) {
    const { x, y } = vehicleTranslate(band, spec.phase);
    return (
      <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
        <VehicleShape kind={spec.kind} />
      </g>
    );
  }

  const loop = {
    duration: spec.duration,
    ease: "linear" as const,
    repeat: Number.POSITIVE_INFINITY,
  };
  // Negative delay starts the loop mid-cycle at `spec.phase`, matching the
  // static fallback position so the handoff from SSR/hydration is seamless.
  const elapsed = spec.phase * spec.duration;

  return (
    <motion.g
      initial={{ x: sx, y: sy }}
      animate={{ x: [sx, ex], y: [sy, ey] }}
      transition={{
        x: { ...loop, delay: -elapsed },
        y: { ...loop, delay: -elapsed },
      }}
    >
      <VehicleShape kind={spec.kind} />
    </motion.g>
  );
}

export function YTMarkIsometric() {
  const patternId = `yt-hatch${useId().replace(/:/g, "")}`;
  const bandId = `yt-band${useId().replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();
  const [animateTraffic, setAnimateTraffic] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);

  useEffect(() => {
    if (reduceMotion === false) {
      setAnimateTraffic(true);
    }
  }, [reduceMotion]);

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
      className="relative isolate h-auto w-full touch-manipulation overflow-visible [--band:color-mix(in_oklab,var(--foreground)_7%,transparent)] [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="-31 -20 617 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => {
        play();
        setShowTraffic((visible) => !visible);
      }}
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
          <rect width="10" height="10" fill={SURFACE_FILL} />
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        {/* Soft fade along the diagonal corridor — light in the middle,
            falling off to transparent at both ends. */}
        <linearGradient id={bandId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--band)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--band)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--band)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={BAND_FILL} fill={`url(#${bandId})`} />
      <path d={BAND_FILL_2} fill={`url(#${bandId})`} />

      <g className="stroke-line">
        {GUIDE_LINES.map((d) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--line)"
            strokeWidth={1}
            strokeDasharray={GUIDE_DASH}
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: reduceMotion ? 0 : -GUIDE_DASH_PERIOD,
            }}
            transition={reduceMotion ? undefined : guideLineTransition}
          />
        ))}
      </g>

      {/* Bottom south walls + their outlines — before traffic so cars pass in front */}
      {SIDE_FILLS_BEHIND_TRAFFIC.map((shape, i) => (
        <motion.path
          key={`side-behind-${i}`}
          d={shape.normal}
          fill={SURFACE_FILL}
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}
      {WALL_EDGES_BEHIND_TRAFFIC.map((shape, i) => (
        <motion.path
          key={`wall-edge-behind-${i}`}
          d={shape.normal}
          stroke="var(--stroke)"
          strokeWidth="1"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {showTraffic ? (
        <g className="[--v-front:color-mix(in_oklab,var(--foreground)_13%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_7%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_36%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_21%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_30%,var(--background))]">
          {TRAFFIC.map((spec, i) => (
            <Vehicle
              // biome-ignore lint/suspicious/noArrayIndexKey: static config list
              key={i}
              spec={spec}
              reduce={reduceMotion}
              animateTraffic={animateTraffic}
            />
          ))}
        </g>
      ) : null}

      {/* Recessed wall faces */}
      {SIDE_FILLS.map((shape, i) => (
        <motion.path
          key={`side-${i}`}
          d={shape.normal}
          fill={SURFACE_FILL}
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {/* Wall outlines sit under the hatched top faces */}
      {WALL_EDGES.map((shape, i) => (
        <motion.path
          key={`wall-edge-${i}`}
          d={shape.normal}
          stroke="var(--stroke)"
          strokeWidth="1"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {/* Hatched top faces */}
      {TOP_FILLS.map((shape, i) => (
        <motion.path
          key={`top-bg-${i}`}
          d={shape.normal}
          fill={SURFACE_FILL}
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}
      {TOP_FILLS.map((shape, i) => (
        <motion.path
          key={`top-pattern-${i}`}
          d={shape.normal}
          fill={`url(#${patternId})`}
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}

      {/* Top-plane silhouette outline */}
      {TOP_EDGES.map((shape, i) => (
        <motion.path
          key={`top-edge-${i}`}
          d={shape.normal}
          stroke="var(--stroke)"
          strokeWidth="1"
          variants={variantsFor(shape)}
          transition={transition}
        />
      ))}
    </motion.svg>
  );
}
