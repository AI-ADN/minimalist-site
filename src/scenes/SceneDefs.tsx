const tones = {
  steel: { t: ["#F8F9F5", "#E3E5DF"], l: ["#D9DBD5", "#C7CAC2"], r: ["#C0C3BB", "#A8ACA3"], c: ["#A3A79E", "#EEF0EB", "#C8CBC3", "#989C93"] },
  raw: { t: ["#E6E3DA", "#D3D0C6"], l: ["#C4C1B6", "#B2AFA5"], r: ["#A9A69C", "#95928A"], c: ["#97948B", "#E2DFD6", "#BAB7AD", "#8B887F"] },
  graphite: { t: ["#767A71", "#5F635A"], l: ["#53564F", "#464941"], r: ["#3F423C", "#33362F"], c: ["#2F322C", "#6E726A", "#4A4D46", "#2A2C27"] },
  accent: { t: ["#9DB27B", "#80985D"], l: ["#698543", "#5B7639"], r: ["#526B34", "#455B2B"], c: ["#43582A", "#9AB077", "#66813F", "#3D5126"] },
  base: { t: ["#EDEEEA", "#DEDFDA"], l: ["#D0D2CC", "#C4C6C0"], r: ["#BCBFB7", "#AFB2AA"], c: ["#B5B8B0", "#E8E9E5", "#CDCFC9", "#ABAEA6"] },
} as const;

/** Rendered once per page; every scene references these gradients by id. */
export function SceneDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        {Object.entries(tones).map(([name, t]) => (
          <g key={name}>
            <linearGradient id={`tn-${name}-t`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={t.t[0]} />
              <stop offset="1" stopColor={t.t[1]} />
            </linearGradient>
            <linearGradient id={`tn-${name}-l`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={t.l[0]} />
              <stop offset="1" stopColor={t.l[1]} />
            </linearGradient>
            <linearGradient id={`tn-${name}-r`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={t.r[0]} />
              <stop offset="1" stopColor={t.r[1]} />
            </linearGradient>
            <linearGradient id={`tn-${name}-c`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={t.c[0]} />
              <stop offset="0.32" stopColor={t.c[1]} />
              <stop offset="0.72" stopColor={t.c[2]} />
              <stop offset="1" stopColor={t.c[3]} />
            </linearGradient>
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
        <radialGradient id="tn-glow">
          <stop offset="0" stopColor="#7E9A55" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7E9A55" stopOpacity="0" />
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
