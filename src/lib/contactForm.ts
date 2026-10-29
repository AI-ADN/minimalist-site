export interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  /** Honeypot: humans never see or fill this field. */
  website: string;
  /** Client-generated id per submission; repeated clicks reuse it so the provider deduplicates. */
  submissionId: string;
}

export type ContactField = "name" | "email" | "phone" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const OTHER_SERVICE = "otro";

export const limits = { name: 120, company: 120, email: 160, phone: 30, message: 3000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{7,30}$/;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export function normalizeContact(input: Record<string, unknown>): ContactPayload {
  return {
    name: text(input.name, limits.name),
    company: text(input.company, limits.company),
    email: text(input.email, limits.email),
    phone: text(input.phone, limits.phone),
    service: text(input.service, 40),
    message: text(input.message, limits.message),
    website: text(input.website, 200),
    submissionId: text(input.submissionId, 80),
  };
}

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.length < 2) errors.name = "Escribe tu nombre.";
  if (!data.email) errors.email = "Escribe tu correo para poder responderte.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "Revisa el formato del correo (ejemplo: nombre@empresa.com).";
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = "Revisa el teléfono: solo números, espacios, +, ( ) o guiones.";
  if (data.message.length < 10) errors.message = "Describe brevemente la pieza, el equipo o el proyecto (mínimo 10 caracteres).";
  return errors;
}
