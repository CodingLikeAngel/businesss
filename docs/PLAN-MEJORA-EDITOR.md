# Plan de mejora – Herramienta de edición (Anto Studios Editor)

Revisión general del editor y plan de mejoras para la herramienta y la experiencia de edición.

---

## 1. Resumen ejecutivo

El editor es una aplicación compleja: **layout principal (desktop/mobile)**, **panel lateral (variant-selector)** con pestañas (Páginas, Estructura, Bloques, Redacción, Estilo, Ajustes), **decenas de tipos de sección** renderizados por `ngSwitch`, **modo aislado** en muchas secciones, **preview global**, **undo/redo** y **edición visual** (mover/redimensionar). La revisión identifica **inconsistencias**, **puntos débiles** y **deuda técnica** para priorizar un plan de mejora por fases.

---

## 2. Arquitectura actual (resumen)

| Capa | Descripción |
|------|-------------|
| **Layout** | `MainDesktopLayoutComponent`: hub (device, Previsualizar, Publicar), sidebar (variant-selector), canvas con `<router-outlet>`. |
| **Página** | `EditorDesktopFeatureComponent`: lista de secciones desde store (`sections$`), `*ngFor` + `ngSwitch` por `section.type`. |
| **Secciones** | ~90+ `*ngSwitchCase`: cada tipo tiene su `lib-editor-*-section` (hero, gallery, stats, layout-section, draggable-box, etc.). |
| **Base** | `BaseEditorSectionComponent` → `EnhancedBaseEditorSectionComponent`: preview mode, chrome (header + Editar), selección, variantes. |
| **Chrome** | `EditorSectionChromeComponent`: etiqueta, botón "Editar" (modo aislado), toggle controles en preview. |
| **Panel** | `VariantSelectorComponent` (shared): Páginas, Estructura, Bloques, Redacción, Estilo, Ajustes; usa `UiStateService` para selección. |
| **Estado** | NgRx (page, history, UI); `VariantService` (configs por sección, `builderStep$`); `HistoryService` (undo/redo). |

---

## 3. Problemas y riesgos identificados

### 3.1 Preview y visualización

- **Preview global**: Al pulsar "Previsualizar", el mismo árbol de componentes se muestra con `isPreviewMode = true`. Algunas secciones podrían no recibir bien datos (ej. galería ya corregida con `getGalleryImages()`). Conviene auditar el resto por `config`/`content` undefined o vacío.
- **Placeholder genérico**: Los tipos que caen en `*ngSwitchDefault` muestran un bloque "Este componente aún no tiene una vista previa específica". Hay que decidir si se implementan vistas mínimas o se ocultan de la librería de bloques hasta tener soporte.
- **Dispositivo (desktop/tablet/mobile)**: El frame cambia clase CSS (`frame-mobile`, etc.) pero las secciones usan `isMobile` del **user agent**, no del selector del editor. En preview "tablet/mobile" la lógica podría no coincidir con la vista real.

### 3.2 Secciones y consistencia

- **Duplicación de tipos**: Muchos tipos tienen variante con prefijo `ui-` (ej. `gallery` y `ui-gallery`), duplicando casos en el `ngSwitch`. Unificar o mapear a un solo tipo reduce mantenimiento y errores.
- **Acceso a `section.content`**: Uso mixto de `section.content['key']` y en algunos sitios sin optional chaining. Riesgo de errores si `section` o `content` no están inicializados. Estandarizar `section?.content?.['key']` o getters en la base.
- **Configs opcionales**: Varias secciones reciben `*Config` (heroConfig, galleryConfig, etc.). Algunos ya son opcionales (ej. gallery); revisar el resto para evitar errores en primera carga o rutas lazy.
- **Editor section chrome**: Casi todas las secciones usan `lib-editor-section-chrome` con el mismo patrón; algunas variantes (layout, draggable-box) tienen chrome propio. Mantener una sola fuente de verdad para "cómo se ve el borde/header" en edición y preview.

### 3.3 Modo aislado

- **Cobertura**: Muchas secciones tienen modo aislado (hero, gallery, stats, pricing, video, testimonials, tabs, etc.); otras no. Las que no lo tienen solo son editables desde el panel lateral (Redacción/Estilo). Documentar qué tiene modo aislado y qué no, y priorizar los bloques más usados.
- **Patrón apply/closed**: Debe ser uniforme: merge de content/styles, cierre del modal, y si aplica clase `body.isolated-mode-active`. Stats y otras se han unificado; revisar el resto para el mismo patrón.
- **Layout-section**: Tiene su propio flujo de modo aislado por slot (button, accordion, title, etc.). Comprobar que al aplicar/cerrar no queden estados rotos (clase body, overlay).

### 3.4 Panel lateral (Variant Selector)

- **Redacción / Estilo**: Dependen de `selectedSection` / `selectedElement`. Si el ContentEditor o DesignEditor no conocen el tipo de sección, no pueden mostrar campos específicos. Revisar que cada tipo de sección tenga al menos campos genéricos (título, estilos) o específicos bien enlazados al store.
- **Estructura**: Añadir/eliminar/reordenar secciones. Verificar que el orden se persiste y que el store y la lista en pantalla coinciden (incl. layout con slots).
- **Bloques**: La librería de bloques debe estar alineada con los `ngSwitchCase` disponibles; si se añade un tipo que solo tiene `*ngSwitchDefault`, el usuario ve un placeholder. Sincronizar "qué se puede añadir" con "qué tiene vista/edición".

### 3.5 Estado y persistencia

- **Store vs VariantService**: Parte de la configuración vive en NgRx (page/sections) y parte en VariantService (configs por tipo). Asegurar una única fuente de verdad para "contenido de la página" y que VariantService sea derivado o caché, no duplicado.
- **Guardado**: Mensaje "Automático" en el hub; confirmar que el auto-save y el indicador de "sin guardar" / "guardado" son claros y fiables.
- **Historia (undo/redo)**: HistoryService con límite (ej. 50). Comprobar que todas las acciones editables (contenido, estilos, mover, redimensionar) disparan comandos y que undo/redo no dejan estado inconsistente.

### 3.6 UX y accesibilidad

- **Modos de herramienta**: Barra flotante con Modo Completo / Mover / Redimensionar / Snap / Guías / Atajos. Dejar claro qué modo está activo y que el comportamiento (cursor, handles) sea coherente.
- **Atajos**: Shortcuts guide existente; asegurar que atajos comunes (Deshacer, Rehacer, Guardar, Preview) estén documentados y funcionen en todo el flujo.
- **Feedback**: Loading, página vacía y errores (por ejemplo sección con tipo desconocido) deben ser claros y no bloquear el editor.
- **Accesibilidad**: Roles, focos y teclado en modales (modo aislado, shortcuts, selector de plantilla) para uso sin ratón.

### 3.7 Código y mantenibilidad

- **Template editor-feature.component.html**: Muy largo (~1400 líneas) con muchos `ngSwitchCase`. Valorar extraer a componentes "section-renderer" por grupo de tipos o un registro tipo mapa tipo → componente.
- **Tests**: Hay specs de servicios (history, keyboard, etc.) y de algunos componentes (main-layout, editor-feature). Aumentar cobertura en componentes críticos (layout-section, draggable-box, secciones con modo aislado) y en integración (añadir sección, editar, preview, undo).
- **Duplicación mobile/desktop**: Algunas secciones tienen bloque `*ngIf="!isMobile"` y otro `*ngIf="isMobile"` con marcado distinto. Revisar si se puede unificar con CSS o un solo template responsive.
- **Limpieza**: Archivos `.bak` / `.bak2` en layout-section; eliminarlos y dejar solo el código en control de versiones.

---

## 4. Plan de mejora por fases

### Fase 1 – Estabilidad y preview (corto plazo)

| # | Acción | Prioridad |
|---|--------|-----------|
| 1.1 | Auditar todas las secciones en modo preview: asegurar que usan optional chaining o getters seguros para `section.content` y configs. | Alta |
| 1.2 | Estandarizar en la base (o en cada sección) un helper tipo `getSectionContent(key, default)` para evitar `section.content['x']` sin defensas. | Media |
| 1.3 | Revisar que el selector de dispositivo (desktop/tablet/mobile) en el hub refleje su valor en las secciones que usan `isMobile` (o introducir `previewDevice$`). | Media |
| 1.4 | Eliminar archivos `.bak` / `.bak2` y referencias si las hubiera. | Baja |

### Fase 2 – Consistencia de secciones y modo aislado

| # | Acción | Prioridad |
|---|--------|-----------|
| 2.1 | Documentar en un único lugar (README o docs) la lista de tipos de sección, cuáles tienen modo aislado y cuáles solo panel lateral. | Alta |
| 2.2 | Unificar patrón de modo aislado: body class, apply (merge content/styles), closed; revisar todas las secciones que tienen isolated-mode. | Alta |
| 2.3 | Reducir duplicación `type` / `ui-type`: mapear en un solo lugar (ej. normalizar a tipo sin prefijo) para tener menos casos en el ngSwitch. | Media |
| 2.4 | Revisar que cada sección con modo aislado tenga preview representativo dentro del isolated (titulo, items, estilos) como en Stats. | Media |

### Fase 3 – Panel lateral y flujo de edición

| # | Acción | Prioridad | Estado |
|---|--------|-----------|--------|
| 3.1 | Revisar ContentEditor y DesignEditor: para cada tipo de sección seleccionada, mostrar al menos campos básicos (y específicos si existen) enlazados al store. | Alta | ✅ Hecho: mensaje de ayuda cuando no hay campos (usar Modo Aislado). |
| 3.2 | Asegurar que "Estructura" (orden, añadir/quitar secciones) y el store están siempre sincronizados; probar con layout y slots. | Alta | ✅ Hecho: Store → VariantService con `syncFromStore(page)`; suscripción en base-editor a `selectCurrentPage`; VariantService → Store ya existía vía currentPage$ en base. |
| 3.3 | Alinear "Bloques" disponibles con los tipos que tienen vista específica (no solo placeholder); ocultar o marcar como "próximamente" los que caen en default. | Media | ✅ Hecho: `SUPPORTED_SECTION_TYPES` en section-type-registry; input `supportedSectionTypes` en variant-selector y component-explorer; badge "Vista genérica" para tipos no soportados; main-desktop-layout pasa la lista. |

### Fase 4 – Estado y persistencia

| # | Acción | Prioridad | Estado |
|---|--------|-----------|--------|
| 4.1 | Definir claramente: store como fuente de verdad de la página; VariantService como derivado o para configs globales. Evitar duplicar "contenido actual" en ambos. | Alta | ✅ Hecho: [ARQUITECTURA-ESTADO-EDITOR.md](./ARQUITECTURA-ESTADO-EDITOR.md). |
| 4.2 | Revisar que todas las acciones editables (contenido, estilos, move, resize) disparen comandos para undo/redo y que el estado tras undo/redo sea correcto. | Alta | Pendiente |
| 4.3 | Mejorar indicador de guardado (Automático / Guardando / Guardado / Error) si no es suficientemente claro. | Media | ✅ Hecho: Guardando… / Sin guardar / Guardado en el hub. |

### Fase 5 – Refactor y mantenibilidad

| # | Acción | Prioridad | Estado |
|---|--------|-----------|--------|
| 5.1 | Extraer el renderizado de secciones a un componente o directiva que use un registro (map) tipo → componente, para reducir el tamaño del template principal. | Media | ✅ Hecho: `EditorSectionRendererComponent` + `section-type-registry.ts` (map tipo → componente); carga dinámica con `ViewContainerRef.createComponent()`; desktop y mobile usan el renderer; templates ~98 y ~50 líneas. |
| 5.2 | Añadir tests de integración: cargar página, seleccionar sección, abrir modo aislado, aplicar, preview, undo. | Media | ✅ Hecho: `editor-flow.integration.spec.ts` (load page, select section, preview mode, undo/store); specs desktop/mobile corregidos y pasando. |
| 5.3 | Unificar donde sea posible el template mobile/desktop de secciones (un solo template con clases responsive en vez de dos bloques). | Baja | ✅ Hecho: `editor-feature-shared.component.html` único; desktop y mobile usan `isMobile` y mismo template; toolbar/modal/shortcuts con *ngIf="!isMobile"; clases responsive (p-10 md:p-20, text-xl md:text-2xl). |

### Fase 6 – UX y pulido

| # | Acción | Prioridad | Estado |
|---|--------|-----------|--------|
| 6.1 | Dejar claro en la barra de modos qué modo está activo (Completo / Mover / Redimensionar) y que el cursor/handles lo reflejen. | Media | ✅ Hecho: aria-pressed, role="toolbar", títulos y texto sr-only. |
| 6.2 | Revisar accesibilidad de modales (modo aislado, atajos, plantillas): foco, cierre con Escape, y navegación por teclado. | Media | ✅ Hecho: Escape en BaseIsolatedModeComponent; role="dialog", aria-modal en galería. |
| 6.3 | Revisar mensajes de error y estados vacíos (página sin secciones, sección sin vista) para que sean claros y accionables. | Baja | ✅ Hecho: tipos no mapeados usan vista de edición genérica (EditorFallbackSectionComponent) en lugar de mensaje; solo hint mínimo si no hay contenido. |

---

## 5. Métricas de éxito sugeridas

- **Preview**: Todas las secciones soportadas muestran contenido coherente en "Previsualizar" sin errores en consola.
- **Modo aislado**: Misma secuencia apply/closed/body class en todas las secciones que lo tienen; sin estados colgados.
- **Panel**: Al seleccionar cualquier tipo de sección, Redacción o Estilo muestran al menos opciones útiles (o mensaje claro de "editar en modo aislado").
- **Estado**: Undo/redo funciona tras editar contenido, estilos, mover y redimensionar; sin desincronización store vs UI.
- **Código**: Template principal de editor-feature por debajo de ~300–400 líneas (con renderer por registro); sin archivos .bak; tests de integración para flujos críticos.

---

## 6. Próximos pasos recomendados

1. **Documentación de secciones**: Ver [EDITOR-SECCIONES-Y-MODO-AISLADO.md](./EDITOR-SECCIONES-Y-MODO-AISLADO.md) para la lista de tipos de sección y modo aislado.
2. **Estado del editor**: Ver [ARQUITECTURA-ESTADO-EDITOR.md](./ARQUITECTURA-ESTADO-EDITOR.md) para store como fuente de verdad y VariantService.
3. Priorizar **Fase 1** (auditoría preview y defensas en `section.content`/configs) y **Fase 2** (modo aislado y documentación).
4. Asignar o repartir por bloques (hero, gallery, stats, layout, etc.) la revisión de preview y modo aislado.
5. Crear issues o tareas por ítem del plan y cerrarlos según se implementen.
6. Revisar este plan cada cierto tiempo (p. ej. trimestral) y ajustar prioridades según feedback de uso real.

---

*Documento generado a partir de una revisión del código del editor (feature-editor, shared-components variant-selector, store, servicios). Última revisión: Feb 2025.*
