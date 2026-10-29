"use client";

import { addressOneLine, company, mapsUrl } from "@/content/company";
import { mailtoHref } from "@/lib/contact";
import { useConsult, useExperienceActions } from "./ExperienceProvider";
import { ArrowUpRight, CloseIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function ContactSection() {
  const { consult, serviceNames } = useConsult();
  const { clearConsult } = useExperienceActions();
  const context = consult ? { serviceName: serviceNames[consult.serviceId], topic: consult.topic } : null;

  return (
    <section id="contacto" className="chapter contact" data-section aria-labelledby="contacto-title">
      <div className="contact__grid">
        <div className="card card--panel contact__main">
          <p className="eyebrow">Contacto</p>
          <h2 id="contacto-title" className="info__title" data-anchor-focus tabIndex={-1}>
            Cuéntanos qué necesitas
          </h2>
          <p className="info__intro">
            Comparte la pieza, el equipo o el proyecto que quieres resolver. Si tienes planos, modelos o muestras,
            menciónalos en tu mensaje para revisar el alcance.
          </p>

          <div className="contact__context" aria-live="polite">
            {context && (
              <p className="context-chip">
                <span>
                  {context.topic === "materiales" ? "Compatibilidad de materiales" : "Consulta de servicio"}:{" "}
                  <strong>{context.serviceName}</strong>
                </span>
                <button type="button" className="icon-btn icon-btn--sm" onClick={clearConsult} aria-label="Quitar servicio de la consulta">
                  <CloseIcon size={14} />
                </button>
              </p>
            )}
          </div>

          <div className="contact__actions">
            <a className="btn btn--primary btn--lg" href={mailtoHref(context)}>
              <MailIcon size={18} />
              {context ? `Enviar correo sobre ${context.serviceName}` : "Enviar correo"}
            </a>
            <a className="btn btn--ghost btn--lg" href={`tel:${company.phoneE164}`}>
              <PhoneIcon size={18} />
              Llamar al {company.phoneDisplay}
            </a>
          </div>
          <p className="muted small">El botón de correo abre tu aplicación de correo con el asunto preparado.</p>
        </div>

        <address className="card contact__details">
          <div className="card__head">
            <h3 className="card__title">Datos de contacto</h3>
          </div>
          <dl className="contact__list">
            <div>
              <dt>Correo</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>
                <a href={`tel:${company.phoneE164}`}>{company.phoneDisplay}</a>
              </dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>
                {company.address.street}, {company.address.neighborhood}
                <br />
                {company.address.locality}, {company.address.region}, {company.address.postalCode}, {company.address.country}
              </dd>
            </div>
          </dl>
          <a className="btn btn--ghost" href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${addressOneLine} en Google Maps (abre en otra pestaña)`}>
            <PinIcon size={16} />
            Ver en mapa
            <ArrowUpRight size={14} />
          </a>
        </address>
      </div>

      <footer className="site-footer">
        <p>© {company.legalName}</p>
        <p>Las escenas de proceso son ilustraciones conceptuales; no representan piezas, materiales ni equipos reales del taller.</p>
      </footer>
    </section>
  );
}
