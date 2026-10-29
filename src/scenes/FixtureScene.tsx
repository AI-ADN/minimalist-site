import { Box, Check, Cyl, Flat, Pedestal, Shadow, pts, show, tr } from "./iso";
import type { SceneProps } from "./types";

const BASE = 34;

const pins = [
  { id: "l1", x: -72, y: -46, float: tr(-20, -20, 96) },
  { id: "l2", x: 24, y: -46, float: tr(10, -30, 108) },
  { id: "l3", x: -72, y: 34, float: tr(-34, 16, 90) },
];

export function FixtureScene({ step }: SceneProps) {
  const placed = step >= 2;
  const clamped = step === 3;
  const component = (float: string, delay: number) => ({
    opacity: step >= 1 ? 1 : 0,
    transform: placed ? "none" : float,
    transitionDelay: `${delay}ms`,
  });

  return (
    <g transform="translate(260 338)">
      <Pedestal />
      <Shadow x={-110} y={-75} w={220} d={150} z={16} spread={0.85} />
      <Box x={-110} y={-75} z={16} w={220} d={150} h={18} tone="steel" />
      <g className="tapped">
        {[-90, -60, -30, 0, 30, 60, 90].flatMap((x) =>
          [-56, -28, 0, 28, 56].map((y) => <Flat key={`${x}${y}`} x={x} y={y} z={BASE} r={2.4} />),
        )}
      </g>

      {/* Definición: planned positions */}
      <g className="t" style={{ opacity: step <= 1 ? 1 : 0 }}>
        <polygon points={pts([-62, -38, BASE], [50, -38, BASE], [50, 24, BASE], [-62, 24, BASE])} className="guide loop-march" />
        {pins.map((p) => (
          <Flat key={p.id} x={p.x} y={p.y} z={BASE} r={9} className="guide" />
        ))}
        <polygon points={pts([58, -10, BASE], [84, -10, BASE], [84, 20, BASE], [58, 20, BASE])} className="guide" />
        <polygon points={pts([-24, 30, BASE], [6, 30, BASE], [6, 56, BASE], [-24, 56, BASE])} className="guide" />
      </g>

      {pins.map((p, i) => (
        <g key={p.id} className="t" style={component(p.float, i * 90)}>
          <g className={step === 1 ? "loop-bob" : undefined} style={{ animationDelay: `${i * 0.3}s` }}>
            <Cyl x={p.x} y={p.y} z={BASE} r={8} h={6} tone="graphite" />
            <Cyl x={p.x} y={p.y} z={BASE + 6} r={5.5} h={18} tone="accent" />
          </g>
        </g>
      ))}

      {/* Verificación: reference part lowered into the fixture */}
      <g className="t" style={show(clamped, tr(0, 0, 70), { transitionDelay: clamped ? "80ms" : "0ms" })}>
        <Box x={-62} y={-38} z={BASE} w={112} d={62} h={22} tone="raw" />
      </g>

      <g className="t" style={component(tr(30, 0, 100), 300)}>
        <g className={step === 1 ? "loop-bob" : undefined} style={{ animationDelay: "0.5s" }}>
          <Box x={58} y={-10} z={BASE} w={26} d={30} h={30} tone="graphite" />
          <g className="t" style={{ transform: clamped ? "none" : tr(18, 0, 10), transitionDelay: clamped ? "520ms" : "0ms" }}>
            <Cyl x={40} y={5} z={56} r={4} h={8} tone="graphite" />
            <Box x={34} y={-1} z={64} w={42} d={12} h={8} tone="steel" />
          </g>
        </g>
      </g>

      <g className="t" style={component(tr(0, 34, 92), 390)}>
        <g className={step === 1 ? "loop-bob" : undefined} style={{ animationDelay: "0.8s" }}>
          <Box x={-24} y={30} z={BASE} w={30} d={26} h={30} tone="graphite" />
          <g className="t" style={{ transform: clamped ? "none" : tr(0, 18, 10), transitionDelay: clamped ? "620ms" : "0ms" }}>
            <Cyl x={-9} y={20} z={56} r={4} h={8} tone="graphite" />
            <Box x={-15} y={14} z={64} w={12} d={40} h={8} tone="steel" />
          </g>
        </g>
      </g>

      <Check at={[-72, -46, 108]} from={[-72, -46, BASE + 24]} className="t" style={{ opacity: clamped ? 1 : 0, transitionDelay: "700ms" }} />
      <Check at={[24, -46, 104]} from={[24, -46, BASE + 24]} className="t" style={{ opacity: clamped ? 1 : 0, transitionDelay: "800ms" }} />
      <Check at={[74, 5, 122]} from={[64, 5, 72]} className="t" style={{ opacity: clamped ? 1 : 0, transitionDelay: "900ms" }} />
    </g>
  );
}
