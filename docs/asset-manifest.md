# Manifiesto de activos

Todas las imágenes del sitio son ilustraciones conceptuales creadas en código (SVG + CSS). No hay fotografías, videos, renders ni activos del sitio anterior. La interfaz las identifica con la etiqueta «Ilustración conceptual» y el pie de página aclara que no representan piezas, materiales ni equipos reales del taller.

No se generaron activos con Higgsfield ni con otro servicio de pago.

## Escenas por servicio

Registro: `src/scenes/index.ts`. Primitivas isométricas compartidas: `src/scenes/iso.tsx`. Gradientes y sombras globales: `src/scenes/SceneDefs.tsx` (montado una vez en `layout.tsx`).

| Servicio | Archivo | Etapas (`step` 0–3) | Qué representa |
| --- | --- | --- | --- |
| Fabricación | `FabricacionScene.tsx` | Definición → Corte → Mecanizado → Inspección | Un bloque recibe contorno, luego perforaciones y termina como pieza con verificación |
| Mantenimiento | `MantenimientoScene.tsx` | Evaluación → Desmontaje → Intervención → Verificación | Conjunto mecánico que se separa, muestra el componente intervenido y se reensambla |
| Maquinado | `MaquinadoScene.tsx` | Preparación CAD/CAM → Mecanizado → Acabado → Inspección | Trayectoria de herramienta en plano translúcido, retiro de material y pieza terminada |
| Fixture | `FixtureScene.tsx` | Definición → Componentes → Ensamble → Verificación | Placa base, localizadores y sujeción que se ensamblan sobre una pieza de referencia |
| Integración | `IntegracionScene.tsx` | Definición → Ensamble → Programación → Pruebas | Módulo isométrico con conexiones neumáticas/control y activación secuencial |

Las escenas reciben `step` y cambian la operación representada en cada etapa. Las transiciones son CSS (`transform`/`opacity`); con `prefers-reduced-motion` se muestran estáticas en el estado de la etapa.

Los iconos de servicio y de categorías de equipo (`src/components/icons.tsx`) son SVG propios.

## Registro de medios por etapa

`src/content/media.ts` crea un `MediaAsset` por etapa (20 en total), hoy todos con:

```ts
{ kind: "illustration", status: "conceptual" }
```

## Sustituir una etapa por video

1. Obtener el video del cliente (o uno aprobado por TUNSA) y confirmar derechos de uso.
2. Exportar MP4 (H.264) y, opcionalmente, WebM; sin audio, de 4–8 s, recortado al encuadre cuadrado del panel (≈ 1:0.9) y de preferencia ≤ 1,5 MB. Exportar también un póster JPG/WebP del primer cuadro.
3. Guardar en `public/media/`, por ejemplo `public/media/maquinado-mecanizado.mp4` y `.jpg`.
4. En `src/content/media.ts`, para ese `stepId`, definir:

   ```ts
   { kind: "video", status: "approved", src: "/media/maquinado-mecanizado.mp4", poster: "/media/maquinado-mecanizado.jpg" }
   ```

`ProcessScene` reproduce el video solo con `kind: "video"`, `status: "approved"` y `src` definido: `muted`, `playsInline`, `preload="none"`, en pausa cuando el recorrido está pausado o la sección no es visible. Si el archivo falla, vuelve a la ilustración y registra un aviso en consola. Solo se carga el video de la etapa activa del servicio visible; no se descargan los cinco a la vez.

## Fuentes tipográficas

IBM Plex Sans e IBM Plex Mono, autoalojadas mediante `@fontsource` (licencia SIL Open Font License 1.1).

## Referencia

`references/ui_layout.png`: referencia de composición entregada por el cliente. Solo se usó como guía de composición; no se reutilizaron su logo, textos, métricas ni gráficas.

## Antes de producción

- Si TUNSA aporta fotos o videos del taller, validar derechos y que representen equipo real antes de sustituir las ilustraciones.
- No usar imágenes del sitio anterior por hotlinking.
- Imagen Open Graph: no existe; crear una cuando se defina el dominio.
