import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { company } from "@/content/company";
import { SceneDefs } from "@/scenes/SceneDefs";

const description =
  "Talleres Unidos (TUNSA), empresa metalmecánica en San Nicolás de los Garza, N.L., desde 1984: fabricación, mantenimiento, maquinado, fixture e integración de dispositivos industriales.";

export const metadata: Metadata = {
  title: "TUNSA · Talleres Unidos | Servicios metalmecánicos en Nuevo León",
  description,
  openGraph: {
    title: "TUNSA · Talleres Unidos",
    description,
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#292A28",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.legalName,
  alternateName: company.shortName,
  foundingDate: company.since,
  email: company.email,
  telephone: company.phoneE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.street}, ${company.address.neighborhood}`,
    addressLocality: company.address.locality,
    addressRegion: "Nuevo León",
    postalCode: company.address.postalCode,
    addressCountry: company.address.countryCode,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <SceneDefs />
        {children}
      </body>
    </html>
  );
}
