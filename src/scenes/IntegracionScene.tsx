import { Box, Check, Cyl, Flat, Pedestal, Shadow, WireBox, iso, line, pts, tr, type V3 } from "./iso";
import type { SceneProps } from "./types";

const PLATE = 26;
const CAB_X = -58;

function hose(a: V3, b: V3, lift = 60) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return `M${x1} ${y1} C${x1} ${y1 - lift} ${x2 - 46} ${y2} ${x2} ${y2}`;
}

const hoses = [hose([-16, -46, 55], [47, 27, 146], 70), hose([-4, -46, 55], [47, 27, 114], 40)];
const cable = (() => {
  const [x1, y1] = iso([CAB_X, -44, 52]);
  const [x2, y2] = iso([-30, -46, 48]);
  return `M${x1} ${y1} C${x1 + 10} ${y1 + 26} ${x2 - 10} ${y2 + 26} ${x2} ${y2}`;
})();

const rows = [104, 90, 76];
const cells = rows.flatMap((z, r) =>
  [0, 1, 2, 3].map((c) => {
    const y = -66 + c * 8.8;
    return { key: `${r}-${c}`, i: r * 4 + c, points: pts([CAB_X, y, z], [CAB_X, y + 6.6, z], [CAB_X, y + 6.6, z + 8], [CAB_X, y, z + 8]) };
  }),
);

export function IntegracionScene({ step }: SceneProps) {
  const built = step >= 1;
  const live = step >= 2;
  const solid = (delay: number) => ({ opacity: built ? 1 : 0, transform: built ? "none" : tr(0, 0, 24), transitionDelay: built ? `${delay}ms` : "0ms" });

  return (
    <g transform="translate(260 352)">
      <Pedestal />
      <Shadow x={-118} y={-84} w={236} d={168} z={16} spread={0.85} />
      <Box x={-118} y={-84} z={16} w={236} d={168} h={10} tone="steel" />
      <g className="tslots tslots--light">
        {[-44, 0, 44].map((y) => (
          <line key={y} {...line([-118, y, PLATE], [118, y, PLATE])} />
        ))}
      </g>

      {/* Definición: blueprint of the module */}
      <g className="t" style={{ opacity: step === 0 ? 1 : 0 }}>
        <WireBox x={-108} y={-74} z={PLATE} w={50} d={50} h={104} />
        <WireBox x={-36} y={-58} z={PLATE} w={40} d={24} h={22} />
        <WireBox x={14} y={8} z={PLATE} w={88} d={22} h={142} />
        <WireBox x={44} y={5} z={104} w={28} d={28} h={50} />
        <WireBox x={44} y={5} z={PLATE} w={28} d={28} h={12} />
        <path d={hoses[0]} className="wire" />
        <path d={hoses[1]} className="wire" />
      </g>

      {/* Control cabinet with sequence display */}
      <g className="t" style={solid(0)}>
        <Box x={-108} y={-74} z={PLATE} w={50} d={50} h={104} tone="steel" />
        <polygon points={pts([CAB_X, -70, 62], [CAB_X, -28, 62], [CAB_X, -28, 120], [CAB_X, -70, 120])} fill="url(#tn-screen)" />
        {cells.map((c) => (
          <polygon key={c.key} points={c.points} className="cell" style={{ animationDelay: `${c.i * 0.22}s` }} />
        ))}
        {[-98, -83, -68].map((x, i) => (
          <Flat key={x} x={x} y={-49} z={130} r={4} className="lamp" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </g>

      <g className="t" style={solid(120)}>
        <Box x={-36} y={-58} z={PLATE} w={40} d={24} h={22} tone="graphite" />
        {[-28, -16, -4].map((x) => (
          <Cyl key={x} x={x} y={-46} z={48} r={3.5} h={7} tone="steel" />
        ))}
      </g>

      <g className="t" style={solid(200)}>
        <Box x={14} y={8} z={PLATE} w={12} d={22} h={128} tone="graphite" />
      </g>

      <g className="t" style={{ opacity: built ? 1 : 0 }}>
        <Box x={44} y={5} z={PLATE} w={28} d={28} h={12} tone="raw" />
      </g>

      {/* Actuator: rod + tool head, then barrel, beam and front post */}
      <g className="t" style={solid(280)}>
        <g className="t" style={{ transform: step === 3 ? "none" : tr(0, 0, 40) }}>
          <g className={step === 3 ? "loop-press" : undefined}>
            <Box x={46} y={7} z={40} w={24} d={24} h={10} tone="accent" />
            <Cyl x={58} y={19} z={50} r={4} h={90} tone="steel" cap={false} />
          </g>
        </g>
        <Cyl x={58} y={19} z={100} r={15.5} h={6} tone="graphite" />
        <Cyl x={58} y={19} z={106} r={14} h={48} tone="steel" />
        <Box x={14} y={8} z={154} w={88} d={22} h={14} tone="graphite" />
        <Box x={90} y={8} z={PLATE} w={12} d={22} h={128} tone="graphite" />
      </g>

      {/* Air lines and control cable */}
      <g className="t" style={{ opacity: built ? 1 : 0, transitionDelay: built ? "360ms" : "0ms" }}>
        <path d={cable} className="cable" />
        {hoses.map((d) => (
          <path key={d} d={d} className="hose" />
        ))}
      </g>
      <g className="t" style={{ opacity: live ? 1 : 0 }}>
        <path d={cable} className="signal loop-march" />
        {step === 3 && hoses.map((d) => <path key={d} d={d} className="signal signal--air loop-march" />)}
      </g>

      <Check at={[96, 62, 82]} from={[58, 19, 40]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "300ms" }} />
      <Check at={[-83, -49, 172]} from={[-83, -49, 134]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "420ms" }} />
    </g>
  );
}
