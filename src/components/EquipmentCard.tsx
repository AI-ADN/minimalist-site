"use client";

import { useEffect, useRef, useState } from "react";
import { equipmentCategoryLabel } from "@/content/equipment";
import type { EquipmentView, StepView } from "@/content/selectors";
import { ChevronDown, EquipmentGlyph } from "./icons";

interface Props {
  serviceId: string;
  step: StepView;
  routeEquipment: EquipmentView[];
}

function EquipmentList({ items, compact }: { items: EquipmentView[]; compact?: boolean }) {
  return (
    <ul className={compact ? "equip-list equip-list--compact" : "equip-list"}>
      {items.map((item) => (
        <li key={item.id} className="equip">
          <span className="equip__icon" aria-hidden="true">
            <EquipmentGlyph category={item.category} size={compact ? 15 : 16} />
          </span>
          <span className="equip__name">
            {item.name}
            <span className="sr-only">, {equipmentCategoryLabel[item.category]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function EquipmentCard({ serviceId, step, routeEquipment }: Props) {
  const headingId = `${serviceId}-equipment`;
  const hasProposed = step.equipment.some((e) => e.isProposed);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const details = detailsRef.current;
    if (!open || !details) return;
    const close = () => {
      details.open = false;
    };
    const onPointer = (e: PointerEvent) => {
      if (!details.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      details.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="card equipment" aria-labelledby={headingId}>
      <div className="card__head">
        <h3 id={headingId} className="card__title">
          Equipo de la etapa
        </h3>
        {routeEquipment.length > 0 && (
          <details ref={detailsRef} className="route" onToggle={(e) => setOpen(e.currentTarget.open)}>
            <summary className="route__toggle">
              Recorrido ({routeEquipment.length})
              <ChevronDown size={14} />
            </summary>
            <div className="route__panel">
              <p className="route__title">Equipo de todo el recorrido</p>
              <EquipmentList items={routeEquipment} compact />
            </div>
          </details>
        )}
      </div>

      <div className="equipment__body" key={step.id}>
        {step.equipment.length > 0 ? (
          <>
            <EquipmentList items={step.equipment} />
            {hasProposed && <p className="note">Equipo propuesto para este recorrido.</p>}
          </>
        ) : (
          <p className="muted">{step.equipmentGap ?? "Equipo por definir según el proyecto."}</p>
        )}
      </div>
    </section>
  );
}
