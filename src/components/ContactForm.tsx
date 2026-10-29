"use client";

import { useRef, useState, type FormEvent } from "react";
import { company } from "@/content/company";
import type { ConsultTopic } from "@/lib/contact";
import {
  limits,
  normalizeContact,
  OTHER_SERVICE,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contactForm";
import { CheckIcon, MailIcon, PhoneIcon } from "./icons";

type Status = "idle" | "sending" | "sent" | "unavailable" | "rate_limited" | "error";

interface Values {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string;
}

const EMPTY: Values = { name: "", company: "", email: "", phone: "", service: "", message: "", website: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "phone", "message"];

const newSubmissionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

function mailtoFromValues(values: Values, serviceLabel: string) {
  const subject = `Solicitud web: ${serviceLabel}${values.name ? ` — ${values.name}` : ""}`;
  const body = [
    `Nombre: ${values.name}`,
    `Empresa: ${values.company || "—"}`,
    `Correo: ${values.email}`,
    `Teléfono: ${values.phone || "—"}`,
    `Servicio de interés: ${serviceLabel}`,
    "",
    values.message,
  ].join("\n");
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

interface Props {
  services: { id: string; name: string }[];
  consult: { serviceId: string; topic: ConsultTopic } | null;
}

export function ContactForm({ services, consult }: Props) {
  const [values, setValues] = useState<Values>(() => ({ ...EMPTY, service: consult?.serviceId ?? "" }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const submissionId = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Keep the service selector in step with "Consultar este servicio" links, without touching the rest of the form.
  const consultKey = consult ? `${consult.serviceId}:${consult.topic}` : "";
  const [syncedConsultKey, setSyncedConsultKey] = useState(consultKey);
  if (consultKey !== syncedConsultKey) {
    setSyncedConsultKey(consultKey);
    if (consult) setValues((v) => ({ ...v, service: consult.serviceId }));
  }

  const serviceLabel =
    values.service === OTHER_SERVICE
      ? "Otro / por definir"
      : services.find((s) => s.id === values.service)?.name ?? "Sin especificar";

  const messagePlaceholder =
    consult?.topic === "materiales"
      ? "Material o especificación, si tienes plano, modelo o muestra, cantidad y uso de la pieza…"
      : "Pieza, equipo o proyecto; cantidades, plazos y si cuentas con planos, modelos o muestras…";

  const update = (field: keyof Values) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (field in errors) setErrors((e) => ({ ...e, [field]: undefined }));
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const payload = normalizeContact({ ...values, submissionId: (submissionId.current ||= newSubmissionId()) });
    const found = validateContact(payload);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };

      if (response.ok && result.ok) {
        setStatus("sent");
      } else if (result.error === "validation" && result.errors) {
        setErrors(result.errors);
        setStatus("idle");
        return;
      } else if (result.error === "not_configured") {
        setStatus("unavailable");
      } else if (result.error === "rate_limited") {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    focusStatus();
  }

  function reset() {
    submissionId.current = "";
    setValues({ ...EMPTY, service: consult?.serviceId ?? "" });
    setErrors({});
    setStatus("idle");
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus());
  }

  if (status === "sent") {
    return (
      <div className="form-status form-status--success" ref={statusRef} tabIndex={-1} role="status">
        <span className="form-status__icon" aria-hidden="true">
          <CheckIcon size={20} />
        </span>
        <div>
          <p className="form-status__title">Solicitud enviada a TUNSA</p>
          <p>
            Tu mensaje sobre <strong>{serviceLabel}</strong> se entregó correctamente. La respuesta llegará a{" "}
            <strong>{values.email}</strong>.
          </p>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  const describedBy = (field: ContactField, hint?: string) =>
    [errors[field] ? `cf-${field}-error` : null, hint].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate aria-describedby="cf-required-note">
      <p id="cf-required-note" className="contact-form__note">
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> son obligatorios.
      </p>

      <div className="contact-form__row">
        <div className={`field${errors.name ? " field--invalid" : ""}`}>
          <label htmlFor="cf-name">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            required
            maxLength={limits.name}
            value={values.name}
            onChange={update("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
          {errors.name && <p id="cf-name-error" className="field__error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="cf-company">Empresa</label>
          <input
            id="cf-company"
            name="company"
            autoComplete="organization"
            maxLength={limits.company}
            value={values.company}
            onChange={update("company")}
          />
        </div>
      </div>

      <div className="contact-form__row">
        <div className={`field${errors.email ? " field--invalid" : ""}`}>
          <label htmlFor="cf-email">
            Correo <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={limits.email}
            value={values.email}
            onChange={update("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
          {errors.email && <p id="cf-email-error" className="field__error">{errors.email}</p>}
        </div>
        <div className={`field${errors.phone ? " field--invalid" : ""}`}>
          <label htmlFor="cf-phone">Teléfono</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={limits.phone}
            value={values.phone}
            onChange={update("phone")}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
          />
          {errors.phone && <p id="cf-phone-error" className="field__error">{errors.phone}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-service">Servicio de interés</label>
        <div className="select">
          <select id="cf-service" name="service" value={values.service} onChange={update("service")}>
            <option value="">Selecciona un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value={OTHER_SERVICE}>Otro / no estoy seguro</option>
          </select>
        </div>
      </div>

      <div className={`field field--grow${errors.message ? " field--invalid" : ""}`}>
        <label htmlFor="cf-message">
          {consult?.topic === "materiales" ? "Material y detalles de la pieza" : "¿Qué necesitas?"} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          required
          maxLength={limits.message}
          placeholder={messagePlaceholder}
          value={values.message}
          onChange={update("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
        />
        {errors.message && <p id="cf-message-error" className="field__error">{errors.message}</p>}
      </div>

      <div className="contact-form__trap" aria-hidden="true">
        <label htmlFor="cf-website">Sitio web</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update("website")} />
      </div>

      <div className="contact-form__footer">
        <button type="submit" className="btn btn--primary btn--lg" disabled={status === "sending"} aria-disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            "Enviar solicitud"
          )}
        </button>
        <a className="btn btn--ghost btn--lg" href={`tel:${company.phoneE164}`}>
          <PhoneIcon size={18} />
          Prefiero llamar
        </a>
      </div>

      <div ref={statusRef} tabIndex={-1} className="contact-form__status" aria-live="polite">
        {status === "sending" && <span className="sr-only">Enviando solicitud…</span>}
        {status === "unavailable" && (
          <div className="form-status form-status--warn" role="alert">
            <div>
              <p className="form-status__title">El envío desde la web aún no está activo</p>
              <p>Tu mensaje no se envió. Puedes mandarlo tal cual desde tu aplicación de correo.</p>
              <a className="btn btn--primary" href={mailtoFromValues(values, serviceLabel)}>
                <MailIcon size={16} />
                Abrir en mi correo
              </a>
            </div>
          </div>
        )}
        {status === "rate_limited" && (
          <div className="form-status form-status--warn" role="alert">
            <div>
              <p className="form-status__title">Demasiados intentos seguidos</p>
              <p>Espera unos minutos e inténtalo de nuevo, o escríbenos directamente.</p>
              <a className="btn btn--ghost" href={mailtoFromValues(values, serviceLabel)}>
                <MailIcon size={16} />
                Abrir en mi correo
              </a>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="form-status form-status--error" role="alert">
            <div>
              <p className="form-status__title">No pudimos enviar tu solicitud</p>
              <p>Revisa tu conexión y vuelve a intentarlo. Tus datos siguen en el formulario.</p>
              <div className="form-status__actions">
                <button type="submit" className="btn btn--primary">
                  Reintentar
                </button>
                <a className="btn btn--ghost" href={mailtoFromValues(values, serviceLabel)}>
                  <MailIcon size={16} />
                  Abrir en mi correo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
