import type { MediaAsset } from "./types";
import { services } from "./services";

/**
 * Cada etapa usa hoy una ilustración SVG conceptual (src/scenes).
 * Para sustituirla por video: añadir el archivo en /public/media, cambiar kind a "video",
 * completar src y poster, y status a "approved". ProcessScene vuelve a la ilustración
 * si el video falla.
 */
export const mediaAssets: MediaAsset[] = services.flatMap((service) =>
  service.steps.map((step) => ({
    id: `${step.id}-media`,
    serviceId: service.id,
    stepId: step.id,
    kind: "illustration" as const,
    description: `Ilustración conceptual: ${service.name} — ${step.name}`,
    status: "conceptual" as const,
  })),
);

export const mediaByStep = new Map(mediaAssets.map((m) => [m.stepId, m]));
