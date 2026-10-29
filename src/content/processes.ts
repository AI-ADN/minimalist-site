import type { Process } from "./types";
import { SOURCES, proposed, published } from "./sources";

/** La página de procesos muestra cuatro entradas; su numeración salta de 2 a 5 y no se reconstruye. */
export const processes: Process[] = [
  {
    id: "torneado",
    name: "Torneado",
    detail: "CNC y convencional",
    evidence: published(SOURCES.procesos),
  },
  {
    id: "fresado",
    name: "Fresado",
    detail: "Convencional y centro de maquinado CNC",
    evidence: published(SOURCES.procesos),
  },
  {
    id: "rectificado",
    name: "Rectificado",
    detail: "Plano y cilíndrico",
    evidence: published(SOURCES.procesos),
  },
  {
    id: "soldadura",
    name: "Soldadura",
    detail: "Microalambre, TIG, eléctrica y autógena",
    evidence: published(SOURCES.procesos),
  },
  {
    id: "corte",
    name: "Corte",
    detail: "Waterjet o plasma, según proyecto",
    evidence: proposed("Proceso inferido del equipo publicado; no aparece en la página de procesos.", SOURCES.maquinaria),
  },
  {
    id: "inspeccion",
    name: "Inspección",
    detail: "Instrumentos de medición y brazo ROMER",
    evidence: published(SOURCES.maquinaria),
  },
];

export const processById = new Map(processes.map((p) => [p.id, p]));
