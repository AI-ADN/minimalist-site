# Auditoría de contenido

Revisión de fuentes: 28 de octubre de 2026. Los datos y su estado viven en `src/content/`; este documento resume su procedencia y lo pendiente. La interfaz pública no muestra estados ni URLs.

## Estados

| Estado | Significado |
| --- | --- |
| `published` | Aparece en la web consultada. No confirma que la capacidad o el equipo sigan vigentes. |
| `proposed` | Hipótesis editorial o técnica del prototipo, pendiente de validación de TUNSA. |
| `unknown` | No disponible. No se completa con datos plausibles. |

## Fuentes

| Clave | URL | Uso |
| --- | --- | --- |
| servicios | https://talleresunidos.com/servicios.html | Alcance de los cinco servicios |
| procesos | https://talleresunidos.com/procesos.html | Cuatro procesos visibles |
| maquinaria | https://talleresunidos.com/maquinaria-y-equipo.html | Inventario de equipo e inspección |
| maquinariaMovil | https://talleresunidos.com/phone/maquinaria-y-equipo.html | Inventario complementario |
| nosotros | https://talleresunidos.com/nosotros.html | Perfil, ubicación, año de inicio |
| contacto | https://talleresunidos.com/contacto.html | Correo, teléfono y dirección |

Algunas páginas indexadas conservan contenido antiguo.

## Empresa y contacto — `published`

| Dato | Valor en el sitio | Fuente |
| --- | --- | --- |
| Razón social | Talleres Unidos S.A. de C.V. | nosotros |
| Sector y ubicación | Metalmecánico; San Nicolás de los Garza, Nuevo León | nosotros |
| Inicio de actividad | «Desde 1984» (no se reutiliza «más de 35 años») | nosotros |
| Correo | tunsa@talleresunidos.com | contacto |
| Teléfono | (81) 8351 9819 → `tel:+528183519819` | contacto |
| Dirección | 4a Avenida 509, Col. Garza Cantú, San Nicolás de los Garza, N.L., 66480, México | contacto |

Reconfirmar todos antes del lanzamiento. No se asume que el teléfono admite WhatsApp. Los datos estructurados (`LocalBusiness` en `layout.tsx`) solo incluyen estos hechos, sin reseñas ni calificaciones.

## Servicios — alcance `published`, redacción propia

| Servicio | Alcance publicado | Notas |
| --- | --- | --- |
| Fabricación | Refacciones industriales; producción y afilado de cuchillas; desarrollo de maquinaria y dispositivos | — |
| Mantenimiento | Reparación de piezas; equipos mecánicos, hidráulicos y neumáticos | — |
| Maquinado | Trabajo CAD/CAM; mecanizado de piezas industriales | Software CAD/CAM: `unknown` |
| Fixture | Herramientas de usos múltiples | No se afirman especialidades más concretas |
| Integración | Ensambles neumáticos, electrónica y programación | Marcas de controladores y bancos de prueba: `unknown` |

Las introducciones de cada servicio son redacción nueva (35–55 palabras) que explica el alcance publicado sin ampliarlo.

## Procesos

| Proceso | Detalle | Estado |
| --- | --- | --- |
| Torneado | CNC y convencional | `published` (procesos) |
| Fresado | Convencional y centro de maquinado CNC | `published` (procesos) |
| Rectificado | Plano y cilíndrico | `published` (procesos) |
| Soldadura | Microalambre, TIG, eléctrica y autógena | `published` (procesos) |
| Inspección | Instrumentos y brazo ROMER | `published` (maquinaria) |
| Corte | Waterjet o plasma, según proyecto | `proposed`: inferido del equipo publicado; no aparece en la página de procesos |

La página de procesos salta de la entrada 2 a la 5; no se reconstruyen las entradas 3 y 4. La sección Nosotros solo muestra los cuatro procesos de esa página. Soldadura no se insertó en ningún recorrido.

## Equipo — `published` (maquinaria, maquinariaMovil)

Waterjet Mitsubishi; equipo ESAB de corte por agua y plasma; cortadora de plasma ESAB; cortadoras horizontales y vertical; centros HAAS VF3, VF5 y VF7; fresadoras horizontales convencionales #2 y #3; tornos convencionales; rectificadoras planas (incluida una Okamoto) y cilíndricas; brazo ROMER; instrumentos y calibradores de inspección; roscadoras neumáticas; prensa tipo H; prensa de cortina; roladora mecánica; sand blaster; grúas y montacargas (apoyo logístico, no proceso de fabricación).

No se usan: las dimensiones de los tornos (notación ambigua), un modelo de torno CNC (no publicado) ni marcas o modelos de soldadoras (no publicados). No se publican cantidades de máquinas.

## Recorridos por servicio — `proposed`

Todas las secuencias son ilustrativas y la interfaz lo indica («Secuencia ilustrativa; se define según el proyecto»). Las asignaciones de equipo a etapas son `proposed` aunque cada máquina sea `published`; la tarjeta las presenta como «Equipo propuesto para este recorrido».

| Servicio | Etapa | Equipo asignado / hueco declarado |
| --- | --- | --- |
| Fabricación | Definición | Sin equipo de producción |
| | Corte | Waterjet Mitsubishi, ESAB agua/plasma, plasma ESAB |
| | Mecanizado | HAAS VF, fresadoras horizontales, tornos convencionales |
| | Inspección | ROMER, instrumentos de inspección |
| Mantenimiento | Evaluación | Herramientas de diagnóstico no publicadas |
| | Desmontaje | Herramientas de desmontaje no publicadas |
| | Intervención | Tornos convencionales, rectificadoras cilíndricas y planas |
| | Verificación | Instrumentos de inspección |
| Maquinado | Preparación CAD/CAM | Software no publicado |
| | Mecanizado | HAAS VF, fresadoras horizontales, tornos convencionales |
| | Acabado | Rectificadoras planas y cilíndricas |
| | Inspección | Instrumentos de inspección, ROMER |
| Fixture | Definición | Sin equipo de producción |
| | Fabricación de componentes | HAAS VF, fresadoras horizontales, roscadoras neumáticas |
| | Ensamble | Equipo de ensamble no publicado |
| | Verificación | Instrumentos de inspección |
| Integración | Definición, Ensamble, Programación, Pruebas | Ningún equipo publicado; no se atribuyen marcas de PLC, robots ni bancos de prueba |

## Materiales — `unknown`

No se encontró una lista explícita en servicios, procesos ni maquinaria. Las cinco tarjetas muestran «Materiales y especificaciones por confirmar para cada proyecto» y el CTA «Consultar compatibilidad». Las escenas no representan el material real trabajado.

## Contacto en la interfaz

- «Enviar correo» abre `mailto:` con el asunto preparado; si se llega desde un servicio, incluye su nombre (codificado). No hay formulario ni confirmación simulada.
- «Llamar» usa `tel:`. «Ver en mapa» abre una búsqueda de Google Maps con la dirección publicada.

## Pendientes de validación con TUNSA

1. Reconfirmar correo, teléfono y dirección.
2. Validar o corregir los cinco recorridos y las asignaciones de equipo por etapa.
3. Confirmar que el inventario publicado sigue vigente (o actualizarlo).
4. Confirmar si «Corte» debe figurar como proceso propio.
5. Proporcionar materiales y especificaciones que trabajan, si desean mostrarlos.
6. Software CAD/CAM, herramientas de diagnóstico y equipo de integración, si desean publicarlos.
7. Dominio definitivo para URL canónica, Open Graph, `sitemap` y `robots` (hoy no configurados).
8. Aprobación de los textos redactados para cada servicio y etapa.
