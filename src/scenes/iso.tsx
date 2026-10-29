import { createContext, useContext, type CSSProperties, type ReactNode, type SVGProps } from "react";

export type V3 = [number, number, number];
export type Tone = "steel" | "raw" | "graphite" | "accent" | "base";

/** Section tone of the scene being drawn; "accent" parts and glows take that section's colour. */
export const SceneAccent = createContext("fabricacion");

function useToneId(tone: Tone) {
  const section = useContext(SceneAccent);
  return tone === "accent" ? `tn-accent-${section}` : `tn-${tone}`;
}

export function useGlowFill() {
  return `url(#tn-glow-${useContext(SceneAccent)})`;
}

const COS30 = 0.8660254;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function iso([x, y, z]: V3): [number, number] {
  return [r1((x - y) * COS30), r1((x + y) * 0.5 - z)];
}

export function pts(...vs: V3[]) {
  return vs.map((v) => iso(v).join(",")).join(" ");
}

/** Translation in screen space equivalent to a 3D displacement. */
export function tr(dx: number, dy: number, dz: number) {
  const [x, y] = iso([dx, dy, dz]);
  return `translate(${x}px, ${y}px)`;
}

/** Isometric radii of a horizontal circle. */
export const ellipseR = (r: number) => ({ rx: r1(r * 1.2247), ry: r1(r * 0.7071) });

interface Placed {
  className?: string;
  style?: CSSProperties;
}

interface BoxProps extends Placed {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone?: Tone;
  children?: ReactNode;
}

/** Visible faces: top, x+w (right) and y+d (left). Draw back-to-front. */
export function Box({ x, y, z, w, d, h, tone = "steel", className, style, children }: BoxProps) {
  const id = useToneId(tone);
  const X = x + w;
  const Y = y + d;
  const Z = z + h;
  return (
    <g className={className} style={style}>
      <polygon points={pts([x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z])} fill={`url(#${id}-l)`} className="iso-face" />
      <polygon points={pts([X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z])} fill={`url(#${id}-r)`} className="iso-face" />
      <polygon points={pts([x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z])} fill={`url(#${id}-t)`} className="iso-face" />
      <polyline points={pts([x, Y, Z], [X, Y, Z], [X, y, Z])} className="iso-edge" />
      {children}
    </g>
  );
}

interface CylProps extends Placed {
  x: number;
  y: number;
  z: number;
  r: number;
  h: number;
  tone?: Tone;
  cap?: boolean;
}

/** Vertical cylinder standing on (x, y, z). */
export function Cyl({ x, y, z, r, h, tone = "steel", cap = true, className, style }: CylProps) {
  const id = useToneId(tone);
  const [cx, top] = iso([x, y, z + h]);
  const [, bottom] = iso([x, y, z]);
  const { rx, ry } = ellipseR(r);
  const side = `M${cx - rx} ${top} L${cx - rx} ${bottom} A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} L${cx + rx} ${top} Z`;
  return (
    <g className={className} style={style}>
      <path d={side} fill={`url(#${id}-c)`} />
      {cap && <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={`url(#${id}-t)`} className="iso-cap" />}
    </g>
  );
}

/** Flat ellipse lying on a horizontal plane (holes, rings, markers). */
export function Flat({ x, y, z, r, ...rest }: { x: number; y: number; z: number; r: number } & SVGProps<SVGEllipseElement>) {
  const [cx, cy] = iso([x, y, z]);
  const { rx, ry } = ellipseR(r);
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...rest} />;
}

/** Circle on a vertical plane, sampled as a polygon. */
export function circlePoints(center: V3, r: number, plane: "xz" | "yz", n = 36) {
  const out: V3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    out.push(plane === "xz" ? [center[0] + u, center[1], center[2] + v] : [center[0], center[1] + u, center[2] + v]);
  }
  return pts(...out);
}

export function Path3({ points, closed, ...rest }: { points: V3[]; closed?: boolean } & Omit<SVGProps<SVGPathElement>, "points">) {
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${iso(p).join(" ")}`).join(" ") + (closed ? " Z" : "");
  return <path d={d} {...rest} />;
}

/** Soft contact shadow under an object footprint. */
export function Shadow({ x, y, w, d, z = 0, spread = 1 }: { x: number; y: number; w: number; d: number; z?: number; spread?: number }) {
  const [cx, cy] = iso([x + w / 2, y + d / 2, z]);
  return <ellipse cx={cx} cy={cy + 4} rx={r1(((w + d) / 2) * 1.05 * spread)} ry={r1(((w + d) / 2) * 0.5 * spread)} fill="url(#tn-shadow)" />;
}

/** Hidden edges of a box as a dashed blueprint outline. */
export function WireBox({ x, y, z, w, d, h, className, style }: Omit<BoxProps, "tone" | "children">) {
  const X = x + w;
  const Y = y + d;
  const Z = z + h;
  return (
    <g className={`wire ${className ?? ""}`} style={style}>
      <polygon points={pts([x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z])} />
      <polyline points={pts([x, Y, Z], [x, Y, z], [X, Y, z], [X, y, z], [X, y, Z])} />
      <line {...line([X, Y, Z], [X, Y, z])} />
    </g>
  );
}

export function line(a: V3, b: V3) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return { x1, y1, x2, y2 };
}

/** Confirmation marker drawn in screen space, with an optional leader to a 3D point. */
export function Check({ at, from, className, style }: { at: V3; from?: V3 } & Placed) {
  const [x, y] = iso(at);
  return (
    <g className={`check ${className ?? ""}`} style={style}>
      {from && <line {...line(from, at)} className="check__leader" />}
      {from && <circle cx={iso(from)[0]} cy={iso(from)[1]} r={2.6} className="check__dot" />}
      <circle cx={x} cy={y} r={15} className="check__halo" />
      <circle cx={x} cy={y} r={10} className="check__disc" />
      <path d={`M${x - 4.2} ${y + 0.3} l2.9 2.9 l5.6 -6`} className="check__mark" />
    </g>
  );
}

/** Work-table pedestal shared by every scene. */
export function Pedestal({ size = 130, lines = true }: { size?: number; lines?: boolean }) {
  const s = size;
  const grid = [-s * 0.66, -s * 0.22, s * 0.22, s * 0.66];
  return (
    <g>
      <ellipse cx={0} cy={iso([0, 0, 0])[1] + 18} rx={s * 2.05} ry={s * 1.02} fill="url(#tn-shadow)" />
      <Box x={-s} y={-s} z={0} w={s * 2} d={s * 2} h={16} tone="base" />
      {lines && (
        <g className="pedestal-grid">
          {grid.map((g) => (
            <g key={g}>
              <line {...line([g, -s, 16], [g, s, 16])} />
              <line {...line([-s, g, 16], [s, g, 16])} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

export function show(visible: boolean, transform = "none", extra?: CSSProperties): CSSProperties {
  return { opacity: visible ? 1 : 0, transform: visible ? "none" : transform, ...extra };
}
