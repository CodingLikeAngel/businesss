# Plan de Mejora y Estandarización de Componentes

Este plan detalla los pasos para elevar todos los componentes del sistema al nivel de calidad, robustez y editabilidad logrado en el componente **Acordeón**.

## El "Estándar Acordeón" (The Golden Standard)

Para que un componente se considere "completo", debe cumplir con:

1.  **UI Component Premium (`libs/ui-components`)**:

    - Uso de **Signals** para gestión de estado interno.
    - **SCSS Moderno**: Variables CSS (`--theme-*`), Glassmorphism, Animaciones suaves (`cubic-bezier`), soporte Dark Mode nativo.
    - **HTML Semántico**: Estructura limpia, uso de SVGs para iconos, atributos ARIA.
    - **Inputs Limpios**: Interfaces claras para datos y estilos.

2.  **Editor Component Granular (`libs/features/editor`)**:

    - Herencia de `EnhancedBaseEditorSectionComponent`.
    - **Edición Visual Granular**: Uso de `@ViewChild` para cada sub-elemento (Título, Descripción, Botón, Imagen, Contenedor).
    - **Integración con Panel**: El componente reacciona inmediatamente a cambios del panel lateral (binding correcto).
    - **Persistencia Inmutable**: Los cambios de estilo y contenido clonan objetos para no romper el Store (NgRx).

3.  **Panel Lateral Contextual (`ContentEditorComponent`)**:
    - **Sin Ruido**: Solo muestra los campos relevantes para el componente seleccionado (oculta "CTA" si no hay botones, etc.).
    - **Listas Dinámicas**: Soporte robusto para añadir/borrar items (colecciones).

---

## Fases de Ejecución

### 🚀 Fase 1: Componentes Core (Prioridad Alta)

Estos son los bloques fundamentales de cualquier landing page.

1.  **[v] Hero Section** (`hero`)
    - _Logros_: Edición individual de cards, resize libre, video background, sync robusto con Store.
2.  **[v] Cards / Grid** (`cards`)
    - _Logros_: Integración con `UICardAnimated` (Signals), edición granular de cada feature.
3.  **[v] Header & Footer**
    - _Logros_: Persistencia de estilos visuales, soporte para edición de contenidos básicos.

### 🌟 Fase 2: Marketing & Social (Prioridad Media)

1.  **Testimonials**
    - _Reto_: Carrusel/Slider, avatares, citas.
2.  **Features / Benefits**
    - _Reto_: Listas con iconos, alternancia imagen/texto (zig-zag).
3.  **Pricing Tables**
    - _Reto_: Destacar una columna ("Popular"), listas de características, botones de compra.

### 🛠️ Fase 3: Utilidades y Conversión

1.  **Contact Form**
    - _Reto_: Campos de formulario, validación visual, botón de envío.
2.  **Gallery / Showcase**
    - _Reto_: Grids de imágenes, Lightbox (modal al hacer clic).
3.  **Newsletter / CTA Section**
    - _Reto_: Input simple + botón, fondos llamativos.

---

## Checklist de Implementación por Componente

Para cada componente, ejecutar esta rutina:

### 1. Refactor UI Component (`ui-components`)

- [ ] Convertir `@Input` a `input<T>()` signals.
- [ ] Implementar `computed()` para clases y estilos.
- [ ] Mejorar SCSS: Añadir variables `--theme-*`, transiciones, glassmorphism.
- [ ] Mejorar HTML: SVG iconos, estructura `aria`.

### 2. Refactor Editor Component (`features/editor`)

- [ ] Asegurar herencia de `EnhancedBaseEditorSectionComponent`.
- [ ] Añadir `@ViewChild` para Título, Descripción, Media, CTA, etc.
- [ ] En `ngAfterViewInit`, llamar a `applyElementVisualEditing` para cada hijo.
- [ ] Implementar `handleVisualEvent` delegando a handlers específicos (`updateTitleStyles`, `updateMediaStyles`, etc.).
- [ ] Asegurar que el HTML usa `[applyDynamicStyles]` y `(visualEvents)`.

### 3. Ajustar Panel Lateral

- [ ] Verificar si `ContentEditorComponent` necesita reglas específicas (`shouldShow...`) para ocultar campos irrelevantes para este componente.

---

## Lecciones Aprendidas & Nuevos Estándares (Post-Hero)

1.  **Sincronización de Items de Lista**:

    - Cuando se edita un item individual de una lista haciendo clic en el Canvas (no solo desde el panel), el cambio en `selectedElement` debe propagarse al array `items` del componente padre.
    - **Patrón**: Implementar `ngDoCheck` en el componente Editor para detectar cambios en `uiStateService.selectedElement` y actualizar el array local + dispatch al Store.

2.  **Limpieza del Panel**:

    - Los items genéricos (como Cards) pueden heredar campos no deseados (ej. "Subtítulo").
    - **Solución**: Pasar `{ excludedFields: ['subtitle'] }` en el método `selectElement` del template.

3.  **Inicialización de Datos**:
    - Nunca mutar `this.section.content` directamente en `ngAfterViewInit`.
    - Si faltan datos (ej. `items` array), hacer dispatch de una actualización al Store (`variantService.updateSectionInCurrentPage`).

---

## Siguiente Paso Inmediato

Comenzar con la **Fase 2: Cards / Grid**. Aplicar el estándar de edición granular a las secciones de rejilla ("Features", "Services", etc.).
