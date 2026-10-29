import { SOURCES, published } from "./sources";

/** Datos publicados; reconfirmar con TUNSA antes del lanzamiento. */
export const company = {
  legalName: "Talleres Unidos S.A. de C.V.",
  shortName: "TUNSA",
  sector: "Sector metalmecánico",
  since: "1984",
  city: "San Nicolás de los Garza",
  state: "Nuevo León",
  email: "tunsa@talleresunidos.com",
  phoneDisplay: "(81) 8351 9819",
  phoneE164: "+528183519819",
  address: {
    street: "4a Avenida 509",
    neighborhood: "Col. Garza Cantú",
    locality: "San Nicolás de los Garza",
    region: "N.L.",
    postalCode: "66480",
    country: "México",
    countryCode: "MX",
  },
  evidence: {
    profile: published(SOURCES.nosotros),
    contact: published(SOURCES.contacto),
  },
} as const;

export const addressOneLine = `${company.address.street}, ${company.address.neighborhood}, ${company.address.locality}, ${company.address.region}, ${company.address.postalCode}, ${company.address.country}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOneLine)}`;
