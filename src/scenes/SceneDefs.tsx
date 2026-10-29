const tones = {
  steel: { t: ["#F8F9F5", "#E3E5DF"], l: ["#D9DBD5", "#C7CAC2"], r: ["#C0C3BB", "#A8ACA3"], c: ["#A3A79E", "#EEF0EB", "#C8CBC3", "#989C93"] },
  raw: { t: ["#E6E3DA", "#D3D0C6"], l: ["#C4C1B6", "#B2AFA5"], r: ["#A9A69C", "#95928A"], c: ["#97948B", "#E2DFD6", "#BAB7AD", "#8B887F"] },
  graphite: { t: ["#767A71", "#5F635A"], l: ["#53564F", "#464941"], r: ["#3F423C", "#33362F"], c: ["#2F322C", "#6E726A", "#4A4D46", "#2A2C27"] },
  base: { t: ["#EDEEEA", "#DEDFDA"], l: ["#D0D2CC", "#C4C6C0"], r: ["#BCBFB7", "#AFB2AA"], c: ["#B5B8B0", "#E8E9E5", "#CDCFC9", "#ABAEA6"] },
} as const;

/** Accent shades derived from the section tone's CSS variables (globals.css), so colours live in one place. */
const accentShades = {
  t: ["var(--accent-light)", "color-mix(in srgb, var(--accent-light) 60%, var(--accent))"],
  l: ["color-mix(in srgb, var(--accent) 75%, var(--accent-light))", "var(--accent)"],
  r: ["color-mix(in srgb, var(--accent) 88%, #000)", "color-mix(in srgb, var(--accent) 74%, #000)"],
  c: [
    "color-mix(in srgb, var(--accent) 72%, #000)",
    "color-mix(in srgb, var(--accent-light) 92%, var(--accent))",
    "color-mix(in srgb, var(--accent) 85%, var(--accent-light))",
    "color-mix(in srgb, var(--accent) 66%, #000)",
  ],
} as const;

/** Section tones that have a process scene; each gets its own accent gradient family. */
export const sceneAccentTones = ["fabricacion", "mantenimiento", "maquinado", "fixture", "integracion"] as const;

type Shades = { t: readonly string[]; l: readonly string[]; r: readonly string[]; c: readonly string[] };

function Family({ id, shades, css = false }: { id: string; shades: Shades; css?: boolean }) {
  const stop = (offset: number | string, color: string) =>
    css ? <stop offset={offset} style={{ stopColor: color }} /> : <stop offset={offset} stopColor={color} />;
  return (
    <>
      <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
        {stop(0, shades.t[0])}
        {stop(1, shades.t[1])}
      </linearGradient>
      <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
        {stop(0, shades.l[0])}
        {stop(1, shades.l[1])}
      </linearGradient>
      <linearGradient id={`${id}-r`} x1="0" y1="0" x2="0" y2="1">
        {stop(0, shades.r[0])}
        {stop(1, shades.r[1])}
      </linearGradient>
      <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="0">
        {stop(0, shades.c[0])}
        {stop(0.32, shades.c[1])}
        {stop(0.72, shades.c[2])}
        {stop(1, shades.c[3])}
      </linearGradient>
    </>
  );
}

/** Rendered once per page; every scene references these gradients by id. */
export function SceneDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        {Object.entries(tones).map(([name, t]) => (
          <Family key={name} id={`tn-${name}`} shades={t} />
        ))}
        {sceneAccentTones.map((tone) => (
          <g key={tone} data-tone={tone}>
            <Family id={`tn-accent-${tone}`} shades={accentShades} css />
            <radialGradient id={`tn-glow-${tone}`}>
              <stop offset="0" style={{ stopColor: "var(--accent-light)", stopOpacity: 0.6 }} />
              <stop offset="1" style={{ stopColor: "var(--accent-light)", stopOpacity: 0 }} />
            </radialGradient>
          </g>
        ))}
        <radialGradient id="tn-shadow">
          <stop offset="0" stopColor="#20221F" stopOpacity="0.26" />
          <stop offset="0.6" stopColor="#20221F" stopOpacity="0.08" />
          <stop offset="1" stopColor="#20221F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tn-hole" cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#2E312B" />
          <stop offset="1" stopColor="#6A6E66" />
        </radialGradient>
        <linearGradient id="tn-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tn-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B2E29" />
          <stop offset="1" stopColor="#1E201C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
