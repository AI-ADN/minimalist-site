import type { ComponentType } from "react";
import { FabricacionScene } from "./FabricacionScene";
import { FixtureScene } from "./FixtureScene";
import { IntegracionScene } from "./IntegracionScene";
import { MantenimientoScene } from "./MantenimientoScene";
import { MaquinadoScene } from "./MaquinadoScene";
import type { SceneProps } from "./types";

/** Adding a service requires its content entry plus one scene registered here. */
export const scenes: Record<string, ComponentType<SceneProps>> = {
  fabricacion: FabricacionScene,
  mantenimiento: MantenimientoScene,
  maquinado: MaquinadoScene,
  fixture: FixtureScene,
  integracion: IntegracionScene,
};
