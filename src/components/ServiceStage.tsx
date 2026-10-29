"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ServiceView } from "@/content/selectors";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EquipmentCard } from "./EquipmentCard";
import { useExperienceActions, useTimeline } from "./ExperienceProvider";
import { MaterialsCard } from "./MaterialsCard";
import { ProcessScene } from "./ProcessScene";
import { ProcessTimeline } from "./ProcessTimeline";
import { ServiceDetails } from "./ServiceDetails";

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
const usePageVisible = () =>
  useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => false);

export function ServiceStage({ service }: { service: ServiceView }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const { activeStepByService, isPlayingByService, finishedByService } = useTimeline();
  const { selectStep, advance, togglePlay } = useExperienceActions();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const id = service.id;
  const current = activeStepByService[id] ?? 0;
  const intentPlaying = isPlayingByService[id] ?? true;
  const finished = finishedByService[id] ?? false;
  const playing = intentPlaying && !finished && !reducedMotion && inView && pageVisible;
  const step = service.steps[current];

  return (
    <div ref={ref} className="stage-grid" data-playing={playing || undefined}>
      <div className="stage-col">
        <div className="area-scene scene">
          <span className="scene__tag">Ilustración conceptual</span>
          <ProcessScene serviceName={service.name} sceneKey={service.sceneKey} step={current} current={step} playing={playing} />
        </div>

        <ProcessTimeline
          serviceId={id}
          steps={service.steps}
          current={current}
          playing={playing}
          intentPlaying={intentPlaying && !finished}
          finished={finished}
          reducedMotion={reducedMotion}
          showRouteNote={service.isIllustrativeRoute}
          onSelect={(i) => selectStep(id, i)}
          onToggle={() => togglePlay(id)}
          onAdvance={() => advance(id)}
        />
      </div>

      <div className="stage-col">
        <ServiceDetails service={service} step={step} stepIndex={current} announce={!playing} />

        <div className="area-cards">
          <MaterialsCard service={service} />
          <EquipmentCard serviceId={id} step={step} routeEquipment={service.routeEquipment} />
        </div>
      </div>
    </div>
  );
}
