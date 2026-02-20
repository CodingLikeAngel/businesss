# Tipos de sección del editor y modo aislado

Listado de tipos de sección del editor, si tienen **modo aislado** (edición en pantalla completa) y si aplican la clase `body.isolated-mode-active` al abrir/cerrar.

---

## Secciones con modo aislado (botón "Editar" / Modo Aislado)

Todas estas secciones muestran el chrome de editor (etiqueta + botón Editar) y al pulsar "Editar" abren un overlay/modal de edición dedicado. El patrón unificado es:

- **Al abrir**: `document.body.classList.add('isolated-mode-active')` y `showIsolatedMode = true`.
- **Al cerrar (closed o applied)**: `document.body.classList.remove('isolated-mode-active')` y `showIsolatedMode = false`, y en applied se hace merge de content/styles al store.

| Tipo (section.type) | Componente editor | Body class |
|----------------------|-------------------|------------|
| hero, hero-minimal, hero-split | EditorHeroSectionComponent | Sí |
| cta | EditorCtaSectionComponent | Sí |
| features | EditorFeaturesSectionComponent | Sí |
| gallery | EditorGallerySectionComponent | Sí |
| contact | EditorContactSectionComponent | Sí |
| stats | EditorStatsSectionComponent | Sí |
| pricing | EditorPricingSectionComponent | Sí |
| video | EditorVideoSectionComponent | Sí |
| testimonials | EditorTestimonialsSectionComponent | Sí |
| title, ui-title | EditorTitleSectionComponent | Sí |
| tabs, ui-tabs | EditorTabsSectionComponent | Sí |
| table, ui-table | EditorTableSectionComponent | Sí |
| steps | EditorStepsSectionComponent | Sí |
| faq | EditorFaqSectionComponent | Sí |
| accordion, ui-accordion | EditorAccordionSectionComponent | Sí |
| button, ui-button | EditorButtonSectionComponent | Sí |
| image, ui-image | EditorImageSectionComponent | Sí |
| list, ui-list | EditorListSectionComponent | Sí |
| map, ui-map | EditorMapSectionComponent | Sí |
| products | EditorProductsSectionComponent | Sí |
| promotions | EditorPromotionsSectionComponent | Sí |
| services | EditorServicesSectionComponent | Sí |
| shape, ui-shape | EditorShapeSectionComponent | Sí |
| showcase, ui-showcase | EditorShowcaseSectionComponent | Sí |
| card-animated, ui-card-animated | EditorCardAnimatedSectionComponent | Sí |
| card-product, ui-card-product | EditorCardProductSectionComponent | Sí |
| card-testimonial, ui-card-testimonial | EditorCardTestimonialSectionComponent | Sí |
| card-premium, ui-card-premium | EditorCardPremiumSectionComponent | Revisar |
| card-rutas | EditorCardRutasSectionComponent | Revisar |
| chip, ui-chip | EditorChipSectionComponent | Sí |
| draggable-box, layout-section | EditorDraggableBoxSectionComponent / EditorLayoutSectionComponent | Sí (propio overlay) |

**Nota**: card-premium y card-rutas pueden revisarse después para añadir el mismo patrón de body class si abren modo aislado.

---

## Secciones sin modo aislado (solo panel lateral)

Estas secciones se editan únicamente desde el panel lateral (Redacción / Estilo) al seleccionar la sección o un elemento interno. No tienen botón "Editar" ni overlay de modo aislado.

- **header** (EditorHeaderSectionComponent)
- **footer** (EditorFooterSectionComponent)
- **breadcrumbs, ui-breadcrumbs**
- **spinner, ui-spinner**
- **input, ui-input**
- **chart, ui-chart**
- **nav-bar-1/2/3, tooltip-1/2/3, modal-1/2/3**
- **newsletter**
- **reservation-form, ui-reservation-form**
- **smart-container**
- **spacer, ui-spacer**
- **generic** (y cualquier tipo que caiga en `*ngSwitchDefault`)

---

## Tipos que caen en placeholder (ngSwitchDefault)

Si se añade un bloque cuyo `section.type` no tiene `*ngSwitchCase` en `editor-feature.component.html`, se muestra el mensaje: *"Este componente aún no tiene una vista previa específica en el editor"*. Conviene que la librería de bloques (ComponentExplorer) solo ofrezca tipos que tengan vista y, si aplica, modo aislado implementado.

---

## Uso de getSectionContent (preview seguro)

En `BaseEditorSectionComponent` está definido:

```ts
getSectionContent<T>(key: string, defaultValue: T): T
```

Usar en templates y lógica para leer `section.content[key]` sin errores cuando `section` o `section.content` no estén definidos (p. ej. en preview o primera carga). Ejemplo:

```html
[title]="getSectionContent('title', 'Título por defecto')"
```

---

*Documento generado en el marco del plan de mejora del editor. Actualizar al añadir o cambiar secciones.*
