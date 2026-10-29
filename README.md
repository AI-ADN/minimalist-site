# TUNSA · Talleres Unidos — sitio corporativo

Catálogo industrial de una sola página con cinco capítulos (Fabricación, Mantenimiento, Maquinado, Fixture e Integración), seguidos de Nosotros y Contacto. Cada capítulo combina una escena isométrica animada, un timeline del recorrido del proceso y tarjetas de materiales y equipo sincronizadas con la etapa activa.

El sitio no está publicado. Es un prototipo funcional pendiente de validación de contenido por TUNSA (ver [`docs/content-audit.md`](docs/content-audit.md)).

## Requisitos

- Node.js 20.9 o superior
- npm

## Comandos

```sh
npm install        # instalar dependencias (usa package-lock.json)
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run build      # build de producción (página estática prerenderizada)
npm run start      # servir el build de producción
npm run typecheck  # comprobación de tipos
npm run lint       # ESLint
```

La página se prerenderiza como estática. El formulario de contacto envía a la ruta de servidor `POST /api/contacto`, así que el despliegue necesita un hosting que ejecute Next.js (no `output: "export"`).

### Formulario de contacto (pendiente de configurar)

La ruta valida los datos en servidor, descarta envíos con el campo trampa, limita a 5 envíos por IP cada 10 minutos (en memoria, por instancia) y entrega el mensaje por correo mediante la API REST de [Resend](https://resend.com/docs/api-reference/emails/send-email), con `reply_to` al correo del visitante y una `Idempotency-Key` por envío para evitar duplicados.

Copia `.env.example` a `.env.local` y define:

| Variable | Uso |
| --- | --- |
| `RESEND_API_KEY` | Clave privada de Resend (solo servidor). |
| `CONTACT_TO_EMAIL` | Destinatario(s) en TUNSA, separados por coma. |
| `CONTACT_FROM_EMAIL` | Remitente de un dominio verificado en Resend, p. ej. `Sitio TUNSA <web@dominio>`. |

Sin estas variables la ruta responde `503 not_configured` y la interfaz lo dice claramente: el mensaje **no** se envía y se ofrece abrirlo en la aplicación de correo del visitante con los datos ya escritos. Para usar otro proveedor, sustituye solo la llamada `fetch` de `src/app/api/contacto/route.ts`.

## Estructura

```text
src/
  app/            layout (metadata, JSON-LD, fuentes), página y estilos globales
  components/     SiteHeader, ServiceNav, ServiceSection, ServiceStage, ProcessScene,
                  ProcessTimeline, ServiceDetails, MaterialsCard, EquipmentCard,
                  AboutSection, ContactSection, ExperienceProvider
  content/        datos: servicios, procesos, equipo, empresa, fuentes y medios
  scenes/         escenas SVG isométricas por servicio y primitivas (iso.tsx)
  lib/            utilidades de contacto y movimiento reducido
docs/
  content-audit.md   procedencia y estado de cada dato
  asset-manifest.md  activos visuales y cómo sustituirlos
references/          imagen de referencia de composición
```

## Editar contenido

Todo el texto y las relaciones viven en `src/content/`; no hace falta tocar componentes.

- **Servicios y etapas:** `services.ts`. Cada etapa tiene `id` estable, descripción, `sceneKey`, referencias a procesos y equipos, y un `equipmentGap` cuando no hay equipo publicado.
- **Equipo:** `equipment.ts`. **Procesos:** `processes.ts`. **Datos de empresa y contacto:** `company.ts`.
- Cada dato y cada relación llevan `evidence: { status: "published" | "proposed" | "unknown", sourceUrls }`. Al validar algo con TUNSA, cambia su estado a `published` y añade la fuente.
- **Materiales:** hoy están vacíos con estado `unknown`. Si TUNSA confirma una lista, llena `materials.items` del servicio y cambia el estado; la tarjeta mostrará la lista.

### Añadir un servicio

1. Agrega el objeto en `services.ts` (con sus etapas).
2. Crea su escena en `src/scenes/` y regístrala en `src/scenes/index.ts`.
3. Si usa un icono nuevo, añádelo en `src/components/icons.tsx`.

La sección, el timeline, la navegación lateral y la barra móvil se generan automáticamente.

## Comportamiento

- Scroll vertical normal del documento con Lenis (una instancia, limpiada al desmontar). Sin scroll-snap ni secuestro de teclas.
- La barra lateral (escritorio) y la barra horizontal (móvil) marcan el servicio visible, desplazan compensando el header y registran el hash en el historial. Atrás/adelante y abrir un hash directo funcionan.
- El recorrido avanza solo en el servicio visible (≈5,2 s por etapa), se pausa al salir de la sección y se detiene en la última etapa. Elegir una etapa pausa el avance; reanudar requiere pulsar Reproducir.
- Con `prefers-reduced-motion`: sin autoplay ni scroll suavizado, escenas estáticas y pasos manuales.
- «Consultar este servicio» lleva a Contacto con `?servicio=`: preselecciona el servicio en el formulario y prepara el asunto de los enlaces de correo.
- Cada capítulo tiene un tono de color propio (`[data-tone]` en `globals.css`): acento, paneles y escena se tiñen con él, y el marco (lienzo, header y rail) adopta el tono del capítulo que se está leyendo. Los degradados de acento de las escenas SVG leen las mismas variables, así que para cambiar un color basta editar su bloque `[data-tone]`.

## Validación realizada

- `npm run typecheck`, `npm run lint` y `npm run build`: sin errores.
- Navegador (servidor de desarrollo): navegación por rail y header a los siete destinos, offset bajo el header, atrás/adelante, clic en etapas (cambian escena, texto y equipo, y se pausa el autoplay), avance automático y anchos 390, 920, 1024, 1280 y 1440 px sin desplazamiento horizontal global.
- No verificado: lectores de pantalla reales, zoom al 200 % en todos los capítulos, Core Web Vitals con datos de campo, y Safari/Firefox.

## Pendientes antes de lanzar

Ver la sección «Pendientes de validación» en [`docs/content-audit.md`](docs/content-audit.md). En resumen: reconfirmar contacto, validar los recorridos y asignaciones de equipo propuestos, obtener lista de materiales, definir dominio/URL canónica y sustituir las ilustraciones por material del taller si TUNSA lo aporta.
