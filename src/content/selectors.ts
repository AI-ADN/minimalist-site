import { equipmentById } from "./equipment";
import { mediaByStep } from "./media";
import { services } from "./services";
import type { EquipmentCategory, Service, ServiceIcon, ValidationStatus } from "./types";

export interface EquipmentView {
  id: string;
  name: string;
  category: EquipmentCategory;
  /** La relación con la etapa es inferida, aunque el equipo esté publicado. */
  isProposed: boolean;
}

export interface StepView {
  id: string;
  name: string;
  description: string;
  operationLabel: string;
  sceneKey: string;
  equipment: EquipmentView[];
  equipmentGap?: string;
  video?: { src: string; poster?: string };
}

export interface ServiceView {
  id: string;
  name: string;
  index: number;
  total: number;
  sceneKey: string;
  icon: ServiceIcon;
  intro: string;
  isIllustrativeRoute: boolean;
  scope: string[];
  materials: { items: string[]; status: ValidationStatus };
  routeEquipment: EquipmentView[];
  steps: StepView[];
}

export function toServiceView(service: Service, index: number): ServiceView {
  const steps: StepView[] = service.steps.map((step) => {
      const media = mediaByStep.get(step.id);
      return {
        id: step.id,
        name: step.name,
        description: step.description,
        operationLabel: step.operationLabel,
        sceneKey: step.sceneKey,
        equipmentGap: step.equipmentGap,
        video:
          media?.kind === "video" && media.status === "approved" && media.src
            ? { src: media.src, poster: media.poster }
            : undefined,
        equipment: step.equipmentRefs.flatMap((rel) => {
          const item = equipmentById.get(rel.targetId);
          if (!item) return [];
          return [{ id: item.id, name: item.name, category: item.category, isProposed: rel.evidence.status !== "published" }];
        }),
      };
  });

  const routeEquipment = [...new Map(steps.flatMap((s) => s.equipment).map((e) => [e.id, e])).values()];

  return {
    id: service.id,
    name: service.name,
    index,
    total: services.length,
    sceneKey: service.sceneKey,
    icon: service.icon,
    intro: service.intro,
    isIllustrativeRoute: service.steps.some((s) => s.evidence.status !== "published"),
    scope: service.scope.map((s) => s.text),
    materials: { items: service.materials.items, status: service.materials.evidence.status },
    routeEquipment,
    steps,
  };
}
