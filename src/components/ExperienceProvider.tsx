"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import type { ConsultTopic } from "@/lib/contact";

interface ServiceMeta {
  id: string;
  name: string;
  stepCount: number;
}

interface Consult {
  serviceId: string;
  topic: ConsultTopic;
}

interface TimelineState {
  activeStepByService: Record<string, number>;
  isPlayingByService: Record<string, boolean>;
  finishedByService: Record<string, boolean>;
}

interface State extends TimelineState {
  activeSectionId: string | null;
  consult: Consult | null;
}

type Action =
  | { type: "setActiveSection"; id: string }
  | { type: "selectStep"; serviceId: string; index: number }
  | { type: "advance"; serviceId: string }
  | { type: "togglePlay"; serviceId: string }
  | { type: "setConsult"; consult: Consult | null };

function createReducer(stepCounts: Record<string, number>) {
  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "setActiveSection":
        return state.activeSectionId === action.id ? state : { ...state, activeSectionId: action.id };

      case "selectStep": {
        const last = stepCounts[action.serviceId] - 1;
        const index = Math.max(0, Math.min(last, action.index));
        return {
          ...state,
          activeStepByService: { ...state.activeStepByService, [action.serviceId]: index },
          isPlayingByService: { ...state.isPlayingByService, [action.serviceId]: false },
          finishedByService: { ...state.finishedByService, [action.serviceId]: false },
        };
      }

      case "advance": {
        const id = action.serviceId;
        const current = state.activeStepByService[id] ?? 0;
        if (current < stepCounts[id] - 1) {
          return { ...state, activeStepByService: { ...state.activeStepByService, [id]: current + 1 } };
        }
        return {
          ...state,
          isPlayingByService: { ...state.isPlayingByService, [id]: false },
          finishedByService: { ...state.finishedByService, [id]: true },
        };
      }

      case "togglePlay": {
        const id = action.serviceId;
        const playing = state.isPlayingByService[id] ?? true;
        if (playing) {
          return { ...state, isPlayingByService: { ...state.isPlayingByService, [id]: false } };
        }
        if (state.finishedByService[id]) {
          return {
            ...state,
            activeStepByService: { ...state.activeStepByService, [id]: 0 },
            isPlayingByService: { ...state.isPlayingByService, [id]: true },
            finishedByService: { ...state.finishedByService, [id]: false },
          };
        }
        return { ...state, isPlayingByService: { ...state.isPlayingByService, [id]: true } };
      }

      case "setConsult":
        return { ...state, consult: action.consult };
    }
  };
}

interface Actions {
  selectStep: (serviceId: string, index: number) => void;
  advance: (serviceId: string) => void;
  togglePlay: (serviceId: string) => void;
  clearConsult: () => void;
}

const ActiveSectionContext = createContext<string | null>(null);
const TimelineContext = createContext<TimelineState | null>(null);
const ConsultContext = createContext<{ consult: Consult | null; serviceNames: Record<string, string> } | null>(null);
const ActionsContext = createContext<Actions | null>(null);

function useRequired<T>(ctx: React.Context<T | null>, name: string): T {
  const value = useContext(ctx);
  if (value === null) throw new Error(`${name} debe usarse dentro de ExperienceProvider`);
  return value;
}

export const useActiveSection = () => useContext(ActiveSectionContext);
export const useTimeline = () => useRequired(TimelineContext, "useTimeline");
export const useConsult = () => useRequired(ConsultContext, "useConsult");
export const useExperienceActions = () => useRequired(ActionsContext, "useExperienceActions");

/** Bottom edge of the horizontal sticky bars (topbar, and the service bar on small screens). */
function anchorOffset() {
  let bottom = 0;
  document.querySelectorAll<HTMLElement>("[data-topbar]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > rect.height && rect.top < 160) bottom = Math.max(bottom, rect.bottom);
  });
  return bottom + 12;
}

function focusTarget(target: HTMLElement) {
  const focusable = target.querySelector<HTMLElement>("[data-anchor-focus]") ?? target;
  if (!focusable.hasAttribute("tabindex") && focusable.tabIndex < 0) focusable.setAttribute("tabindex", "-1");
  focusable.focus({ preventScroll: true });
}

export function ExperienceProvider({ services, children }: { services: ServiceMeta[]; children: ReactNode }) {
  const stepCounts = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.stepCount])), [services]);
  const serviceNames = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.name])), [services]);
  const reducer = useMemo(() => createReducer(stepCounts), [stepCounts]);

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    activeSectionId: null,
    activeStepByService: {},
    isPlayingByService: {},
    finishedByService: {},
    consult: null,
  }));

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    lenisRef.current = lenis;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const syncConsultFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get("servicio");
      if (serviceId && serviceId in stepCounts) {
        dispatch({
          type: "setConsult",
          consult: { serviceId, topic: params.get("motivo") === "materiales" ? "materiales" : "servicio" },
        });
      } else {
        dispatch({ type: "setConsult", consult: null });
      }
    };

    const scrollToTarget = (target: HTMLElement, immediate = false) => {
      // Numeric target: Lenis would otherwise add CSS scroll-margin/scroll-padding (kept for the no-JS fallback) on top of the measured offset.
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - anchorOffset());
      if (lenisRef.current) {
        lenisRef.current.scrollTo(top, { immediate, duration: 1.1 });
      } else {
        window.scrollTo({ top });
      }
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const next = `${url.pathname}${url.search}${url.hash}`;
      if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.pushState(null, "", next);
      }
      syncConsultFromUrl();
      scrollToTarget(target);
      focusTarget(target);
    };

    const onPopState = () => {
      syncConsultFromUrl();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) scrollToTarget(target, true);
    };

    syncConsultFromUrl();
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, [stepCounts]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) intersecting.add(id);
          else intersecting.delete(id);
        }
        // Gaps between sections keep the previous value to avoid flicker.
        const first = sections.find((s) => intersecting.has(s.id));
        if (first) dispatch({ type: "setActiveSection", id: first.id });
      },
      { rootMargin: "-38% 0px -58% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const actions = useMemo<Actions>(
    () => ({
      selectStep: (serviceId, index) => dispatch({ type: "selectStep", serviceId, index }),
      advance: (serviceId) => dispatch({ type: "advance", serviceId }),
      togglePlay: (serviceId) => dispatch({ type: "togglePlay", serviceId }),
      clearConsult: () => {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
        dispatch({ type: "setConsult", consult: null });
      },
    }),
    [],
  );

  const timeline = useMemo<TimelineState>(
    () => ({
      activeStepByService: state.activeStepByService,
      isPlayingByService: state.isPlayingByService,
      finishedByService: state.finishedByService,
    }),
    [state.activeStepByService, state.isPlayingByService, state.finishedByService],
  );

  const consult = useMemo(() => ({ consult: state.consult, serviceNames }), [state.consult, serviceNames]);

  return (
    <ActionsContext.Provider value={actions}>
      <ActiveSectionContext.Provider value={state.activeSectionId}>
        <TimelineContext.Provider value={timeline}>
          <ConsultContext.Provider value={consult}>{children}</ConsultContext.Provider>
        </TimelineContext.Provider>
      </ActiveSectionContext.Provider>
    </ActionsContext.Provider>
  );
}
