import { company } from "@/content/company";
import { equipment, equipmentCategoryLabel } from "@/content/equipment";
import { processes } from "@/content/processes";
import type { Equipment } from "@/content/types";
import { EquipmentGlyph, PinIcon } from "./icons";

const SOURCE_PAGE_PROCESSES = new Set(["torneado", "fresado", "rectificado", "soldadura"]);

function groupByCategory(items: Equipment[]) {
  const groups = new Map<Equipment["category"], Equipment[]>();
  for (const item of items) {
    if (item.evidence.status !== "published") continue;
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups.entries()];
}

export function AboutSection() {
  const listed = processes.filter((p) => p.evidence.status === "published" && SOURCE_PAGE_PROCESSES.has(p.id));
  const groups = groupByCategory(equipment);

  return (
    <section id="nosotros" className="chapter about" data-section data-tone="nosotros" aria-labelledby="nosotros-title">
      <div className="about__grid">
        <div className="card card--panel about__intro">
          <p className="eyebrow">Nosotros</p>
          <h2 id="nosotros-title" className="info__title" data-anchor-focus tabIndex={-1}>
            {company.legalName}
          </h2>
          <p className="info__intro">
            Empresa mexicana del {company.sector.toLowerCase()}, ubicada en {company.city}, {company.state}. Fabricamos,
            reparamos y maquinamos piezas industriales, y desarrollamos dispositivos y herramientas para distintas
            aplicaciones.
          </p>
          <dl className="facts">
            <div>
              <dt>Actividad</dt>
              <dd>Desde {company.since}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>
                <PinIcon size={16} />
                {company.city}, {company.state}
              </dd>
            </div>
          </dl>
        </div>

        <section className="card about__processes" aria-labelledby="procesos-title">
          <div className="card__head">
            <h3 id="procesos-title" className="card__title">
              Procesos
            </h3>
          </div>
          <ul className="process-list">
            {listed.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span>{p.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card about__equipment" aria-labelledby="equipo-title">
          <div className="card__head">
            <h3 id="equipo-title" className="card__title">
              Maquinaria y equipo
            </h3>
            <span className="badge badge--muted">Disponibilidad a confirmar</span>
          </div>
          <div className="equip-groups">
            {groups.map(([category, items]) => (
              <div key={category} className="equip-group">
                <p className="equip-group__title">
                  <EquipmentGlyph category={category} size={16} />
                  {equipmentCategoryLabel[category]}
                </p>
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
