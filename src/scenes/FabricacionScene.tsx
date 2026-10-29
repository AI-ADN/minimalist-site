import type { CSSProperties } from "react";
import { Box, Check, Cyl, Flat, Path3, Pedestal, Shadow, iso, line, show, tr, type V3 } from "./iso";
import type { SceneProps } from "./types";

const Z = 16;
const T = Z + 22;

const contour: V3[] = [
  [-90, -60, T],
  [50, -60, T],
  [50, -20, T],
  [90, -20, T],
  [90, 60, T],
  [-50, 60, T],
  [-50, 20, T],
  [-90, 20, T],
];

const holes = [
  { x: -65, y: -40, r: 6 },
  { x: 25, y: -40, r: 6 },
  { x: -20, y: 0, r: 12 },
  { x: -25, y: 40, r: 6 },
  { x: 65, y: 40, r: 6 },
];

const sweep = (units: number) => {
  const [dx, dy] = iso([units, 0, 0]);
  return { "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties;
};

export function FabricacionScene({ step }: SceneProps) {
  const offcutA = step === 0 ? "none" : step === 1 ? tr(7, -7, 0) : tr(46, -46, 0);
  const offcutB = step === 0 ? "none" : step === 1 ? tr(-7, 7, 0) : tr(-46, 46, 0);

  const [toolX, toolY] = iso([-20, 0, 0]);
  const [armBase, shoulder, elbow, wrist, tip] = [
    [110, 98, 32],
    [110, 98, 104],
    [72, 92, 128],
    [65, 40, 96],
    [65, 40, 44],
  ].map((p) => iso(p as V3));

  return (
    <g transform="translate(260 334)">
      <Pedestal />

      {/* Waterjet gantry, back post */}
      <g className="t" style={show(step === 1, tr(0, 0, 40))}>
        <Box x={-132} y={-46} z={Z} w={12} d={12} h={144} tone="graphite" />
      </g>

      <Shadow x={-90} y={-60} w={180} d={120} z={Z} spread={0.9} />

      <Box x={-90} y={-60} z={Z} w={140} d={40} h={22} tone="raw" />
      <g className="t" style={{ transform: offcutA, opacity: step >= 2 ? 0 : 1 }}>
        <Box x={50} y={-60} z={Z} w={40} d={40} h={22} tone="raw" />
      </g>
      <Box x={-90} y={-20} z={Z} w={180} d={40} h={22} tone="raw" />
      <g className="t" style={{ transform: offcutB, opacity: step >= 2 ? 0 : 1 }}>
        <Box x={-90} y={20} z={Z} w={40} d={40} h={22} tone="raw" />
      </g>
      <Box x={-50} y={20} z={Z} w={140} d={40} h={22} tone="raw" />

      {holes.map((h, i) => (
        <g key={i} className="t pop" style={{ transform: step >= 2 ? "scale(1)" : "scale(0)", opacity: step >= 2 ? 1 : 0, transitionDelay: `${i * 70 + 120}ms` }}>
          <Flat x={h.x} y={h.y} z={T} r={h.r} fill="url(#tn-hole)" />
          <Flat x={h.x} y={h.y} z={T} r={h.r} className="hole-rim" />
        </g>
      ))}

      {/* Definición: target contour and drawing dimensions */}
      <g className="t" style={{ opacity: step === 0 ? 1 : 0 }}>
        <Path3 points={contour} closed className="guide loop-march" />
        <g className="dim">
          <line {...line([-90, -60, T], [-90, -84, T])} />
          <line {...line([90, -60, T], [90, -84, T])} />
          <line {...line([-90, -78, T], [90, -78, T])} className="dim__main" />
          <line {...line([-90, -60, T], [-114, -60, T])} />
          <line {...line([-90, 60, T], [-114, 60, T])} />
          <line {...line([-108, -60, T], [-108, 60, T])} className="dim__main" />
        </g>
        {contour.map((p, i) => (
          <circle key={i} cx={iso(p)[0]} cy={iso(p)[1]} r={2.4} className="guide-node" />
        ))}
      </g>

      {/* Corte: kerf being traced */}
      <g className="t" style={{ opacity: step === 1 ? 1 : 0 }}>
        <Path3 points={contour} closed pathLength={1} className="kerf loop-draw" />
      </g>

      {/* Waterjet beam, head and jet */}
      <g className="t" style={show(step === 1, tr(0, 0, 40))}>
        <Box x={-132} y={-46} z={160} w={264} d={12} h={12} tone="graphite" />
        <g className="loop-sweep" style={sweep(16)}>
          <Box x={58} y={-34} z={104} w={24} d={26} h={56} tone="graphite" />
          <Cyl x={70} y={-21} z={64} r={5} h={40} tone="steel" />
          <line {...line([70, -21, 64], [70, -21, T])} className="jet loop-flicker" />
          <Flat x={70} y={-21} z={T} r={9} fill="url(#tn-glow)" className="loop-pulse" />
        </g>
        <Box x={120} y={-46} z={Z} w={12} d={12} h={144} tone="graphite" />
      </g>

      {/* Mecanizado: spindle over the main bore */}
      <g className="t" style={show(step === 2, tr(0, 0, 60))}>
        <g className="loop-bob">
          <Box x={-40} y={-20} z={130} w={40} d={40} h={52} tone="graphite" />
          <Cyl x={-20} y={0} z={120} r={13} h={10} tone="steel" />
          <Cyl x={-20} y={0} z={42} r={6} h={78} tone="steel" />
          <g className="flutes">
            {[54, 68, 82, 96, 110].map((z) => (
              <line key={z} x1={toolX - 5} y1={toolY - z + 3} x2={toolX + 5} y2={toolY - z - 4} />
            ))}
          </g>
        </g>
        <g className="chips loop-chips">
          {[
            [-8, -6],
            [10, -12],
            [-14, -14],
            [16, -2],
          ].map(([dx, dy], i) => (
            <rect key={i} x={toolX + dx} y={toolY - T + dy} width={4} height={2} rx={0.8} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </g>
      </g>

      {/* Inspección: articulated measuring arm */}
      <g className="t" style={show(step === 3, tr(20, 20, 0))}>
        <Cyl x={110} y={98} z={Z} r={13} h={16} tone="graphite" />
        <g className="arm">
          <polyline points={[armBase, shoulder, elbow, wrist].map((p) => p.join(",")).join(" ")} className="arm__body" />
          <polyline points={[armBase, shoulder, elbow, wrist].map((p) => p.join(",")).join(" ")} className="arm__hl" />
          <line x1={wrist[0]} y1={wrist[1]} x2={tip[0]} y2={tip[1]} className="arm__probe" />
          {[shoulder, elbow, wrist].map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={7} className="arm__joint" />
          ))}
          <circle cx={tip[0]} cy={tip[1]} r={4} className="probe-tip loop-pulse" />
        </g>
      </g>
      <Check at={[-20, 0, 104]} from={[-20, 0, T]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "260ms" }} />
      <Check at={[90, -20, 96]} from={[90, -20, T]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "380ms" }} />
      <Check at={[-65, -40, 92]} from={[-65, -40, T]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "500ms" }} />
    </g>
  );
}
