import { Box, Check, Cyl, Flat, Pedestal, Shadow, ellipseR, iso, show, tr } from "./iso";
import type { SceneProps } from "./types";

const Z = 16;
const SX = -40;
const SY = 0;

function Shaft({ from, to, band }: { from: number; to: number; band: "worn" | "work" | "none" }) {
  return (
    <g>
      <Cyl x={SX} y={SY} z={from} r={10} h={to - from} tone="steel" cap={false} />
      {band !== "none" && <Cyl x={SX} y={SY} z={112} r={10.6} h={18} tone="accent" cap={false} className={band === "work" ? "loop-sheen-band" : undefined} />}
    </g>
  );
}

function Pulley() {
  const [cx, cy] = iso([SX, SY, 164]);
  const { rx, ry } = ellipseR(22);
  return (
    <g>
      <Cyl x={SX} y={SY} z={150} r={30} h={14} tone="steel" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="groove" />
      <Cyl x={SX} y={SY} z={164} r={10} h={12} tone="steel" />
    </g>
  );
}

export function MantenimientoScene({ step }: SceneProps) {
  const assembled = step === 0 || step === 3;
  const coverOff = step === 1 || step === 2 ? tr(-92, 0, 44) : "none";
  const loose = step === 1 ? tr(0, 0, 100) : step === 2 ? tr(100, 60, 4) : "none";

  const contact = iso([68.5, 53.5, 112]);
  const [pcx, pcy] = iso([SX, SY, 157]);
  const ring = ellipseR(42);

  return (
    <g transform="translate(260 346)">
      <Pedestal />

      {/* Intervention station: column behind the wheel, chuck at front-right */}
      <g className="t" style={show(step === 2, tr(30, -30, 0))}>
        <Box x={80} y={-22} z={Z} w={16} d={16} h={112} tone="graphite" />
      </g>
      <g className="t" style={{ opacity: step >= 1 && step <= 2 ? 1 : 0 }}>
        <Shadow x={44} y={44} w={32} d={32} z={Z} />
        <Box x={44} y={44} z={Z} w={32} d={32} h={10} tone="graphite" />
        <Cyl x={60} y={60} z={26} r={12} h={8} tone="steel" />
      </g>

      {/* Shaft segment hidden inside the housing when assembled */}
      <g className="t" style={{ opacity: assembled ? 1 : 0, transitionDuration: assembled ? "420ms" : "200ms" }}>
        <Shaft from={30} to={90} band="none" />
      </g>

      <Shadow x={-100} y={-60} w={120} d={120} z={Z} spread={0.95} />
      <Box x={-100} y={-60} z={Z} w={120} d={120} h={8} tone="graphite" />
      <Box x={-90} y={-50} z={24} w={100} d={100} h={54} tone="steel" />
      <g className="t" style={{ transform: coverOff }}>
        <Box x={-92} y={-52} z={78} w={104} d={104} h={12} tone="graphite" />
        {[
          [-82, -42],
          [2, -42],
          [-82, 42],
          [2, 42],
        ].map(([x, y]) => (
          <Flat key={`${x}${y}`} x={x} y={y} z={90} r={3} className="bolt" />
        ))}
      </g>

      {/* Assembled shaft above the cover */}
      <g className="t" style={{ opacity: assembled ? 1 : 0, transitionDuration: assembled ? "420ms" : "200ms" }}>
        <Cyl x={SX} y={SY} z={90} r={17} h={6} tone="steel" />
        <Shaft from={96} to={150} band={step === 0 ? "worn" : "none"} />
        <Pulley />
      </g>

      {/* Removed shaft: lifted, then moved to the station */}
      <g className="t" style={{ transform: loose, opacity: assembled ? 0 : 1, transitionDuration: assembled ? "560ms, 240ms" : undefined }}>
        <Shaft from={30} to={150} band={step === 2 ? "work" : "worn"} />
        <Pulley />
      </g>

      {/* Grinding wheel */}
      <g className="t" style={show(step === 2, tr(30, -30, 0))}>
        <Cyl x={88} y={39} z={104} r={24} h={10} tone="steel" />
        <Box x={80} y={-6} z={117} w={16} d={45} h={10} tone="graphite" />
        <Cyl x={88} y={39} z={114} r={6} h={4} tone="graphite" />
      </g>
      <g className="t" style={{ opacity: step === 2 ? 1 : 0 }}>
        <g className="sparks loop-spark">
          {[-28, -10, 8, 24, 40].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={contact[0] + 4}
                y1={contact[1] + 2}
                x2={contact[0] + 4 + Math.cos(rad) * (14 + (i % 2) * 8)}
                y2={contact[1] + 2 + Math.sin(rad) * (14 + (i % 2) * 8)}
                style={{ animationDelay: `${i * 0.09}s` }}
              />
            );
          })}
        </g>
      </g>

      {/* Evaluación: scan ring around the worn zone */}
      <g className="t" style={{ opacity: step === 0 ? 1 : 0 }}>
        <g className="loop-scan">
          <Flat x={SX} y={SY} z={121} r={22} fill="url(#tn-glow)" />
          <Flat x={SX} y={SY} z={121} r={17} className="scan-ring" />
        </g>
      </g>

      {/* Verificación: rotation cue and checks */}
      <g className="t" style={{ opacity: step === 3 ? 1 : 0 }}>
        <path
          d={`M ${pcx - ring.rx} ${pcy} A ${ring.rx} ${ring.ry} 0 0 0 ${pcx + ring.rx} ${pcy}`}
          className="rotate-cue loop-march"
        />
        <path d={`M ${pcx + ring.rx - 6} ${pcy - 6} L ${pcx + ring.rx} ${pcy} L ${pcx + ring.rx + 6} ${pcy - 7}`} className="rotate-cue__head" />
      </g>
      <Check at={[SX, SY, 214]} from={[SX, SY, 176]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "260ms" }} />
      <Check at={[16, 44, 132]} from={[8, 44, 90]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "400ms" }} />
    </g>
  );
}
