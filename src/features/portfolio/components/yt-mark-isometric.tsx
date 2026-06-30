"use client";

import type { Transition } from "motion/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { useSound } from "@/hooks/soundcn/use-sound";
import { metalClickSound } from "@/lib/soundcn/metal-click";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const GRID = [
  [true, true, true, true, false, true],
  [false, true, false, true, false, true],
  [false, true, false, false, true, false],
  [false, true, false, false, true, false],
];

const COLS = 6;
const ROWS = 4;

// True isometric (30°) projection constants.
const COS = -55.4256;
const SIN = 32;
const ZUNIT = 64;
const OX = 360;
const OY = 10;

const TOP_NORMAL = 0.5;
const TOP_PRESSED = 0.25;

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
        addEdge(
          [c + 1, r + 1, 1],
          [c + 1, r + 1, 0],
          "wall",
          southBehindTraffic,
        );
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
  ease: "linear",
};

const BAND_0 = {
  top: "M-700 -542L1300 619",
  bottom: "M-700 -474L1300 680.5",
} as const;
const BAND_FILL = `${BAND_0.top}L1300 680.5L-700 -474Z`;
const BAND_1 = {
  top: "M-700 -348L1300 811",
  bottom: "M-700 -282L1300 873",
} as const;
const BAND_FILL_2 = `${BAND_1.top}L1300 873L-700 -282Z`;

const BAND_FILL_OPACITY = 0.08;
const BAND_FILL_FEATHER = 0.22;

const FWD = { x: -COS, y: SIN };
const VSIDE = { x: COS, y: SIN };
const VUP = { x: 0, y: -ZUNIT };

const vproj = (u: number, v: number, w: number): [number, number] => [
  u * FWD.x + v * VSIDE.x + w * VUP.x,
  u * FWD.y + v * VSIDE.y + w * VUP.y,
];

const poly = (corners: Array<[number, number]>) =>
  `M${corners.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

type Box = { u: [number, number]; v: [number, number]; w: [number, number] };

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

const boxPrims = (
  b: Box,
  fills?: { side?: string; front?: string; top?: string },
): Prim[] => {
  const f = boxFaces(b);
  return [
    { d: f.side, fill: fills?.side || "var(--v-side)", stroked: true },
    { d: f.front, fill: fills?.front || "var(--v-front)", stroked: true },
    { d: f.top, fill: fills?.top || "var(--v-top)", stroked: true },
  ];
};

const frontPoly = (
  u: number,
  v: [number, number],
  w: [number, number],
  fill: string,
): Prim => ({
  d: poly([
    vproj(u, v[0], w[0]),
    vproj(u, v[1], w[0]),
    vproj(u, v[1], w[1]),
    vproj(u, v[0], w[1]),
  ]),
  fill,
  stroked: false,
});

const sidePoly = (
  v: number,
  u: [number, number],
  w: [number, number],
  fill: string,
): Prim => ({
  d: poly([
    vproj(u[0], v, w[0]),
    vproj(u[1], v, w[0]),
    vproj(u[1], v, w[1]),
    vproj(u[0], v, w[1]),
  ]),
  fill,
  stroked: false,
});

const topPoly = (
  w: number,
  u: [number, number],
  v: [number, number],
  fill: string,
): Prim => ({
  d: poly([
    vproj(u[0], v[0], w),
    vproj(u[1], v[0], w),
    vproj(u[1], v[1], w),
    vproj(u[0], v[1], w),
  ]),
  fill,
  stroked: false,
});

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

function buildSimpleCar(): Prim[] {
  const vOffset = 0.05;
  const off = (arr: [number, number]): [number, number] => [
    arr[0] + vOffset,
    arr[1] + vOffset,
  ];
  const body: Box = {
    u: [-0.47, 0.47],
    v: off([-0.23, 0.23]),
    w: [0.05, 0.17],
  };
  const cabin: Box = {
    u: [-0.27, 0.16],
    v: off([-0.18, 0.18]),
    w: [0.17, 0.3],
  };
  return [
    ...boxPrims(body),
    wheelPrim([0.22, 0.38], [0, 0.1], 0.23 + vOffset),
    wheelPrim([-0.38, -0.22], [0, 0.1], 0.23 + vOffset),
    ...boxPrims(cabin),
  ];
}

const wheelPrims = (
  u: [number, number],
  v: [number, number],
  w: [number, number],
): Prim[] => {
  return boxPrims(
    { u, v, w },
    {
      side: "var(--v-wheel-side)",
      front: "var(--v-wheel-front)",
      top: "var(--v-wheel-top)",
    },
  );
};

function buildDetailedCar(): Prim[] {
  const vOffset = 0.05;
  const off = (arr: [number, number]): [number, number] => [
    arr[0] + vOffset,
    arr[1] + vOffset,
  ];

  const bodyBase: Box = {
    u: [-0.48, 0.48],
    v: off([-0.24, 0.24]),
    w: [0.06, 0.18],
  };
  const cabin: Box = { u: [-0.22, 0.12], v: off([-0.2, 0.2]), w: [0.18, 0.32] };
  const frontBumper: Box = {
    u: [0.48, 0.52],
    v: off([-0.22, 0.22]),
    w: [0.05, 0.12],
  };
  const rearBumper: Box = {
    u: [-0.52, -0.48],
    v: off([-0.22, 0.22]),
    w: [0.05, 0.12],
  };

  const spoilerL: Box = {
    u: [-0.44, -0.4],
    v: off([-0.18, -0.14]),
    w: [0.18, 0.24],
  };
  const spoilerR: Box = {
    u: [-0.44, -0.4],
    v: off([0.14, 0.18]),
    w: [0.18, 0.24],
  };
  const spoilerWing: Box = {
    u: [-0.46, -0.38],
    v: off([-0.22, 0.22]),
    w: [0.24, 0.26],
  };

  const wheelRL = wheelPrims([-0.32, -0.2], off([-0.26, -0.2]), [0, 0.11]);
  const wheelFL = wheelPrims([0.2, 0.32], off([-0.26, -0.2]), [0, 0.11]);
  const wheelRR = wheelPrims([-0.32, -0.2], off([0.2, 0.26]), [0, 0.11]);
  const wheelFR = wheelPrims([0.2, 0.32], off([0.2, 0.26]), [0, 0.11]);

  return [
    ...wheelRL,
    ...wheelFL,

    ...boxPrims(rearBumper, {
      side: "var(--v-bumper)",
      front: "var(--v-bumper)",
      top: "var(--v-bumper)",
    }),

    ...boxPrims(bodyBase),
    sidePoly(0.24 + vOffset, [-0.48, 0.48], [0.12, 0.14], "var(--v-bumper)"),

    frontPoly(0.48, off([0.12, 0.22]), [0.13, 0.17], "var(--v-light-front)"),
    frontPoly(0.48, off([-0.22, -0.12]), [0.13, 0.17], "var(--v-light-front)"),

    ...boxPrims(spoilerL, {
      side: "var(--v-bumper)",
      front: "var(--v-bumper)",
      top: "var(--v-bumper)",
    }),
    ...boxPrims(spoilerR, {
      side: "var(--v-bumper)",
      front: "var(--v-bumper)",
      top: "var(--v-bumper)",
    }),
    ...boxPrims(spoilerWing),

    ...boxPrims(frontBumper, {
      side: "var(--v-bumper)",
      front: "var(--v-bumper)",
      top: "var(--v-bumper)",
    }),

    frontPoly(0.52, off([-0.12, 0.12]), [0.06, 0.11], "var(--v-window)"),
    frontPoly(0.52, off([-0.06, 0.06]), [0.07, 0.1], "var(--v-wheel-side)"),

    ...boxPrims(cabin),

    frontPoly(0.12, off([-0.17, 0.17]), [0.21, 0.3], "var(--v-window)"),
    sidePoly(0.2 + vOffset, [-0.18, 0.08], [0.21, 0.3], "var(--v-window)"),
    topPoly(0.32, [-0.15, 0.05], off([-0.14, 0.14]), "var(--v-window)"),

    ...wheelRR,
    ...wheelFR,
  ];
}

const DETAILED_CAR_PRIMS = buildDetailedCar();
const SIMPLE_CAR_PRIMS = buildSimpleCar();

function VehicleShape({
  kind: _kind,
  model,
}: {
  kind: "car";
  model: "detailed" | "simple";
}) {
  const prims = model === "detailed" ? DETAILED_CAR_PRIMS : SIMPLE_CAR_PRIMS;
  return (
    <g strokeLinejoin="round">
      {prims.map((p, i) => (
        <path
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

function CarPreview({
  model,
  selected,
}: {
  model: "detailed" | "simple";
  selected: boolean;
}) {
  const activeVars = selected
    ? "[--v-front:color-mix(in_oklab,var(--foreground)_16%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_10%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_45%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_26%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_40%,var(--background))] [--v-wheel-side:color-mix(in_oklab,var(--foreground)_50%,var(--background))] [--v-wheel-front:color-mix(in_oklab,var(--foreground)_55%,var(--background))] [--v-wheel-top:color-mix(in_oklab,var(--foreground)_60%,var(--background))] [--v-window:color-mix(in_oklab,var(--foreground)_70%,var(--background))] [--v-bumper:color-mix(in_oklab,var(--foreground)_32%,var(--background))] [--v-light-front:color-mix(in_oklab,var(--foreground)_95%,var(--background))] dark:[--v-front:color-mix(in_oklab,var(--foreground)_32%,var(--background))] dark:[--v-side:color-mix(in_oklab,var(--foreground)_24%,var(--background))] dark:[--v-top:color-mix(in_oklab,var(--foreground)_42%,var(--background))] dark:[--v-stroke:color-mix(in_oklab,var(--foreground)_50%,var(--background))] dark:[--v-wheel:color-mix(in_oklab,var(--foreground)_18%,var(--background))] dark:[--v-wheel-side:color-mix(in_oklab,var(--foreground)_14%,var(--background))] dark:[--v-wheel-front:color-mix(in_oklab,var(--foreground)_12%,var(--background))] dark:[--v-wheel-top:color-mix(in_oklab,var(--foreground)_16%,var(--background))] dark:[--v-window:color-mix(in_oklab,var(--foreground)_60%,var(--background))] dark:[--v-bumper:color-mix(in_oklab,var(--foreground)_28%,var(--background))] dark:[--v-light-front:color-mix(in_oklab,var(--foreground)_98%,var(--background))]"
    : "[--v-front:color-mix(in_oklab,var(--foreground)_10%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_5%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_28%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_16%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_22%,var(--background))] [--v-wheel-side:color-mix(in_oklab,var(--foreground)_30%,var(--background))] [--v-wheel-front:color-mix(in_oklab,var(--foreground)_35%,var(--background))] [--v-wheel-top:color-mix(in_oklab,var(--foreground)_40%,var(--background))] [--v-window:color-mix(in_oklab,var(--foreground)_48%,var(--background))] [--v-bumper:color-mix(in_oklab,var(--foreground)_18%,var(--background))] [--v-light-front:color-mix(in_oklab,var(--foreground)_75%,var(--background))] dark:[--v-front:color-mix(in_oklab,var(--foreground)_20%,var(--background))] dark:[--v-side:color-mix(in_oklab,var(--foreground)_15%,var(--background))] dark:[--v-top:color-mix(in_oklab,var(--foreground)_26%,var(--background))] dark:[--v-stroke:color-mix(in_oklab,var(--foreground)_32%,var(--background))] dark:[--v-wheel:color-mix(in_oklab,var(--foreground)_12%,var(--background))] dark:[--v-wheel-side:color-mix(in_oklab,var(--foreground)_10%,var(--background))] dark:[--v-wheel-front:color-mix(in_oklab,var(--foreground)_8%,var(--background))] dark:[--v-wheel-top:color-mix(in_oklab,var(--foreground)_11%,var(--background))] dark:[--v-window:color-mix(in_oklab,var(--foreground)_40%,var(--background))] dark:[--v-bumper:color-mix(in_oklab,var(--foreground)_18%,var(--background))] dark:[--v-light-front:color-mix(in_oklab,var(--foreground)_80%,var(--background))]";

  return (
    <svg
      viewBox="-50 -50 100 100"
      className={`size-20 overflow-visible transition-all duration-300 ${activeVars}`}
    >
      <g transform="translate(3, 9) scale(1.2)">
        <VehicleShape kind="car" model={model} />
      </g>
    </svg>
  );
}

const VIEWBOX = { x: -31, y: -20, w: 617, h: 315 };
const PATH_PAD = 45;
const PATH_RUNOUT = 240;

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

function bandGradientAxis(top: string, bottom: string) {
  const [t0, t1] = parseBandLine(top);
  const [b0, b1] = parseBandLine(bottom);
  return {
    x1: (t0[0] + b0[0]) / 2,
    y1: (t0[1] + b0[1]) / 2,
    x2: (t1[0] + b1[0]) / 2,
    y2: (t1[1] + b1[1]) / 2,
  };
}

const BAND_GRAD_0 = bandGradientAxis(BAND_0.top, BAND_0.bottom);
const BAND_GRAD_1 = bandGradientAxis(BAND_1.top, BAND_1.bottom);

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
  kind: "car";
  band: number;
  phase: number;
  duration: number;
};
const TRAFFIC: VehicleSpec[] = [
  { kind: "car", band: 0, phase: 0.0, duration: 5 },
  { kind: "car", band: 0, phase: 0.4, duration: 5 },
  { kind: "car", band: 1, phase: 0.15, duration: 4.5 },
  { kind: "car", band: 1, phase: 0.63, duration: 4.5 },
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
  model,
}: {
  spec: VehicleSpec;
  reduce: boolean | null;
  animateTraffic: boolean;
  model: "detailed" | "simple";
}) {
  const band = TRAFFIC_BANDS[spec.band];
  const [sx, sy] = band.start;
  const ex = sx + band.dist * band.dir[0];
  const ey = sy + band.dist * band.dir[1];

  if (reduce || !animateTraffic) {
    const { x, y } = vehicleTranslate(band, spec.phase);
    return (
      <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
        <VehicleShape kind={spec.kind} model={model} />
      </g>
    );
  }

  const loop = {
    duration: spec.duration,
    ease: "linear" as const,
    repeat: Number.POSITIVE_INFINITY,
  };

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
      <VehicleShape kind={spec.kind} model={model} />
    </motion.g>
  );
}

const bandRevealTransition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

export function YTMarkIsometric() {
  const patternId = `yt-hatch${useId().replace(/:/g, "")}`;
  const bandId0 = `yt-band-0${useId().replace(/:/g, "")}`;
  const bandId1 = `yt-band-1${useId().replace(/:/g, "")}`;
  const bandClipId = `yt-band-clip${useId().replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();
  const [animateTraffic, setAnimateTraffic] = useState(false);
  const [active, setActive] = useState(false);
  const [carModel, setCarModel] = useState<"detailed" | "simple">("detailed");

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

  const bandTransition = reduceMotion ? { duration: 0 } : bandRevealTransition;

  const bandFillSweepDuration = 4;
  const bandFillSweepEase = [0.22, 1, 0.36, 1] as const;

  const bandFillSweepTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: bandFillSweepDuration, ease: bandFillSweepEase };

  const bandFillProgress = active ? [0, 1] : [1, 0];
  const bandFillTailProgress = active
    ? [BAND_FILL_FEATHER, 1 + BAND_FILL_FEATHER]
    : [1 + BAND_FILL_FEATHER, BAND_FILL_FEATHER];

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.svg
          className="relative isolate h-auto w-full touch-manipulation overflow-visible cursor-pointer transition-all duration-300 [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
          viewBox="-31 -20 617 315"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          initial="normal"
          whileTap="pressed"
          onTap={() => {
            play();
            setActive((on) => !on);
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

            <motion.linearGradient
              id={bandId0}
              gradientUnits="userSpaceOnUse"
              x1={BAND_GRAD_0.x1}
              y1={BAND_GRAD_0.y1}
              x2={BAND_GRAD_0.x2}
              y2={BAND_GRAD_0.y2}
            >
              <motion.stop
                offset={0}
                stopColor="var(--foreground)"
                stopOpacity={0}
                animate={{
                  stopOpacity: active
                    ? [0, BAND_FILL_OPACITY]
                    : [BAND_FILL_OPACITY, 0],
                  offset: bandFillProgress,
                }}
                transition={{
                  stopOpacity: bandFillSweepTransition,
                  offset: bandFillSweepTransition,
                }}
              />
              <motion.stop
                offset={BAND_FILL_FEATHER}
                stopColor="var(--foreground)"
                stopOpacity={0}
                animate={{ offset: bandFillTailProgress }}
                transition={bandFillSweepTransition}
              />
              <stop
                offset="100%"
                stopColor="var(--foreground)"
                stopOpacity={0}
              />
            </motion.linearGradient>
            <motion.linearGradient
              id={bandId1}
              gradientUnits="userSpaceOnUse"
              x1={BAND_GRAD_1.x1}
              y1={BAND_GRAD_1.y1}
              x2={BAND_GRAD_1.x2}
              y2={BAND_GRAD_1.y2}
            >
              <motion.stop
                offset={0}
                stopColor="var(--foreground)"
                stopOpacity={0}
                animate={{
                  stopOpacity: active
                    ? [0, BAND_FILL_OPACITY]
                    : [BAND_FILL_OPACITY, 0],
                  offset: bandFillProgress,
                }}
                transition={{
                  stopOpacity: bandFillSweepTransition,
                  offset: bandFillSweepTransition,
                }}
              />
              <motion.stop
                offset={BAND_FILL_FEATHER}
                stopColor="var(--foreground)"
                stopOpacity={0}
                animate={{ offset: bandFillTailProgress }}
                transition={bandFillSweepTransition}
              />
              <stop
                offset="100%"
                stopColor="var(--foreground)"
                stopOpacity={0}
              />
            </motion.linearGradient>

            <clipPath id={bandClipId}>
              <path d={BAND_FILL} />
              <path d={BAND_FILL_2} />
            </clipPath>
          </defs>

          <AnimatePresence>
            <motion.g
              key="corridors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={bandTransition}
            >
              <motion.path
                d={BAND_FILL}
                fill={`url(#${bandId0})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={bandTransition}
              />
              <motion.path
                d={BAND_FILL_2}
                fill={`url(#${bandId1})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={bandTransition}
              />
              <g className="stroke-line">
                {GUIDE_LINES.map((d) => (
                  <motion.path
                    key={d}
                    d={d}
                    stroke="var(--line)"
                    strokeWidth={1}
                    strokeDasharray={GUIDE_DASH}
                    initial={{ strokeDashoffset: 0, opacity: 0 }}
                    animate={{
                      strokeDashoffset: reduceMotion ? 0 : -GUIDE_DASH_PERIOD,
                      opacity: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: bandTransition,
                      strokeDashoffset: reduceMotion
                        ? undefined
                        : guideLineTransition,
                    }}
                  />
                ))}
              </g>
            </motion.g>
          </AnimatePresence>

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

          {active ? (
            <AnimatePresence>
              <motion.g
                key="traffic"
                className="[--v-front:color-mix(in_oklab,var(--foreground)_13%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_7%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_36%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_21%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_30%,var(--background))] [--v-wheel-side:color-mix(in_oklab,var(--foreground)_40%,var(--background))] [--v-wheel-front:color-mix(in_oklab,var(--foreground)_45%,var(--background))] [--v-wheel-top:color-mix(in_oklab,var(--foreground)_50%,var(--background))] [--v-window:color-mix(in_oklab,var(--foreground)_60%,var(--background))] [--v-bumper:color-mix(in_oklab,var(--foreground)_25%,var(--background))] [--v-light-front:color-mix(in_oklab,var(--foreground)_85%,var(--background))]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={bandTransition}
              >
                {TRAFFIC.map((spec, i) => (
                  <Vehicle
                    key={i}
                    spec={spec}
                    reduce={reduceMotion}
                    animateTraffic={animateTraffic}
                    model={carModel}
                  />
                ))}
              </motion.g>
            </AnimatePresence>
          ) : null}

          {SIDE_FILLS.map((shape, i) => (
            <motion.path
              key={`side-${i}`}
              d={shape.normal}
              fill={SURFACE_FILL}
              variants={variantsFor(shape)}
              transition={transition}
            />
          ))}

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
      </ContextMenuTrigger>
      <ContextMenuContent className="p-1.5 flex gap-1.5 rounded-xl border-dashed border-2 border-neutral-400 bg-neutral-200/90 backdrop-blur-md shadow-xl ring-1 shadow-black/5 ring-black/5 dark:border-neutral-700 dark:bg-zinc-900">
        <ContextMenuItem asChild onSelect={() => setCarModel("simple")}>
          <div
            className={`p-1.5 rounded-xl border-2 transition-all duration-200 cursor-default select-none shadow-[0px_-1px_0px_0px_var(--color-line)_inset] dark:shadow-[0px_-1px_0px_0px_var(--color-line)_inset]
           ${
             carModel === "simple"
               ? "bg-background border-neutral-400 dark:border-neutral-700 shadow-md pointer-events-none dark:bg-background"
               : "bg-background/40 border-neutral-400/60 hover:bg-background/80 hover:border-neutral-400 opacity-70 hover:opacity-90 dark:border-neutral-700/60 dark:hover:border-neutral-700"
           }
           `}
          >
            <CarPreview model="simple" selected={carModel === "simple"} />
          </div>
        </ContextMenuItem>
        <ContextMenuItem asChild onSelect={() => setCarModel("detailed")}>
          <div
            className={`p-1.5 rounded-xl border-2 transition-all duration-200 cursor-default select-none shadow-[0px_-1px_0px_0px_var(--color-line)_inset] dark:shadow-[0px_-1px_0px_0px_var(--color-line)_inset]
           ${
             carModel === "detailed"
               ? "bg-background border-neutral-400 dark:border-neutral-700 shadow-md pointer-events-none dark:bg-background"
               : "bg-background/40 border-neutral-400/60 hover:bg-background/80 hover:border-neutral-400 opacity-70 hover:opacity-90 dark:border-neutral-700/60 dark:hover:border-neutral-700"
           }
           `}
          >
            <CarPreview model="detailed" selected={carModel === "detailed"} />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
