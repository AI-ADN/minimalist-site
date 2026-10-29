import type { ServiceView } from "@/content/selectors";
import { consultHref } from "@/lib/contact";
import { ArrowUpRight, DocIcon, LayersIcon } from "./icons";

export function MaterialsCard({ service }: { service: ServiceView }) {
  const headingId = `${service.id}-materials`;
  const confirmed = service.materials.status === "published" && service.materials.items.length > 0;

  return (
    <section className="card materials" aria-labelledby={headingId}>
      <div className="card__head">
        <h3 id={headingId} className="card__title">
          Materiales
        </h3>
        {!confirmed && <span className="badge badge--muted">Por confirmar</span>}
      </div>

      {confirmed ? (
        <ul className="chips">
          {service.materials.items.map((m) => (
            <li key={m} className="chip">
              {m}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className="materials__lead">
            <LayersIcon size={18} />
            <span>Materiales y especificaciones por confirmar para cada proyecto.</span>
          </p>
          <p className="materials__hint">
            <DocIcon size={15} />
            <span>Comparte plano o muestra, material requerido y cantidad.</span>
          </p>
        </>
      )}

      <a className="btn btn--ghost materials__cta" href={consultHref(service.id, "materiales")}>
        Consultar compatibilidad
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}
