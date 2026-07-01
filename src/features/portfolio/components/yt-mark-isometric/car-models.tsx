import { COS, SIN, ZUNIT } from "./constants";

export const FWD = { x: -COS, y: SIN };
export const VSIDE = { x: COS, y: SIN };
export const VUP = { x: 0, y: -ZUNIT };

export const vproj = (u: number, v: number, w: number): [number, number] => [
  u * FWD.x + v * VSIDE.x + w * VUP.x,
  u * FWD.y + v * VSIDE.y + w * VUP.y,
];

export const poly = (corners: Array<[number, number]>) =>
  `M${corners.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

export type Box = {
  u: [number, number];
  v: [number, number];
  w: [number, number];
};

export function boxFaces({ u: [u0, u1], v: [v0, v1], w: [w0, w1] }: Box) {
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

export type Prim = { d: string; fill: string; stroked: boolean };

export const boxPrims = (
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

export const frontPoly = (
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

export const sidePoly = (
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

export const topPoly = (
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

export const wheelPrim = (
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

export function buildSimpleCar(): Prim[] {
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

export const wheelPrims = (
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

export function buildDetailedCar(): Prim[] {
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

export const DETAILED_CAR_PRIMS = buildDetailedCar();
export const SIMPLE_CAR_PRIMS = buildSimpleCar();

export function VehicleShape({
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

export function CarPreview({
  model,
  selected,
}: {
  model: "detailed" | "simple";
  selected: boolean;
}) {
  const activeVars = selected
    ? "[--v-front:color-mix(in_oklab,var(--foreground)_16%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_10%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_45%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_26%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_40%,var(--background))] [--v-wheel-side:color-mix(in_oklab,var(--foreground)_50%,var(--background))] [--v-wheel-front:color-mix(in_oklab,var(--foreground)_55%,var(--background))] [--v-wheel-top:color-mix(in_oklab,var(--foreground)_60%,var(--background))] [--v-window:color-mix(in_oklab,var(--foreground)_70%,var(--background))] [--v-bumper:color-mix(in_oklab,var(--foreground)_32%,var(--background))] [--v-light-front:color-mix(in_oklab,var(--foreground)_95%,var(--background))]"
    : "[--v-front:color-mix(in_oklab,var(--foreground)_10%,var(--background))] [--v-side:color-mix(in_oklab,var(--foreground)_5%,var(--background))] [--v-stroke:color-mix(in_oklab,var(--foreground)_28%,var(--background))] [--v-top:color-mix(in_oklab,var(--foreground)_16%,var(--background))] [--v-wheel:color-mix(in_oklab,var(--foreground)_22%,var(--background))] [--v-wheel-side:color-mix(in_oklab,var(--foreground)_30%,var(--background))] [--v-wheel-front:color-mix(in_oklab,var(--foreground)_35%,var(--background))] [--v-wheel-top:color-mix(in_oklab,var(--foreground)_40%,var(--background))] [--v-window:color-mix(in_oklab,var(--foreground)_48%,var(--background))] [--v-bumper:color-mix(in_oklab,var(--foreground)_18%,var(--background))] [--v-light-front:color-mix(in_oklab,var(--foreground)_75%,var(--background))] ";

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
