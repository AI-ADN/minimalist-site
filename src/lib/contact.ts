import { company } from "@/content/company";

export type ConsultTopic = "servicio" | "materiales";

export interface ConsultContext {
  serviceName: string;
  topic: ConsultTopic;
}

export function consultHref(serviceId: string, topic: ConsultTopic = "servicio") {
  const params = new URLSearchParams({ servicio: serviceId });
  if (topic === "materiales") params.set("motivo", "materiales");
  return `?${params.toString()}#contacto`;
}

export function mailtoHref(context: ConsultContext | null) {
  if (!context) return `mailto:${company.email}`;

  const subject =
    context.topic === "materiales"
      ? `Compatibilidad de materiales: ${context.serviceName}`
      : `Consulta de servicio: ${context.serviceName}`;
  const body =
    context.topic === "materiales"
      ? `Hola, quiero revisar la compatibilidad de un material para el servicio de ${context.serviceName}.\n\nMaterial o especificación:\nPlano, modelo o muestra disponible:\nCantidad y uso de la pieza:\n`
      : `Hola, me interesa el servicio de ${context.serviceName}.\n\nDescripción del proyecto:\n`;

  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
