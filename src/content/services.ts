import type { Relation, Service } from "./types";
import { SOURCES, proposed, published, unknown } from "./sources";

const ROUTE_NOTE = "Secuencia ilustrativa del prototipo; no publicada por TUNSA.";

const equip = (targetId: string): Relation => ({
  targetId,
  evidence: proposed("Asignación al recorrido inferida; el equipo sí aparece en el inventario publicado.", SOURCES.maquinaria),
});

const proc = (targetId: string): Relation => ({
  targetId,
  evidence: proposed("Relación proceso–etapa inferida.", SOURCES.procesos),
});

const route = proposed(ROUTE_NOTE);

const noMaterials = {
  items: [],
  evidence: unknown("No se encontró una lista explícita de materiales en servicios, procesos ni maquinaria."),
};

export const services: Service[] = [
  {
    id: "fabricacion",
    name: "Fabricación",
    icon: "fabricacion",
    sceneKey: "fabricacion",
    intro:
      "Fabricamos refacciones industriales, producimos y afilamos cuchillas, y desarrollamos maquinaria y dispositivos para diferentes aplicaciones. Cada proyecto se define según la pieza o el equipo requerido y combina solo las operaciones de corte, maquinado e inspección que necesita.",
    scope: [
      { text: "Refacciones industriales", evidence: published(SOURCES.servicios) },
      { text: "Producción y afilado de cuchillas", evidence: published(SOURCES.servicios) },
      { text: "Desarrollo de maquinaria y dispositivos", evidence: published(SOURCES.servicios) },
    ],
    materials: noMaterials,
    evidence: published(SOURCES.servicios),
    steps: [
      {
        id: "fabricacion-definicion",
        name: "Definición",
        description:
          "Se revisan la pieza o el dispositivo requerido, su función y las especificaciones disponibles para decidir qué operaciones conviene combinar en su fabricación.",
        operationLabel: "Revisión de la pieza requerida",
        sceneKey: "fabricacion.definicion",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Etapa de revisión técnica; no requiere equipo de producción.",
        evidence: route,
      },
      {
        id: "fabricacion-corte",
        name: "Corte",
        description:
          "El material se lleva a un contorno cercano a la forma final. Según el proyecto, puede cortarse por waterjet o por plasma con el equipo publicado del taller.",
        operationLabel: "Corte por waterjet o plasma",
        sceneKey: "fabricacion.corte",
        processRefs: [proc("corte")],
        equipmentRefs: [equip("waterjet-mitsubishi"), equip("esab-agua-plasma"), equip("plasma-esab")],
        evidence: route,
      },
      {
        id: "fabricacion-mecanizado",
        name: "Mecanizado",
        description:
          "Torneado, fresado o centro de maquinado CNC dan forma a perforaciones, caras y detalles funcionales. La operación se elige según la geometría de cada pieza.",
        operationLabel: "Torneado o fresado",
        sceneKey: "fabricacion.mecanizado",
        processRefs: [proc("torneado"), proc("fresado")],
        equipmentRefs: [equip("haas-vf"), equip("fresadoras-horizontales"), equip("tornos-convencionales")],
        evidence: route,
      },
      {
        id: "fabricacion-inspeccion",
        name: "Inspección",
        description:
          "Las dimensiones se comprueban con instrumentos de medición o con el brazo ROMER antes de entregar la pieza terminada.",
        operationLabel: "Medición e inspección",
        sceneKey: "fabricacion.inspeccion",
        processRefs: [proc("inspeccion")],
        equipmentRefs: [equip("romer"), equip("instrumentos-inspeccion")],
        evidence: route,
      },
    ],
  },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    icon: "mantenimiento",
    sceneKey: "mantenimiento",
    intro:
      "Reparamos piezas y atendemos equipos mecánicos, hidráulicos y neumáticos. El objetivo es devolver a operación un componente o un conjunto: se evalúa la falla, se desmonta, se interviene la pieza afectada y se verifica antes de reinstalarla.",
    scope: [
      { text: "Reparación de piezas", evidence: published(SOURCES.servicios) },
      { text: "Equipos mecánicos, hidráulicos y neumáticos", evidence: published(SOURCES.servicios) },
    ],
    materials: noMaterials,
    evidence: published(SOURCES.servicios),
    steps: [
      {
        id: "mantenimiento-evaluacion",
        name: "Evaluación",
        description:
          "Se revisa el equipo o la pieza para ubicar el desgaste o la falla y definir el alcance de la reparación antes de intervenir.",
        operationLabel: "Revisión del equipo",
        sceneKey: "mantenimiento.evaluacion",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Las herramientas de diagnóstico no están especificadas en el catálogo publicado.",
        evidence: route,
      },
      {
        id: "mantenimiento-desmontaje",
        name: "Desmontaje",
        description:
          "El conjunto se separa de forma ordenada para acceder al componente afectado y conservar las piezas que siguen en buen estado.",
        operationLabel: "Desarmado del conjunto",
        sceneKey: "mantenimiento.desmontaje",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Las herramientas de desmontaje no están especificadas en el catálogo publicado.",
        evidence: route,
      },
      {
        id: "mantenimiento-intervencion",
        name: "Intervención",
        description:
          "La pieza afectada se repara o se reconstruye. Cuando aplica, se recurre a torneado o rectificado para recuperar superficies y ajustes.",
        operationLabel: "Torneado o rectificado, cuando aplica",
        sceneKey: "mantenimiento.intervencion",
        processRefs: [proc("torneado"), proc("rectificado")],
        equipmentRefs: [equip("tornos-convencionales"), equip("rectificadoras-cilindricas"), equip("rectificadoras-planas")],
        evidence: route,
      },
      {
        id: "mantenimiento-verificacion",
        name: "Verificación",
        description:
          "Antes del reensamble se comprueban medidas y ajustes con instrumentos de inspección, y el conjunto se arma de nuevo para su regreso a operación.",
        operationLabel: "Medición y reensamble",
        sceneKey: "mantenimiento.verificacion",
        processRefs: [proc("inspeccion")],
        equipmentRefs: [equip("instrumentos-inspeccion")],
        evidence: route,
      },
    ],
  },
  {
    id: "maquinado",
    name: "Maquinado",
    icon: "maquinado",
    sceneKey: "maquinado",
    intro:
      "Mecanizamos piezas industriales a partir de trabajo CAD/CAM. El modelo digital define las trayectorias de herramienta y el mecanizado se realiza en centro de maquinado, fresadora o torno, según la geometría. Cuando la pieza lo requiere, el acabado se complementa con rectificado.",
    scope: [
      { text: "Trabajo CAD/CAM", evidence: published(SOURCES.servicios) },
      { text: "Mecanizado de piezas industriales", evidence: published(SOURCES.servicios) },
    ],
    materials: noMaterials,
    evidence: published(SOURCES.servicios),
    steps: [
      {
        id: "maquinado-cadcam",
        name: "Preparación CAD/CAM",
        description:
          "La geometría de la pieza se modela o se revisa en CAD, y en CAM se preparan las trayectorias de herramienta que seguirá el mecanizado.",
        operationLabel: "Modelo y trayectorias de herramienta",
        sceneKey: "maquinado.cadcam",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "El software CAD/CAM utilizado no está publicado.",
        evidence: route,
      },
      {
        id: "maquinado-mecanizado",
        name: "Mecanizado",
        description:
          "El material se retira por etapas en centro de maquinado HAAS, fresadora o torno, hasta obtener la forma y las cavidades de la pieza.",
        operationLabel: "Fresado CNC o torneado",
        sceneKey: "maquinado.mecanizado",
        processRefs: [proc("fresado"), proc("torneado")],
        equipmentRefs: [equip("haas-vf"), equip("fresadoras-horizontales"), equip("tornos-convencionales")],
        evidence: route,
      },
      {
        id: "maquinado-acabado",
        name: "Acabado",
        description:
          "Cuando la pieza lo requiere, las superficies se terminan en rectificadora plana o cilíndrica para mejorar su planitud, su redondez o su acabado.",
        operationLabel: "Rectificado, cuando aplica",
        sceneKey: "maquinado.acabado",
        processRefs: [proc("rectificado")],
        equipmentRefs: [equip("rectificadoras-planas"), equip("rectificadoras-cilindricas")],
        evidence: route,
      },
      {
        id: "maquinado-inspeccion",
        name: "Inspección",
        description:
          "Se miden las características principales con instrumentos o con el brazo ROMER para confirmar que la pieza corresponde a su modelo antes de entregarla.",
        operationLabel: "Medición e inspección",
        sceneKey: "maquinado.inspeccion",
        processRefs: [proc("inspeccion")],
        equipmentRefs: [equip("instrumentos-inspeccion"), equip("romer")],
        evidence: route,
      },
    ],
  },
  {
    id: "fixture",
    name: "Fixture",
    icon: "fixture",
    sceneKey: "fixture",
    intro:
      "Fabricamos herramientas de usos múltiples. Un fixture sujeta o posiciona una pieza mientras se trabaja; el recorrido que se muestra es un ejemplo conceptual en el que base, localizadores y sujeción se fabrican, se ensamblan y se verifican según cada aplicación.",
    scope: [{ text: "Herramientas de usos múltiples", evidence: published(SOURCES.servicios) }],
    materials: noMaterials,
    evidence: published(SOURCES.servicios),
    steps: [
      {
        id: "fixture-definicion",
        name: "Definición",
        description:
          "Se identifica la pieza que debe sujetarse y la operación en la que se usará, para decidir la base, los puntos de apoyo y la forma de sujeción.",
        operationLabel: "Puntos de apoyo y sujeción",
        sceneKey: "fixture.definicion",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Etapa de definición técnica; no requiere equipo de producción.",
        evidence: route,
      },
      {
        id: "fixture-componentes",
        name: "Fabricación de componentes",
        description:
          "La base, los localizadores y las piezas de sujeción se fabrican por separado, por ejemplo en fresadora o centro de maquinado, con roscado cuando aplica.",
        operationLabel: "Fresado y roscado de componentes",
        sceneKey: "fixture.componentes",
        processRefs: [proc("fresado")],
        equipmentRefs: [equip("haas-vf"), equip("fresadoras-horizontales"), equip("roscadoras-neumaticas")],
        evidence: route,
      },
      {
        id: "fixture-ensamble",
        name: "Ensamble",
        description:
          "Los componentes se montan y se ajustan sobre la base en las posiciones definidas, hasta formar una herramienta lista para recibir la pieza.",
        operationLabel: "Montaje sobre la base",
        sceneKey: "fixture.ensamble",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "El equipo de ensamble no está especificado en el catálogo publicado.",
        evidence: route,
      },
      {
        id: "fixture-verificacion",
        name: "Verificación",
        description:
          "Con una pieza de referencia colocada se revisan posiciones y sujeción con instrumentos de inspección antes de liberar la herramienta para su uso.",
        operationLabel: "Prueba con pieza de referencia",
        sceneKey: "fixture.verificacion",
        processRefs: [proc("inspeccion")],
        equipmentRefs: [equip("instrumentos-inspeccion")],
        evidence: route,
      },
    ],
  },
  {
    id: "integracion",
    name: "Integración",
    icon: "integracion",
    sceneKey: "integracion",
    intro:
      "Desarrollamos dispositivos de control que combinan ensambles neumáticos, electrónica y programación. Cada integración se define según la tarea que el dispositivo debe resolver; el recorrido ilustra cómo se ensambla el módulo, se programa su secuencia y se prueba antes de la entrega.",
    scope: [
      { text: "Ensambles neumáticos", evidence: published(SOURCES.servicios) },
      { text: "Electrónica", evidence: published(SOURCES.servicios) },
      { text: "Programación", evidence: published(SOURCES.servicios) },
    ],
    materials: noMaterials,
    evidence: published(SOURCES.servicios),
    steps: [
      {
        id: "integracion-definicion",
        name: "Definición",
        description:
          "Se acuerda qué debe hacer el dispositivo, qué movimientos y señales intervienen y cómo se integrará con el proceso existente.",
        operationLabel: "Función, movimientos y señales",
        sceneKey: "integracion.definicion",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Los equipos específicos de integración no están publicados.",
        evidence: route,
      },
      {
        id: "integracion-ensamble",
        name: "Ensamble",
        description:
          "Se montan los componentes neumáticos y electrónicos sobre su estructura y se realizan las conexiones de aire y de control.",
        operationLabel: "Montaje neumático y eléctrico",
        sceneKey: "integracion.ensamble",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Los equipos específicos de integración no están publicados.",
        evidence: route,
      },
      {
        id: "integracion-programacion",
        name: "Programación",
        description:
          "Se programa la secuencia de operación: el orden de los movimientos, las condiciones de arranque y la respuesta del dispositivo ante cada señal.",
        operationLabel: "Secuencia de control",
        sceneKey: "integracion.programacion",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "No se publican marcas de controladores ni herramientas de programación.",
        evidence: route,
      },
      {
        id: "integracion-pruebas",
        name: "Pruebas",
        description:
          "El dispositivo se pone en marcha para comprobar que cada movimiento ocurre en el orden esperado, y se ajusta lo necesario antes de la entrega.",
        operationLabel: "Puesta en marcha",
        sceneKey: "integracion.pruebas",
        processRefs: [],
        equipmentRefs: [],
        equipmentGap: "Los bancos o equipos de prueba no están publicados.",
        evidence: route,
      },
    ],
  },
];
