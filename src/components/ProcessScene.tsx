"use client";

import { memo, useEffect, useRef, useState } from "react";
import { scenes } from "@/scenes";
import type { StepView } from "@/content/selectors";

interface Props {
  serviceName: string;
  sceneKey: string;
  step: number;
  current: StepView;
  playing: boolean;
}

const Illustration = memo(function Illustration({ sceneKey, step, playing }: { sceneKey: string; step: number; playing: boolean }) {
  const Scene = scenes[sceneKey];
  if (!Scene) return null;
  return (
    <svg
      className="scene-svg"
      viewBox="0 48 520 472"
      preserveAspectRatio="xMidYMid meet"
      data-step={step}
      data-playing={playing}
      aria-hidden="true"
      focusable="false"
    >
      <Scene step={step} />
    </svg>
  );
});

function StepVideo({ src, poster, playing, onFail }: { src: string; poster?: string; playing: boolean; onFail: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) video.play().catch(() => video.pause());
    else video.pause();
  }, [playing, src]);

  return (
    <video
      ref={ref}
      className="scene-video"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="none"
      onError={() => {
        console.warn(`[ProcessScene] No se pudo cargar el video ${src}; se muestra la ilustración.`);
        onFail();
      }}
      aria-hidden="true"
    />
  );
}

export function ProcessScene({ serviceName, sceneKey, step, current, playing }: Props) {
  const [failedVideos, setFailedVideos] = useState<Set<string>>(() => new Set());
  const video = current.video && !failedVideos.has(current.video.src) ? current.video : null;

  return (
    <div className="scene__canvas" role="img" aria-label={`Ilustración conceptual de ${serviceName}: etapa ${current.name}.`}>
      {video ? (
        <StepVideo
          key={video.src}
          src={video.src}
          poster={video.poster}
          playing={playing}
          onFail={() => setFailedVideos((prev) => new Set(prev).add(video.src))}
        />
      ) : (
        <Illustration sceneKey={sceneKey} step={step} playing={playing} />
      )}
    </div>
  );
}
