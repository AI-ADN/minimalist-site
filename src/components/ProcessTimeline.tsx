"use client";

import type { CSSProperties } from "react";
import type { StepView } from "@/content/selectors";
import { CheckIcon, ChevronLeft, ChevronRight, PauseIcon, PlayIcon, ReplayIcon } from "./icons";

interface Props {
  serviceId: string;
  steps: StepView[];
  current: number;
  playing: boolean;
  intentPlaying: boolean;
  finished: boolean;
  reducedMotion: boolean;
  showRouteNote: boolean;
  onSelect: (index: number) => void;
  onToggle: () => void;
  onAdvance: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ProcessTimeline({
  serviceId,
  steps,
  current,
  playing,
  intentPlaying,
  finished,
  reducedMotion,
  showRouteNote,
  onSelect,
  onToggle,
  onAdvance,
}: Props) {
  const last = steps.length - 1;
  const toggleLabel = finished ? "Repetir recorrido" : intentPlaying ? "Pausar recorrido" : "Reproducir recorrido";
  const headingId = `${serviceId}-timeline`;

  return (
    <section className="area-timeline card timeline" aria-labelledby={headingId}>
      <div className="card__head">
        <h3 id={headingId} className="card__title">
          Recorrido del proceso
        </h3>
        <div className="timeline__controls">
          <button type="button" className="icon-btn" onClick={() => onSelect(current - 1)} disabled={current === 0} aria-label="Etapa anterior">
            <ChevronLeft />
          </button>
          {!reducedMotion && (
            <button type="button" className="icon-btn icon-btn--primary" onClick={onToggle} aria-label={toggleLabel} title={toggleLabel}>
              {finished ? <ReplayIcon /> : intentPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          )}
          <button type="button" className="icon-btn" onClick={() => onSelect(current + 1)} disabled={current === last} aria-label="Etapa siguiente">
            <ChevronRight />
          </button>
        </div>
      </div>

      <ol className="ports" style={{ "--cols": steps.length } as CSSProperties}>
        {steps.map((s, i) => {
          const done = i < current || (finished && i === current);
          const state = done ? "done" : i === current ? "current" : "next";
          return (
            <li key={s.id} className="ports__item">
              <button
                type="button"
                className="port"
                data-state={state}
                aria-current={i === current ? "step" : undefined}
                onClick={() => onSelect(i)}
              >
                <span className="port__num" aria-hidden="true">
                  {done ? <CheckIcon size={13} /> : pad(i + 1)}
                </span>
                <span className="port__name">{s.name}</span>
                {done && <span className="sr-only"> (completada)</span>}
              </button>
              <span className="port__seg" data-done={done || undefined} aria-hidden="true">
                {i === current && !done && !reducedMotion && (
                  <span
                    key={`${current}-${finished}`}
                    className="port__fill"
                    style={{ animationPlayState: playing ? "running" : "paused" }}
                    onAnimationEnd={(e) => {
                      if (e.target === e.currentTarget) onAdvance();
                    }}
                  />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {showRouteNote && <p className="note">Secuencia ilustrativa; se define según el proyecto.</p>}
    </section>
  );
}
