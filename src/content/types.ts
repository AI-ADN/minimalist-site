/**
 * published: aparece en la web consultada (no equivale a capacidad vigente confirmada).
 * proposed: hipótesis editorial o técnica del prototipo, pendiente de validación de TUNSA.
 * unknown: no disponible; no se completa con datos plausibles.
 */
export type ValidationStatus = "published" | "proposed" | "unknown";

export interface Evidence {
  status: ValidationStatus;
  sourceUrls: string[];
  note?: string;
}

export type EquipmentCategory =
  | "corte"
  | "fresado"
  | "torneado"
  | "rectificado"
  | "inspeccion"
  | "conformado"
  | "roscado"
  | "superficie"
  | "logistica";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  evidence: Evidence;
}

export interface Process {
  id: string;
  name: string;
  detail: string;
  evidence: Evidence;
}

/** Relación muchos a muchos con su propio estado de validación. */
export interface Relation {
  targetId: string;
  evidence: Evidence;
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  operationLabel: string;
  sceneKey: string;
  processRefs: Relation[];
  equipmentRefs: Relation[];
  /** Texto cuando la etapa no tiene equipo publicado asociado. */
  equipmentGap?: string;
  evidence: Evidence;
}

export interface ScopeItem {
  text: string;
  evidence: Evidence;
}

export interface MaterialList {
  items: string[];
  evidence: Evidence;
}

export type ServiceIcon = "fabricacion" | "mantenimiento" | "maquinado" | "fixture" | "integracion";

export interface Service {
  id: string;
  name: string;
  intro: string;
  scope: ScopeItem[];
  materials: MaterialList;
  sceneKey: string;
  icon: ServiceIcon;
  steps: ProcessStep[];
  evidence: Evidence;
}

export interface MediaAsset {
  id: string;
  serviceId: string;
  stepId?: string;
  kind: "illustration" | "video";
  /** Ruta local en /public. Vacía mientras no exista un archivo aprobado. */
  src?: string;
  poster?: string;
  description: string;
  status: "conceptual" | "approved" | "pending";
}
