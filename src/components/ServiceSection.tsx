import type { ServiceView } from "@/content/selectors";
import { ServiceStage } from "./ServiceStage";

export function ServiceSection({ service }: { service: ServiceView }) {
  return (
    <section id={service.id} className="chapter" data-section aria-labelledby={`${service.id}-title`}>
      <ServiceStage service={service} />
    </section>
  );
}
