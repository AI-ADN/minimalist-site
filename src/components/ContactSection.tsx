"use client";

import { useMemo } from "react";
import { addressOneLine, company, mapsEmbedUrl, mapsUrl } from "@/content/company";
import { mailtoHref } from "@/lib/contact";
import { ContactForm } from "./ContactForm";
import { useConsult, useExperienceActions } from "./ExperienceProvider";
import { ArrowUpRight, CloseIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function ContactSection() {
  const { consult, serviceNames } = useConsult();
  const { clearConsult } = useExperienceActions();
  const context = consult ? { serviceName: serviceNames[consult.serviceId], topic: consult.topic } : null;
  const serviceList = useMemo(() => Object.entries(serviceNames).map(([id, name]) => ({ id, name })), [serviceNames]);

  return (
    <section id="contacto" className="chapter contact" data-section data-tone="contacto" aria-labelledby="contacto-title">
      <div className="contact__grid">
        <div className="card card--panel contact__main">
          <header className="contact__head">
            <p className="eyebrow">Contacto</p>
            <h2 id="contacto-title" className="info__title" data-anchor-focus tabIndex={-1}>
              Cuéntanos qué necesitas
            </h2>
            <p className="info__intro">
              Comparte la pieza, el equipo o el proyecto que quieres resolver. Si tienes planos, modelos o muestras,
              menciónalos para revisar el alcance.
            </p>
          </header>

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

          <ContactForm services={serviceList} consult={consult} />
        </div>

        <div className="contact__side">
          <figure className="card contact__map">
            <iframe
              title={`Mapa de Google con la ubicación de ${company.shortName}: ${addressOneLine}`}
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <figcaption className="contact__map-caption">
              <span className="contact__map-pin" aria-hidden="true">
                <PinIcon size={16} />
              </span>
              <span>
                <strong>{company.shortName}</strong>
                {company.address.street}, {company.address.neighborhood}
              </span>
              <a
                className="btn btn--ghost btn--sm"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cómo llegar a ${addressOneLine} en Google Maps (abre en otra pestaña)`}
              >
                Cómo llegar
                <ArrowUpRight size={14} />
              </a>
            </figcaption>
          </figure>

          <address className="card contact__details">
            <h3 className="card__title">Datos de contacto</h3>
            <dl className="contact__list">
              <div>
                <dt>Correo</dt>
                <dd>
                  <a href={mailtoHref(context)}>{company.email}</a>
                </dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>
                  <a href={`tel:${company.phoneE164}`}>{company.phoneDisplay}</a>
                </dd>
              </div>
              <div className="contact__list-wide">
                <dt>Dirección</dt>
                <dd>
                  {company.address.street}, {company.address.neighborhood}, {company.address.locality},{" "}
                  {company.address.region}, {company.address.postalCode}
                </dd>
              </div>
            </dl>
            <div className="contact__quick">
              <a className="btn btn--ghost" href={mailtoHref(context)}>
                <MailIcon size={16} />
                Enviar correo
              </a>
              <a className="btn btn--ghost" href={`tel:${company.phoneE164}`}>
                <PhoneIcon size={16} />
                Llamar
              </a>
            </div>
          </address>
        </div>
      </div>

      <footer className="site-footer">
        <p>© {company.legalName}</p>
        <p>Las escenas de proceso son ilustraciones conceptuales; no representan piezas, materiales ni equipos reales del taller.</p>
      </footer>
    </section>
  );
}
