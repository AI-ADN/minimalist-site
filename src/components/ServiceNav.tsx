"use client";

import { useEffect, useRef } from "react";
import type { ServiceIcon } from "@/content/types";
import { useActiveSection } from "./ExperienceProvider";
import { ServiceGlyph } from "./icons";

interface Item {
  id: string;
  name: string;
  icon: ServiceIcon;
}

/** "rail" is the desktop sidebar; "bar" is the horizontal strip inside the mobile header. Only one is displayed. */
export function ServiceNav({ items, variant }: { items: Item[]; variant: "rail" | "bar" }) {
  const active = useActiveSection();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (variant !== "bar" || !list || list.scrollWidth <= list.clientWidth) return;
    const link = list.querySelector<HTMLElement>('[aria-current="location"]');
    if (!link) return;
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [active, variant]);

  return (
    <nav className={variant} aria-label="Servicios">
      <ol ref={listRef} className={`${variant}__list`}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={`${variant}__link`} aria-current={active === item.id ? "location" : undefined}>
              <ServiceGlyph name={item.icon} size={variant === "rail" ? 22 : 18} />
              {variant === "rail" && (
                <span className="rail__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <span className={`${variant}__label`}>{item.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
