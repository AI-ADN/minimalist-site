# Construye el nuevo sitio de Talleres Unidos — TUNSA

Actúa como diseñador senior de interfaces y desarrollador frontend. Implementa un sitio completo, responsive y ejecutable siguiendo `AGENTS.md`. Inspecciona primero el repositorio y la imagen de `/references`; no te limites a describir un plan. Si el proyecto está vacío, crea la base necesaria. No publiques el sitio automáticamente.

## Experiencia que quiero
Un catálogo industrial inmersivo con cinco capítulos: **Fabricación, Mantenimiento, Maquinado, Fixture e Integración**. Cada capítulo usa exactamente el mismo sistema de composición con información y escena propias. Todos existen en una página vertical: se llega a ellos con scroll normal o con la barra lateral. No quiero pestañas que oculten cuatro servicios del documento.

La imagen adjunta es la referencia principal de composición, materiales visuales, densidad y jerarquía. Puedes encontrarla dentro de `/references` aunque el nombre del archivo varíe. Analízala visualmente antes de implementar. Si no puedes abrirla, indícalo y usa la especificación siguiente sin afirmar que la viste.

## Traducción concreta de la referencia
| Elemento de la imagen | Implementación TUNSA |
| --- | --- |
| Marco oscuro y gran superficie gris clara | Contenedor corporativo sobrio, con bordes redondeados y espacio exterior |
| Navegación vertical izquierda | Cinco accesos a servicios, activos al desplazarse |
| Torre/objeto industrial | Escena animada del trabajo correspondiente al servicio |
| Port matrix debajo de la torre | Timeline interactivo del recorrido del proceso |
| Gran panel con gráfica de barras | Nombre del servicio, descripción breve y explicación de la etapa activa |
| Identification log | Materiales, con información honesta sobre lo que falta confirmar |
| Module port | Equipo relacionado con la etapa activa y vínculo para ver el equipo del recorrido |
| Buscador, notificaciones y avatar | Dos accesos: Nosotros y Contacto |

En escritorio, el rail ocupa aproximadamente 72–88 px. El espacio restante se divide en dos columnas: 44% visual/timeline y 56% información. El panel informativo superior y las dos tarjetas inferiores deben compartir alineaciones. El objeto industrial debe tener presencia suficiente para ser el protagonista, con fondo integrado al lienzo y sombras de contacto sutiles.

No copies textos, gráficas o indicadores ficticios de la imagen. No conviertas esto en un dashboard de métricas: es un sitio comercial de capacidades industriales. Evita una portada adicional que obligue a hacer scroll antes de conocer el primer servicio.

## Fuentes consultadas y límites
Revisión realizada el 28 de octubre de 2026. Algunas páginas indexadas conservan contenido antiguo; “publicado” significa encontrado en la web, no confirmado como capacidad vigente. La lectura directa en navegador permitió recuperar procesos que el buscador no mostraba.

- Servicios: https://talleresunidos.com/servicios.html
- Procesos: https://talleresunidos.com/procesos.html
- Maquinaria: https://talleresunidos.com/maquinaria-y-equipo.html
- Inventario móvil complementario: https://talleresunidos.com/phone/maquinaria-y-equipo.html
- Nosotros: https://talleresunidos.com/nosotros.html
- Contacto: https://talleresunidos.com/contacto.html

La web publica servicios y capacidades, pero **no documenta una matriz explícita servicio → secuencia → máquina → material**. La matriz siguiente es una propuesta de organización para el prototipo; no se debe presentar como el procedimiento operativo confirmado de TUNSA. Conserva las URLs en la auditoría interna, sin llenar la interfaz pública de referencias técnicas.

## Servicios publicados: contenido base
Reescribir con español claro, sin ampliar el alcance comercial:

1. **Fabricación:** refacciones industriales, producción y afilado de cuchillas, y desarrollo de maquinaria y dispositivos para diferentes aplicaciones.
2. **Mantenimiento:** reparación de piezas y atención a equipos mecánicos, hidráulicos y neumáticos.
3. **Maquinado:** trabajo CAD/CAM y mecanizado de piezas industriales.
4. **Fixture:** fabricación de herramientas de usos múltiples. No afirmar especialidades más concretas como hecho validado.
5. **Integración:** dispositivos de control que combinan ensambles neumáticos, electrónica y programación.

Los nombres Fixture e Integración se mantienen como capítulos independientes aunque parte de su alcance se solape con Fabricación.

## Procesos efectivamente visibles
La página de procesos muestra cuatro entradas: torneado CNC/convencional; fresado convencional y centro de maquinado CNC; rectificado plano/cilíndrico; y soldadura por microalambre, TIG, eléctrica y autógena. Su numeración salta de 2 a 5: no reconstruyas entradas 3 y 4 inventadas.

El corte se propone a partir del equipo publicado; la inspección sí aparece descrita en la página de maquinaria. Diseño, diagnóstico, montaje y pruebas son etapas editoriales sugeridas para explicar el servicio, no una secuencia publicada por el cliente.

## Catálogo compacto de equipo publicado
- Fresadoras horizontales convencionales #2 y #3.
- Centros HAAS VF3, VF5 y VF7.
- Tornos convencionales. Las dimensiones del sitio contienen notación ambigua: no reutilizarla sin validación.
- Rectificadoras planas y cilíndricas; se menciona una plana Okamoto.
- Corte Waterjet Mitsubishi; equipo ESAB de agua/plasma y cortadora de plasma ESAB.
- Brazo ROMER, instrumentos y calibradores de inspección.
- Roscadoras neumáticas, prensa tipo H, roladora mecánica, prensa de cortina, cortadoras horizontales/vertical y Sand blaster.
- Grúas y montacargas como apoyo logístico, sin presentarlos como procesos de fabricación.

No se identifica un modelo concreto de torno CNC ni marcas/modelos de soldadoras. No inventarlos. Las marcas anteriores pertenecen al inventario publicado; su asignación al flujo de un servicio sigue siendo propuesta.

## Matriz propuesta para el prototipo
Todas las secuencias y asignaciones de esta tabla tienen estado `proposed`. “Inspección” puede vincularse al catálogo publicado, pero su inclusión en un recorrido concreto no está confirmada.

| Servicio | Etapas ilustrativas, en orden | Equipo candidato por operación | Escena conceptual |
| --- | --- | --- | --- |
| Fabricación | Definición → Corte → Mecanizado → Inspección | Corte: Waterjet/plasma según proyecto; mecanizado: torno o fresadora/centro; inspección: instrumentos o ROMER | Un bloque adquiere contorno, luego perforaciones y termina como pieza industrial |
| Mantenimiento | Evaluación → Desmontaje → Intervención → Verificación | Intervención: torno/rectificadora cuando aplique; verificación: instrumentos. Herramientas de diagnóstico y desmontaje no especificadas | Conjunto mecánico que se separa, muestra un componente intervenido y se reensambla |
| Maquinado | Preparación CAD/CAM → Mecanizado → Acabado → Inspección | Mecanizado: HAAS o torno según geometría; acabado: rectificadora cuando aplique; inspección: instrumentos/ROMER | Trayectoria de herramienta, retirada conceptual de material y pieza terminada |
| Fixture | Definición → Fabricación de componentes → Ensamble → Verificación | Componentes: fresadora/centro y posible roscadora; verificación: instrumentos. Equipo de ensamble no especificado | Placa base, localizadores y elementos de sujeción que se ensamblan; ejemplo conceptual |
| Integración | Definición → Ensamble → Programación → Pruebas | Equipos específicos de integración no publicados. No adjudicar marcas de PLC, robots ni bancos de prueba | Esquema isométrico de módulo, conexiones neumáticas/control y activación secuencial |

No hacer pasar corte, torneado, fresado, soldadura y rectificado por una receta obligatoria aplicable a toda pieza. Son operaciones alternativas según proyecto. Soldadura queda en el catálogo publicado; no insertarla en todos los timelines solo para exhibirla.

Materiales: **no se encontró una lista explícita en las tres páginas revisadas**. Las cinco tarjetas deben conservar el espacio visual y mostrar “Materiales y especificaciones por confirmar para cada proyecto”, con CTA “Consultar compatibilidad”. No inventar aleaciones ni usar la escena ilustrativa como evidencia del material trabajado.

## Animación: debe existir una primera versión real
Crea escenas SVG/CSS animadas de buena calidad desde la primera entrega, diferentes para los cinco servicios. Dales profundidad mediante planos isométricos, volumen simple, metal mate, sombras discretas y una sola señal de acento. Las escenas son ilustraciones conceptuales y deben identificarse con una etiqueta discreta.

No dependas de que yo consiga videos para terminar el sitio. Prepara una interfaz de assets para sustituir después cada etapa por MP4/WebM con poster. Un video real no se puede fabricar con una skill de diseño: si no existe, entrega la ilustración animada funcional. No simules videos con un rectángulo vacío ni reutilices la misma animación en las cinco secciones.

Comportamiento:
- La sección visible inicia su recorrido solo si el usuario permite movimiento y no lo pausó antes.
- El timeline muestra la etapa actual, progreso visual y controles anteriores/siguientes y pausa/reproducción.
- Al pulsar una etapa, cambian escena, título y explicación del proceso, y los equipos relacionados. Se detiene autoplay para permitir lectura.
- Las transiciones conservan continuidad visual; no cambiar toda la página de golpe.
- Al completar el recorrido, mantener la pieza final. Scroll libre para pasar al siguiente servicio.
- `prefers-reduced-motion` activa el modo estático con pasos manuales.
- No añadir progreso con porcentajes que parezcan productividad real, tiempo real de fabricación ni telemetría del taller.

Usa Lenis para suavizar el desplazamiento, sin bloquear el scroll nativo ni obligar a completar una animación para salir. Consulta la integración actual en https://github.com/darkroomengineering/lenis. No necesitas una skill adicional específica de scroll: necesitas una integración correcta y probarla.

## Texto, Nosotros y Contacto
Cada servicio: título claro, una introducción de 35–55 palabras como máximo, etiqueta de etapa actual y explicación de 20–35 palabras. Prioriza utilidad y legibilidad; sin lenguaje exagerado.

Nosotros: empresa mexicana del sector metalmecánico, ubicada en San Nicolás de los Garza, Nuevo León; actividad desde 1984. Usar “Desde 1984”, sin reciclar “más de 35 años” del sitio viejo.

Contacto publicado: tunsa@talleresunidos.com; teléfono principal (81) 8351 9819; dirección 4a Avenida 509, Col. Garza Cantú, San Nicolás de los Garza, N.L., 66480, México. Registrar que debe reconfirmarse antes de lanzamiento. Usar enlaces mailto/tel funcionales. CTA “Consultar este servicio” debe llevar el nombre del servicio al contexto de contacto o al asunto del correo, correctamente codificado.

## Modelo de contenido
Diseña tipos para `Service`, `Process`, `Equipment`, `ProcessStep`, `Evidence` y `MediaAsset`. Cada paso tiene IDs estables, descripción, sceneKey y referencias a procesos/equipos. Las relaciones incluyen su propio estado de validación. Las listas de materiales pueden estar vacías con un estado desconocido explícito. No convertir desconocido en un array de ejemplos presentado como catálogo.

Los datos deben poder corregirse sin tocar componentes. Añadir un servicio nuevo debe requerir contenido y escena, no copiar toda una página.

## Forma de trabajar y criterios de aceptación
1. Lee referencia, instrucciones y skills disponibles. Resume en pocas líneas la dirección visual y continúa implementando sin pedirme aprobación de decisiones rutinarias.
2. Define tokens y estructura. Desarrolla Fabricación completa como patrón y aplica el sistema a los otros cuatro servicios.
3. Implementa los estados de timeline y navegación antes de pulir movimiento.
4. Ajusta acabado mediante capturas reales y comparación con la referencia. Comprueba móvil y escritorio; no asumas que una compilación exitosa garantiza buen diseño.
5. Revisa accesibilidad, rendimiento, recursos y veracidad. Ejecuta las comprobaciones de `AGENTS.md`.
6. Entrega el sitio completo con README, auditoría de contenido y manifiesto de activos. Explica cómo arrancarlo y qué datos faltan validar.

Se acepta cuando los cinco capítulos funcionan por scroll y clic, todas las escenas cambian por etapa, las tarjetas están sincronizadas, Nosotros/Contacto funcionan y el diseño se reconoce como una adaptación de la referencia. Ningún enlace inerte, placeholder visual vacío, máquina inventada o confirmación de formulario simulada.

## Skills recomendadas para preparar Cursor
Instalar solo si aún no están disponibles, seleccionando Cursor en el instalador. Estos comandos son preparación del proyecto, no un requisito para detener su ejecución:

```sh
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
```

Fuentes y criterio: `ui-ux-pro-max` aporta sistema visual; `frontend-design` ayuda al acabado; `web-design-guidelines` sirve para revisión; `vercel-react-best-practices` para rendimiento. No son cuatro directores creativos independientes: la imagen y este brief fijan la dirección.

Catálogo consultado: https://skills.sh/ (aproximadamente 421.5 mil, 1 millón, 797.8 mil y 849.8 mil instalaciones respectivamente en la consulta; cifras variables). Repositorios verificados: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, https://github.com/anthropics/skills y https://github.com/vercel-labs/agent-skills. Sus contadores superaban ampliamente 100 estrellas. Popularidad no garantiza calidad ni sustituye la revisión del resultado.
