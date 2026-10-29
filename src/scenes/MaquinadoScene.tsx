import type { CSSProperties } from "react";
import { Box, Check, Cyl, Flat, Path3, Pedestal, Shadow, circlePoints, iso, line, pts, show, tr, type V3 } from "./iso";
import type { SceneProps } from "./types";

const TABLE = 30;
const TOP = 78;
const FLOOR = 58;
const P = { x0: -40, x1: 40, y0: -25, y1: 25 };

const toolpath: V3[] = [-20, -10, 0, 10, 20].flatMap((y, i) =>
  i % 2 === 0
    ? ([
        [-34, y, 0],
        [34, y, 0],
      ] as V3[])
    : ([
        [34, y, 0],
        [-34, y, 0],
      ] as V3[]),
);

const at = (z: number) => toolpath.map(([x, y]) => [x, y, z] as V3);

const sweep = (units: number) => {
  const [dx, dy] = iso([units, 0, 0]);
  return { "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties;
};

export function MaquinadoScene({ step }: SceneProps) {
  const [tx, ty] = iso([0, 0, 64]);

  return (
    <g transform="translate(260 340)">
      <defs>
        <clipPath id="tn-maq-pocket">
          <polygon points={pts([P.x0, P.y0, TOP], [P.x1, P.y0, TOP], [P.x1, P.y1, TOP], [P.x0, P.y1, TOP])} />
        </clipPath>
      </defs>

      <Pedestal />
      <Shadow x={-118} y={-86} w={236} d={172} z={16} spread={0.85} />
      <Box x={-118} y={-86} z={16} w={236} d={172} h={14} tone="graphite" />
      <g className="tslots">
        {[-56, -20, 20, 56].map((y) => (
          <line key={y} {...line([-118, y, TABLE], [118, y, TABLE])} />
        ))}
      </g>

      {/* Grinding spindle housing sits behind the block */}
      <g className="t" style={show(step === 2, tr(0, 0, 50))}>
        <g className="loop-sweep" style={sweep(26)}>
          <Box x={-14} y={-76} z={108} w={28} d={24} h={30} tone="graphite" />
        </g>
      </g>

      <Shadow x={-70} y={-50} w={140} d={100} z={TABLE} spread={0.8} />
      <Box x={-70} y={-50} z={TABLE} w={140} d={100} h={TOP - TABLE} tone="raw" />

      {/* Acabado: refined surface */}
      <polygon
        points={pts([-70, -50, TOP], [70, -50, TOP], [70, 50, TOP], [-70, 50, TOP])}
        fill="url(#tn-steel-t)"
        className="t"
        style={{ opacity: step >= 2 ? 0.92 : 0 }}
      />

      {/* Pocket, clipped to its opening */}
      <g clipPath="url(#tn-maq-pocket)" className="t" style={{ opacity: step >= 1 ? 1 : 0, transitionDelay: step === 1 ? "260ms" : "0ms" }}>
        <polygon points={pts([P.x0, P.y0, FLOOR], [P.x1, P.y0, FLOOR], [P.x1, P.y1, FLOOR], [P.x0, P.y1, FLOOR])} className="pocket-floor" />
        <polygon points={pts([P.x0, P.y0, TOP], [P.x1, P.y0, TOP], [P.x1, P.y0, FLOOR], [P.x0, P.y0, FLOOR])} className="pocket-wall-l" />
        <polygon points={pts([P.x0, P.y0, TOP], [P.x0, P.y1, TOP], [P.x0, P.y1, FLOOR], [P.x0, P.y0, FLOOR])} className="pocket-wall-r" />
        <Flat x={0} y={0} z={FLOOR} r={6} fill="url(#tn-hole)" />
      </g>
      <polygon
        points={pts([P.x0, P.y0, TOP], [P.x1, P.y0, TOP], [P.x1, P.y1, TOP], [P.x0, P.y1, TOP])}
        className="t pocket-lip"
        style={{ opacity: step >= 1 ? 1 : 0 }}
      />

      {/* Preparación CAD/CAM: floating model layer with tool path */}
      <g className="t" style={{ opacity: step === 0 ? 1 : 0, transform: step === 0 ? "none" : tr(0, 0, -70) }}>
        <polygon points={pts([-80, -60, 150], [80, -60, 150], [80, 60, 150], [-80, 60, 150])} className="holo" />
        <polygon points={pts([P.x0, P.y0, 150], [P.x1, P.y0, 150], [P.x1, P.y1, 150], [P.x0, P.y1, 150])} className="holo-edge" />
        <Path3 points={at(150)} className="toolpath loop-march" />
        {(
          [
            [-80, -60],
            [80, -60],
            [80, 60],
            [-80, 60],
          ] as const
        ).map(([x, y]) => (
          <line key={`${x}${y}`} {...line([x, y, 150], [x * 0.875, y * 0.833, TOP])} className="projector" />
        ))}
      </g>
      <g className="t" style={{ opacity: step === 0 ? 1 : 0 }}>
        <polygon points={pts([P.x0, P.y0, TOP], [P.x1, P.y0, TOP], [P.x1, P.y1, TOP], [P.x0, P.y1, TOP])} className="guide" />
        <g className="axes">
          <line {...line([-70, 50, TOP], [-40, 50, TOP])} className="axes__x" />
          <line {...line([-70, 50, TOP], [-70, 80, TOP])} />
          <line {...line([-70, 50, TOP], [-70, 50, TOP + 30])} />
        </g>
      </g>

      {/* Mecanizado: end mill sweeping the pocket */}
      <g className="t" style={show(step === 1, tr(0, 0, 60))}>
        <g className="loop-sweep" style={sweep(22)}>
          <Box x={-22} y={-22} z={150} w={44} d={44} h={56} tone="graphite" />
          <Cyl x={0} y={0} z={140} r={14} h={10} tone="steel" />
          <Cyl x={0} y={0} z={64} r={7} h={76} tone="steel" />
          <g className="flutes">
            {[76, 90, 104, 118].map((z) => (
              <line key={z} x1={tx - 6} y1={ty - (z - 64) + 3} x2={tx + 6} y2={ty - (z - 64) - 4} />
            ))}
          </g>
          <g className="chips loop-chips">
            {[
              [-12, 2],
              [12, -4],
              [-4, -10],
              [16, 6],
            ].map(([dx, dy], i) => (
              <rect key={i} x={tx + dx} y={ty + dy} width={4} height={2} rx={0.8} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </g>
        </g>
      </g>

      {/* Acabado: grinding wheel traversing the back strip */}
      <g className="t" style={show(step === 2, tr(0, 0, 50))}>
        <g className="loop-sweep" style={sweep(26)}>
          {[-48, -45, -42, -39, -36, -33].map((y, i, all) => (
            <polygon key={y} points={circlePoints([0, y, 124], 44, "xz")} className={i === all.length - 1 ? "wheel-face" : "wheel-body"} />
          ))}
          <polygon points={circlePoints([0, -32, 124], 11, "xz", 20)} className="wheel-hub" />
          <g className="sparks loop-spark">
            {[200, 215, 230, 245].map((a, i) => {
              const [cx, cy] = iso([0, -39, TOP]);
              const rad = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={cx}
                  y1={cy}
                  x2={cx - Math.cos(rad) * (16 + i * 4)}
                  y2={cy + Math.sin(rad) * (10 + i * 3)}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </g>
        </g>
      </g>

      {/* Inspección: touch probe and dimension */}
      <g className="t" style={show(step === 3, tr(0, 0, 50))}>
        <Box x={45} y={28} z={160} w={20} d={20} h={26} tone="graphite" />
        <Cyl x={55} y={38} z={120} r={8} h={40} tone="steel" />
        <line {...line([55, 38, 120], [55, 38, 84])} className="arm__probe" />
        <circle cx={iso([55, 38, 82])[0]} cy={iso([55, 38, 82])[1]} r={4} className="probe-tip loop-pulse" />
      </g>
      <g className="t dim" style={{ opacity: step === 3 ? 1 : 0 }}>
        <line {...line([P.x0, 34, TOP], [P.x1, 34, TOP])} className="dim__main" />
        <line {...line([P.x0, 28, TOP], [P.x0, 40, TOP])} />
        <line {...line([P.x1, 28, TOP], [P.x1, 40, TOP])} />
      </g>
      <Check at={[0, -6, 128]} from={[0, 0, FLOOR]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "260ms" }} />
      <Check at={[-70, 50, 122]} from={[-70, 50, TOP]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "380ms" }} />
      <Check at={[70, -50, 122]} from={[70, -50, TOP]} className="t" style={{ opacity: step === 3 ? 1 : 0, transitionDelay: "500ms" }} />
    </g>
  );
}
