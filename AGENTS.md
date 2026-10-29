# TUNSA — instrucciones de implementación

## Objetivo
Crear un sitio corporativo en español para Talleres Unidos S.A. de C.V. con cinco capítulos navegables por scroll y por barra lateral: Fabricación, Mantenimiento, Maquinado, Fixture e Integración. La referencia visual vive en `/references` dentro del repositorio. Lee `prompt.md` antes de implementar.

La prioridad es: requisitos explícitos del usuario, veracidad del contenido, referencia visual, accesibilidad y rendimiento. Las skills orientan la ejecución; no deben reemplazar la dirección visual ni introducir funcionalidades ajenas.

## Dirección visual permanente
- Interpretar la referencia como una composición industrial editorial: marco grafito, superficie gris perla, navegación estrecha, objeto industrial protagonista a la izquierda, información a la derecha y dos tarjetas inferiores.
- Mantener abundante aire, alineaciones precisas, tipografía sans serif sobria, bordes finos y sombras suaves. Radios consistentes de 20–28 px en paneles y 10–14 px en controles.
- Paleta inicial: exterior #292A28, lienzo #DCDDD9, panel #E8E9E5, texto #20221F, texto secundario #555B52, acento verde oliva #587337. Son propuestas visuales, no colores oficiales certificados. Verificar contraste real.
- El verde conecta con la identidad observada de TUNSA. No copiar automáticamente el naranja y violeta de la referencia. Usar un solo acento dominante.
- No convertir el resultado en una landing genérica con hero gigante, tarjetas repetidas de beneficios, estadísticas inventadas, degradados vistosos, ruido visual o imágenes de stock irrelevantes.
- Los objetos representan operaciones industriales comprensibles; no torres futuristas ni máquinas ficticias presentadas como equipo real.
- La referencia es inspiración de composición. No reutilizar su logo, persona, textos, métricas ni gráficos de barras.

## Skills y responsabilidades
Si están instaladas, leer y aplicar:
1. `ui-ux-pro-max`: tokens, jerarquía, espaciado y comportamiento responsive, subordinados a la referencia.
2. `frontend-design` de Anthropic: composición y acabado visual. No debe proponer una estética alternativa que rompa el brief.
3. `web-design-guidelines` de Vercel: revisión final de interacción y accesibilidad.
4. `vercel-react-best-practices` de Vercel: rendimiento si se utiliza React/Next.js.
No detener la implementación si alguna falta; informar la ausencia y seguir este documento. No instalar paquetes de skills desconocidos ni afirmar haber usado una skill no disponible.

## Arquitectura
- Inspeccionar primero el proyecto. Preservar el stack y gestor existentes cuando sean adecuados.
- Si está vacío: Next.js App Router, TypeScript y CSS con variables o Tailwind, según facilite una implementación limpia. Usar versiones estables compatibles y lockfile.
- Componentes sugeridos: SiteHeader, ServiceNav, ServiceSection, ProcessScene, ProcessTimeline, ServiceDetails, MaterialsCard, EquipmentCard, AboutSection y ContactSection.
- Separar contenido, relaciones y presentación. Un componente de sección reutilizable debe renderizar los cinco servicios, sin duplicar cinco implementaciones.
- Contenido corporativo prerenderizado; convertir en componentes de cliente solamente las partes interactivas.
- Lenis para scroll suave progresivo. Una sola instancia y un solo bucle de actualización, con limpieza al desmontar. Consultar su documentación oficial para la versión instalada.
- Para microinteracciones, CSS; para escenas y transiciones más complejas, Motion si aporta valor. No añadir simultáneamente GSAP, Motion y otro motor para el mismo trabajo.
- Una primera versión con SVG/CSS animado bien diseñado es preferible a cargar un motor 3D para formas sencillas. WebGL queda como mejora opcional si hay modelos adecuados y presupuesto de rendimiento.

## Integridad de contenido
Cada dato y relación debe incluir internamente `status: published | proposed | unknown` y `sourceUrls`. Una máquina publicada no implica que su relación con un servicio esté confirmada.
- `published`: aparece en la web consultada; no equivale a inventario vigente confirmado.
- `proposed`: hipótesis editorial o técnica para el prototipo, pendiente de validación de TUNSA.
- `unknown`: no disponible; no completar con datos plausibles inventados.
- Mantener por separado catálogo de servicios, catálogo de procesos, catálogo de equipos y relaciones entre ellos. Las relaciones son muchos a muchos; no asignar toda la maquinaria a todos los servicios.
- Materiales, aleaciones, tolerancias, certificaciones, modelos no publicados, cantidades de máquinas y plazos: no inventar.
- No convertir capacidades de prensa o dimensiones de mesa en tolerancias de fabricación.
- No inferir un modelo de torno CNC a partir de que el sitio mencione torneado CNC.
- No completar los números faltantes de la lista antigua de procesos por intuición.
- En el prototipo, los recorridos inferidos llevan una nota discreta: “Secuencia ilustrativa; se define según el proyecto”. Los equipos asociados por inferencia: “Equipo propuesto para este recorrido”.
- Los materiales desconocidos muestran: “Materiales y especificaciones por confirmar para cada proyecto”. No llenar las tarjetas con aluminio/acero/etc. como hechos comerciales.
- Guardar pendientes y procedencia en `docs/content-audit.md`. La UI no debe mostrar enums, JSON ni notas de implementación.
- No publicar automáticamente ni inventar testimonios, clientes, métricas de productividad o promesas de entrega inmediata.

## Navegación y estado
- Usar secciones reales en el DOM con IDs estables y enlaces con hash. Scroll vertical del documento, sin contenedores internos que atrapen la rueda.
- Barra lateral persistente en escritorio; botones con icono y nombre accesible. Mostrar etiqueta visible o tooltip en hover y foco.
- Marcar servicio activo al desplazarse; evitar parpadeos entre secciones con un criterio consistente de intersección.
- Clic en servicio desplaza a su inicio, compensa el header y respeta el historial. Abrir directamente un hash debe funcionar.
- No interceptar flechas, PageDown, Home/End ni gestos normales. Sin scroll-snap obligatorio ni secuestro de scroll.
- Separar `activeServiceId`, `activeStepByService` y `isPlayingByService`. Una única fuente de verdad por estado; timeline, escena, descripción y equipo de la etapa siempre sincronizados.
- La animación del proceso se reproduce automáticamente solo en el servicio visible, con botón Pausar/Reproducir. Cada etapa dura aproximadamente 5 segundos; el usuario puede elegir una etapa directamente, lo que pausa el avance automático. Reanudar requiere acción explícita.
- Al salir de una sección se pausa conservando el paso. Al volver no se reinicia ni se dispara sonido. Un ciclo termina en la pieza final y queda pausado, sin bucle obligatorio.
- El scroll cambia de servicio, no captura el progreso de cada etapa. Evitar que autoplay, scroll y clic compitan por el mismo estado.

## Movimiento y recursos
- Transiciones de interfaz: 180–300 ms. Cambio de escena: 400–650 ms, suave y sin flashes. Entrada de contenido: desplazamientos discretos de 8–16 px.
- No animar layout en cada frame ni renderizar React por cada píxel de scroll. Preferir transform/opacity y referencias cuando corresponda.
- Crear escenas distintas por servicio; cada etapa debe cambiar la operación representada, no únicamente girar el mismo objeto.
- Si hay videos locales aprobados: `muted`, `playsInline`, poster, tamaño reservado, carga diferida y pausa fuera de pantalla. Manejar fallo de reproducción o archivo ausente con escena SVG estática/animada coherente.
- No simular que existen videos, modelos, fotos o credenciales de generación. No usar URLs ficticias ni hotlinking de activos del sitio antiguo.
- Respetar `prefers-reduced-motion`: scroll nativo, sin autoplay ni paralaje; navegación manual por pasos y visual estático legible. Ofrecer pausa también en modo normal.
- Documentar en `docs/asset-manifest.md` qué activos son ilustraciones conceptuales y cómo sustituirlos por renders/videos del cliente.

Referencias de animaciones: 

- https://mx.pinterest.com/pin/987062443326485971/
- https://mx.pinterest.com/pin/127578601938520850/
- https://mx.pinterest.com/pin/127578601938443194/

Referencias de procesos industriales:

- https://mx.pinterest.com/pin/925137948461382641/
- https://mx.pinterest.com/pin/618189486372507678/
- https://mx.pinterest.com/pin/624100460891404594/

Puedes usar el plugin de higgsfield para crear estas animaciones, pero siempre tienes que preguntar cuanto costara para recibir autorizacion. Busca crear las animaciones con estetica estilo neumorphismn or claymorphism.

## Responsive y accesibilidad
- Escritorio: header y rail persistentes, escena/timeline a la izquierda y descripción/materiales/equipos a la derecha. No imponer altura fija que recorte contenido.
- Tablet: reducir espacios y reorganizar tarjetas sin perder jerarquía.
- Móvil: navegación horizontal de servicios con texto, scroll lateral solo en esa navegación; contenido de una columna en orden título, escena, timeline, descripción de etapa, materiales y maquinaria.
- Targets de al menos 44 px, foco visible, semántica correcta, enlace de salto, jerarquía de encabezados y contraste WCAG AA.
- No comunicar estado únicamente por color. Etiquetas accesibles para iconos; los pasos son botones dentro de una lista ordenada, con estado actual explícito.
- No anunciar continuamente el progreso automático a lectores de pantalla. Mantener acceso textual a la información del proceso.
- Probar teclado, zoom 200%, ancho 360 px y movimiento reducido.

## Nosotros, contacto y SEO
- Header: marca a la izquierda, “Nosotros” y “Contacto” a la derecha. Ambos llevan a secciones completas al final; no botones inertes.
- CTA por servicio: “Consultar este servicio”, dirige a contacto y conserva el contexto del servicio.
- Contacto inicial funcional mediante correo y teléfono publicados. Un enlace de correo debe decir “Enviar correo”, no simular un formulario enviado.
- Si no hay backend, no crear un formulario que diga “Mensaje enviado”. No asumir que un teléfono admite WhatsApp.
- Metadata, idioma es-MX, encabezados semánticos y texto indexable. Datos estructurados solo con hechos publicados y sin reseñas/ratings inventados.

## Validación y entrega
1. Ejecutar build, comprobación de tipos y lint disponibles; corregir errores atribuibles al cambio.
2. Probar los cinco enlaces de servicios, hashes directos, atrás/adelante, ambos enlaces del header y CTAs.
3. Probar que clic en una etapa actualiza escena, texto y equipos; pausa y movimiento reducido deben funcionar.
4. Revisar capturas a 1440×900, 1024×768 y 390×844 contra la referencia. Corregir solapamientos, cortes, textos diminutos y superficies excesivamente vacías.
5. Verificar que no hay recursos rotos, errores de consola, desplazamiento horizontal global ni descargas de cinco videos simultáneos.
6. Reportar pruebas ejecutadas y limitaciones reales. Nunca afirmar que una validación pasó si no se ejecutó.
7. Entregar implementación ejecutable, README con comandos, auditoría de contenido y manifiesto de activos. Continuar hasta completar los cinco servicios, no quedarse en un wireframe o en la primera sección.
