import type { SVGProps } from "react";
import type { EquipmentCategory, ServiceIcon } from "@/content/types";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const serviceGlyphs: Record<ServiceIcon, React.ReactNode> = {
  fabricacion: (
    <>
      <path d="M4 15.5 12 20l8-4.5" />
      <path d="M4 11.5 12 16l8-4.5L12 7z" />
      <path d="M12 7V3.5" />
      <path d="M9.5 4.5h5" />
    </>
  ),
  mantenimiento: (
    <path d="M14.5 5.5a4 4 0 0 0 4.9 4.9l-8.6 8.6a2.1 2.1 0 0 1-3-3l8.6-8.6a4 4 0 0 1-1.9-1.9Zm0 0 2.2-2.2M19.4 10.4l2.1-2.1" />
  ),
  maquinado: (
    <>
      <path d="M9 3h6v4H9z" />
      <path d="M10 7h4v9l-2 3.5-2-3.5z" />
      <path d="m10 10.5 4 1.8M10 13.7l4 1.8" />
      <path d="M5 21h14" />
    </>
  ),
  fixture: (
    <>
      <path d="M3 19.5h18" />
      <path d="M5 15.5h6v4H5z" />
      <path d="M8 15.5V8h10v3" />
      <path d="M15.5 11v6" />
      <path d="M13.5 17h4" />
    </>
  ),
  integracion: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <circle cx="5" cy="5" r="1.8" />
      <circle cx="19" cy="5" r="1.8" />
      <circle cx="19" cy="19" r="1.8" />
      <path d="M6.3 6.3 9 9M17.7 6.3 15 9M15 15l2.7 2.7M3 15h6M5 15v4" />
    </>
  ),
};

export function ServiceGlyph({ name, ...rest }: IconProps & { name: ServiceIcon }) {
  return <Svg {...rest}>{serviceGlyphs[name]}</Svg>;
}

const equipmentGlyphs: Record<EquipmentCategory, React.ReactNode> = {
  corte: (
    <>
      <path d="M10 3h4v5h-4z" />
      <path d="M12 8v6" strokeDasharray="1.5 2" />
      <path d="M4 18h16" />
      <path d="m9 15 3 3 3-3" />
    </>
  ),
  fresado: serviceGlyphs.maquinado,
  torneado: (
    <>
      <path d="M3 9h4v6H3z" />
      <path d="M7 10.5h11a1.5 1.5 0 0 1 0 3H7" />
      <path d="M14 18l2-4.5" />
      <path d="M21 12h-1.5" />
    </>
  ),
  rectificado: (
    <>
      <circle cx="12" cy="9" r="5" />
      <circle cx="12" cy="9" r="1.2" />
      <path d="M4 19h16" />
      <path d="M8 16.5h8" />
    </>
  ),
  inspeccion: (
    <>
      <path d="M4 5h14v4H8v10H4z" />
      <path d="M12 9v5" />
      <path d="M7 7h.01M10 7h.01M13 7h.01" />
    </>
  ),
  conformado: (
    <>
      <path d="M5 3h14v4H5z" />
      <path d="M12 7v5" />
      <path d="M8 12h8v2H8z" />
      <path d="M4 19c3-2.5 13-2.5 16 0" />
    </>
  ),
  roscado: (
    <>
      <path d="M9 3h6v3H9z" />
      <path d="M12 6v14" />
      <path d="m9.5 9 5 1.5M9.5 12l5 1.5M9.5 15l5 1.5" />
    </>
  ),
  superficie: (
    <>
      <path d="M4 7h7v4H4z" />
      <path d="M11 9h3" />
      <path d="M16 6.5h.01M18 9h.01M16 11.5h.01M20 7h.01M20 11h.01" />
      <path d="M4 19h16" />
    </>
  ),
  logistica: (
    <>
      <path d="M4 4h16" />
      <path d="M12 4v8" />
      <path d="M12 12a2.5 2.5 0 1 1-2.5 2.5" />
    </>
  ),
};

export function EquipmentGlyph({ category, ...rest }: IconProps & { category: EquipmentCategory }) {
  return <Svg {...rest}>{equipmentGlyphs[category]}</Svg>;
}

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
  </Svg>
);
export const PauseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5.5v13M16 5.5v13" strokeWidth={2.4} />
  </Svg>
);
export const ReplayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4v4h4" />
  </Svg>
);
export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </Svg>
);
export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Svg>
);
export const ChevronUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 14.5 6-6 6 6" />
  </Svg>
);
export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);
export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Svg>
);
export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
);
export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h4l1.5 4.5-2.3 1.4a11 11 0 0 0 5.9 5.9l1.4-2.3L20 15v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1" />
  </Svg>
);
export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const LayersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 4 8 4.5-8 4.5-8-4.5z" />
    <path d="m4 13 8 4.5 8-4.5" />
  </Svg>
);
export const DocIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 15.5h5" />
  </Svg>
);
export const BoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
    <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
  </Svg>
);
