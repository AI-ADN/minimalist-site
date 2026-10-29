"use client";

import type { ReactNode } from "react";
import { company } from "@/content/company";
import { useActiveSection } from "./ExperienceProvider";
import { MailIcon } from "./icons";

export function SiteHeader({ firstServiceId, children }: { firstServiceId: string; children?: ReactNode }) {
  const active = useActiveSection();

  return (
    <header className="topbar" data-topbar>
      <a className="brand" href={`#${firstServiceId}`} aria-label={`${company.shortName}, ${company.legalName}: ir al primer servicio`}>
        <span className="brand__text">
          <span className="brand__name">{company.shortName}</span>
          <span className="brand__legal">Talleres Unidos</span>
        </span>
      </a>
      <p className="topbar__tagline">Servicios metalmecánicos · {company.city}, N.L.</p>
      <nav className="topbar__nav" aria-label="Empresa">
        <a href="#nosotros" className="pill" aria-current={active === "nosotros" ? "location" : undefined}>
          Nosotros
        </a>
        <a href="#contacto" className="pill pill--dark" aria-current={active === "contacto" ? "location" : undefined}>
          <MailIcon size={16} />
          Contacto
        </a>
      </nav>
      {children}
    </header>
  );
}
