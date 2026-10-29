import type { Equipment } from "./types";
import { SOURCES, published } from "./sources";

const inventory = published(SOURCES.maquinaria, SOURCES.maquinariaMovil);

/**
 * Inventario publicado en el sitio anterior. "published" no confirma disponibilidad vigente.
 * No se reutilizan dimensiones de tornos: la notación publicada es ambigua.
 * No existe modelo publicado de torno CNC ni marcas/modelos de soldadoras.
 */
export const equipment: Equipment[] = [
  { id: "waterjet-mitsubishi", name: "Corte Waterjet Mitsubishi", category: "corte", evidence: inventory },
  { id: "esab-agua-plasma", name: "Equipo ESAB de corte por agua y plasma", category: "corte", evidence: inventory },
  { id: "plasma-esab", name: "Cortadora de plasma ESAB", category: "corte", evidence: inventory },
  { id: "cortadoras", name: "Cortadoras horizontales y vertical", category: "corte", evidence: inventory },
  { id: "haas-vf", name: "Centros de maquinado HAAS VF3, VF5 y VF7", category: "fresado", evidence: inventory },
  { id: "fresadoras-horizontales", name: "Fresadoras horizontales convencionales #2 y #3", category: "fresado", evidence: inventory },
  { id: "tornos-convencionales", name: "Tornos convencionales", category: "torneado", evidence: inventory },
  { id: "rectificadoras-planas", name: "Rectificadoras planas, incluida una Okamoto", category: "rectificado", evidence: inventory },
  { id: "rectificadoras-cilindricas", name: "Rectificadoras cilíndricas", category: "rectificado", evidence: inventory },
  { id: "romer", name: "Brazo de medición ROMER", category: "inspeccion", evidence: inventory },
  { id: "instrumentos-inspeccion", name: "Instrumentos y calibradores de inspección", category: "inspeccion", evidence: inventory },
  { id: "roscadoras-neumaticas", name: "Roscadoras neumáticas", category: "roscado", evidence: inventory },
  { id: "prensa-h", name: "Prensa tipo H", category: "conformado", evidence: inventory },
  { id: "prensa-cortina", name: "Prensa de cortina", category: "conformado", evidence: inventory },
  { id: "roladora", name: "Roladora mecánica", category: "conformado", evidence: inventory },
  { id: "sand-blaster", name: "Sand blaster", category: "superficie", evidence: inventory },
  { id: "gruas-montacargas", name: "Grúas y montacargas (apoyo logístico)", category: "logistica", evidence: inventory },
];

export const equipmentById = new Map(equipment.map((e) => [e.id, e]));

export const equipmentCategoryLabel: Record<Equipment["category"], string> = {
  corte: "Corte",
  fresado: "Fresado y centros de maquinado",
  torneado: "Torneado",
  rectificado: "Rectificado",
  inspeccion: "Inspección",
  conformado: "Conformado",
  roscado: "Roscado",
  superficie: "Preparación de superficie",
  logistica: "Apoyo logístico",
};
