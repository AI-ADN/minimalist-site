import type { ServiceView, StepView } from "@/content/selectors";
import { consultHref } from "@/lib/contact";
import { ArrowUpRight, ServiceGlyph } from "./icons";

interface Props {
  service: ServiceView;
  step: StepView;
  stepIndex: number;
  announce: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ServiceDetails({ service, step, stepIndex, announce }: Props) {
  const headingId = `${service.id}-title`;

  return (
    <div className="area-info card card--panel info">
      <div className="info__head">
        <p className="eyebrow">
          <ServiceGlyph name={service.icon} size={18} />
          <span>
            Servicio {pad(service.index + 1)} / {pad(service.total)}
          </span>
        </p>
        <h2 id={headingId} className="info__title" data-anchor-focus tabIndex={-1}>
          {service.name}
        </h2>
        <a className="btn btn--primary info__cta" href={consultHref(service.id)}>
          <span>
            Consultar<span className="info__cta-extra"> este servicio</span>
          </span>
          <ArrowUpRight size={16} />
        </a>
      </div>

      <p className="info__intro">{service.intro}</p>

      <ul className="chips" aria-label={`Alcance de ${service.name}`}>
        {service.scope.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>

      <div className="stage" aria-live={announce ? "polite" : "off"} aria-atomic="true">
        <p className="stage__label">
          <span className="stage__num">Etapa {pad(stepIndex + 1)}</span>
          <span className="stage__sep" aria-hidden="true" />
          <span>{step.operationLabel}</span>
        </p>
        <div className="stage__body" key={step.id}>
          <h3 className="stage__title">{step.name}</h3>
          <p className="stage__text">{step.description}</p>
        </div>
      </div>
    </div>
  );
}
