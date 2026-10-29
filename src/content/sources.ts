import type { Evidence } from "./types";

export const SOURCES = {
  servicios: "https://talleresunidos.com/servicios.html",
  procesos: "https://talleresunidos.com/procesos.html",
  maquinaria: "https://talleresunidos.com/maquinaria-y-equipo.html",
  maquinariaMovil: "https://talleresunidos.com/phone/maquinaria-y-equipo.html",
  nosotros: "https://talleresunidos.com/nosotros.html",
  contacto: "https://talleresunidos.com/contacto.html",
} as const;

export const published = (...sourceUrls: string[]): Evidence => ({ status: "published", sourceUrls });

export const proposed = (note?: string, ...sourceUrls: string[]): Evidence => ({
  status: "proposed",
  sourceUrls,
  note,
});

export const unknown = (note?: string): Evidence => ({ status: "unknown", sourceUrls: [], note });
