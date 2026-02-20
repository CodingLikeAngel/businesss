# Plan de mejora: UI Components (`libs/ui-components/src/lib`)

Objetivos: **estandarizar** todos los componentes (misma arquitectura, convenciones y estructura) y **mejorar diseño y UX** (tokens, espaciado, estados, accesibilidad).

---

## 1. Inventario y agrupación

### 1.1 Familias de componentes

| Familia | Base | Variantes (-1, -2, -3) | Otros |
|--------|------|------------------------|-------|
| **Button** | `button` | button-1, button-2, button-3 | — |
| **Chip** | chip | chip-1, chip-2, chip-3 | — |
| **Modal** | modal | modal-1, modal-2, modal-3 | — |
| **Tooltip** | tooltip | tooltip-1, tooltip-2, tooltip-3 | — |
| **Title** | title | title-1, title-2, title-3 | — |
| **Tabs** | tabs | tabs-1, tabs-2, tabs-3 | — |
| **Table** | table | table-1, table-2, table-3 | — |
| **Spinner** | spinner | spinner-1, spinner-2, spinner-3 | — |
| **Input** | input | input-1, input-2, input-3 | — |
| **Nav-bar** | nav-bar | nav-bar-1, nav-bar-2, nav-bar-3 | — |
| **Image** | image | image-1, image-2, image-3 | — |
| **List** | list | list-1, list-2, list-3 | — |
| **Gallery** | gallery | gallery-1, gallery-2, gallery-3 | — |
| **Chart** | chart | chart-1, chart-2, chart-3 | — |
| **Breadcrumbs** | breadcrumbs | breadcrumbs-1, breadcrumbs-2, breadcrumbs-3 | — |
| **Accordion** | acordeon (accordion) | accordion-1, accordion-2, accordion-3 | — |
| **Draggable-box** | — | draggable-box-1, draggable-box-2, draggable-box-3 | — |
| **Cards** | card | — | card-rutas, card-premium, card-animated, card-products |
| **Headers** | header | — | header-classic, header-modern |
| **Footers** | footer-1 | — | footer-simple, footer-mega, deep-footer, videogames-footer |

Componentes **sin variantes numeradas**: spacer, shape, video, map, date-time-picker, showcase, showcase-atom, gaming-variants-showcase, smart-container, date-time-picker, breadcrumbs (base), chart (base), image (base), list (base), etc.

### 1.2 Estimación de alcance

- ~93 archivos `.component.ts` en la librería.
- Familias con base + 3 variantes: alta duplicación (misma API, solo prefijo de clase distinto en muchos casos).

---

## 2. Inconsistencias actuales (a corregir)

### 2.1 Selectores

- **Dos convenciones mezcladas:**
  - `lib-ui-components-*`: button, chip, modal, tooltip, title, tabs, table, input, card, accordion, nav-bar, gallery, breadcrumbs (variantes), draggable-box, date-time-picker, footer-1.
  - `lib-ui-*`: spinner, spacer, video, map, list (y list-1/2/3), image (y image-1/2/3), header, header-classic, header-modern, chart, breadcrumbs (base), footer-simple, footer-mega, deep-footer, showcase, shape.
- **Duplicado crítico:** `lib-ui-components-footer` usado en **footer-1** y **videogames-footer** (rompe en tiempo de ejecución).
- **Typo:** `lib-ui-components-ui-gallery` (doble "ui") en gallery base.

**Decisión:** Unificar en **`lib-ui-components-<nombre>`** para todos los componentes de esta librería (incluidos spinner, spacer, video, map, list, image, header, footer, chart, breadcrumbs, etc.). Corregir duplicado footer y nombre de gallery.

### 2.2 Estilos (styleUrl vs styleUrls)

- **Inconsistencia:** Algunos usan `styleUrl` (singular), otros `styleUrls` (array).
- **Decisión:** Usar **`styleUrl`** en todos (un solo archivo por componente), salvo los que necesiten varios archivos (p. ej. base + tema); en ese caso mantener `styleUrls` documentado.

### 2.3 Rutas al modelo compartido

- Rutas a `ui-components-data.model` y `custom-styles.interface` varían según profundidad: `../models/`, `../../models/`, `../../../models/`.
- **Decisión:** Usar alias de path (p. ej. `@ui-components/models`) en `tsconfig` para imports estables desde cualquier nivel.

### 2.4 CustomStyles por componente

- Casi todos definen su propia interfaz (`ButtonCustomStyles`, `CardCustomStyles`, `SpinnerCustomStyles`, etc.) con lógica repetida: mapear `backgroundColor`/`color` a `--theme-bg`, `--theme-color`, etc., y copiar el resto de propiedades.
- Ya existe `CustomStyles` en `lib/models/custom-styles.interface.ts`; algunos (p. ej. gallery) lo usan, otros no.
- **Decisión:** Unificar en una **interfaz base compartida** + utilidad `mergeCustomStyles(custom, componentPrefix)` que devuelva el objeto de estilos para `[ngStyle]`/HostBinding, y que cada componente solo extienda con variables CSS propias si hace falta.

### 2.5 Nomenclatura y carpetas

- **Acordeon vs Accordion:** Carpeta `acordeon` con `accordion.component.ts`; otra carpeta `accordion` con variantes accordion-1/2/3. Unificar nombre a **accordion** (carpeta y referencias).
- **Clases CSS:** En button se usa prefijo `btn`, en button-1 `btn-1`; en card `card--variant`. Definir convención única: p. ej. `<componente>--<modificador>` (BEM-like) para todos.

### 2.6 ChangeDetection y encapsulación

- No todos usan `ChangeDetectionStrategy.OnPush`; algunos usan `ViewEncapsulation.None` (p. ej. gallery) sin criterio documentado.
- **Decisión:** Por defecto **OnPush** en todos; **Encapsulation.None** solo donde se justifique (p. ej. estilos que deban afectar al host o a hijos inyectados) y documentado en el plan/README del componente.

### 2.7 Accesibilidad

- Button tiene `aria-label`, `aria-disabled`, `aria-expanded`, `aria-pressed`; otros componentes no están revisados.
- **Decisión:** Checklist por tipo: botones/links (aria-label, aria-disabled, focus visible), modales (focus trap, aria-modal, role), tooltips (aria-describedby, no solo hover), formularios (labels, error association), componentes interactivos (roles ARIA y estados).

---

## 3. Arquitectura estándar objetivo

### 3.1 Estructura de un componente

- **Standalone:** `standalone: true`.
- **Imports:** `CommonModule` y solo lo necesario; evitar imports de toda la librería.
- **Inputs:** Señales `input<T>()` con tipos explícitos y valores por defecto.
- **Outputs:** Señales `output<T>()` para eventos (click, close, change, etc.).
- **Estado interno:** `signal()` o `computed()`; evitar estado mutable en propiedades cuando afecte a la plantilla.
- **Estilos:** Un `styleUrl` (o `styleUrls` si está justificado). Uso de `computed()` para clases y estilos (p. ej. `buttonClasses()`, `buttonStyles()`) derivados de inputs.
- **Selector:** Siempre `lib-ui-components-<nombre>` (sin duplicados).

### 3.2 Convención de nombres

- **Clases CSS:** Prefijo del componente + BEM-like, p. ej. `btn`, `btn--primary`, `btn--md`, `card`, `card--with-image`, `card--size-wide`.
- **Variantes:** Una sola fuente de variantes por familia (base desde `ui-components-data.model` + variantes específicas del componente si existen), sin duplicar la lista en cada variante -1/-2/-3.

### 3.3 Estilos y diseño

- Reutilizar **tokens** y **mixins** desde `lib/styles/` (`_variables.scss`, `_mixins.scss`, `_applicators.scss`, etc.).
- Componentes que admitan variantes: usar el mismo mecanismo (p. ej. `apply-all-variants('<prefix>-')`) para mantener una sola definición de variantes.
- **CustomStyles:** Un solo flujo: input `customStyles` → utilidad compartida → `[ngStyle]` o `@HostBinding('style')`.

### 3.4 Variantes -1, -2, -3

- **Objetivo a medio plazo:** Reducir duplicación. Opciones:
  - **A)** Un solo componente por familia (p. ej. `button`) con input `design: 'default' | 'style-1' | 'style-2' | 'style-3'` que cambie el prefijo de clase y cargue un bloque SCSS asociado.
  - **B)** Mantener componentes separados pero heredar de una “base” (clase abstracta o composición) que centralice inputs, outputs y lógica de estilos/clases.
- Hasta entonces: al menos **misma API** (mismos nombres de inputs/outputs) y **misma convención** de selectores y estilos.

---

## 4. Guías de diseño y UX

### 4.1 Tokens y variables

- Usar variables del tema: `--theme-bg`, `--theme-color`, `--theme-border`, `--theme-radius`, `--theme-shadow`, `--theme-font`, etc., para que un solo cambio de tema afecte a todos los componentes.
- Evitar colores y tamaños “mágicos” en SCSS; definir en `_variables.scss` o en el token del tema.

### 4.2 Espaciado y tamaños

- Escala consistente para `size`: p. ej. `sm` / `md` / `lg` con padding y font-size definidos en tokens o mixins.
- Espaciado entre elementos (márgenes) alineado con una escala (4px, 8px, 12px, 16px, 24px, 32px) o variables `--spacing-*`.

### 4.3 Estados

- **Hover / Focus / Active / Disabled:** Definir para cada componente interactivo; focus visible claro (outline/box-shadow) para accesibilidad.
- **Loading:** Donde aplique (botones, inputs), patrón consistente (spinner + estado deshabilitado o solo visual).

### 4.4 Accesibilidad (resumen)

- Contraste mínimo (WCAG 2.1 AA donde aplique).
- Navegación por teclado y focus visible.
- Roles y atributos ARIA correctos (labels, expanded, selected, live regions si hay contenido dinámico).
- Donde haya solo interacción por hover (p. ej. tooltips), asegurar también activación por teclado/focus y no depender solo de hover.

---

## 5. Plan por fases

### Fase 1 – Fundamentos y correcciones críticas (prioridad alta)

1. **Selectores y nombres**
   - Unificar todos los selectores a `lib-ui-components-<nombre>`.
   - Corregir duplicado: renombrar selector de `videogames-footer` a `lib-ui-components-videogames-footer` (o similar único).
   - Corregir gallery: `lib-ui-components-ui-gallery` → `lib-ui-components-gallery`.
2. **Estilos**
   - Unificar a `styleUrl` en todos los componentes que tengan un solo archivo SCSS.
3. **Imports del modelo**
   - Añadir alias `@ui-components/models` (o el que use el proyecto) y sustituir rutas relativas a `models/` por el alias en todos los componentes.
4. **Utilidad CustomStyles**
   - Crear función (o servicio) `mergeCustomStyles(customStyles, componentPrefix?)` que devuelva el objeto de estilos (incluyendo mapeo de `backgroundColor`/`color` a `--theme-bg`/`--theme-color` y prefijo del componente). Documentar uso y migrar un componente piloto (p. ej. button).

### Fase 2 – Arquitectura por familias

5. **Familia piloto: Button**
   - Aplicar utilidad compartida de CustomStyles.
   - Asegurar OnPush, misma API en button y button-1/2/3, y convención de clases (btn, btn--variant, btn--size).
   - Revisar accesibilidad (aria-*, focus).
6. **Resto de familias**
   - Repetir el mismo patrón por familias: Chip, Input, Modal, Spinner, Card, Tabs, Table, Tooltip, Title, Nav-bar, List, Image, Gallery, Chart, Breadcrumbs, Accordion, Draggable-box, Headers, Footers, etc.
   - Unificar uso de `CustomStyles` (interfaz base + utilidad) y convención de clases/selectores.

### Fase 3 – Nomenclatura y carpetas

7. **Accordion / Acordeon**
   - Unificar a “accordion”: mover/consolidar contenido de `acordeon` a `accordion` (o viceversa) y actualizar imports y referencias.
8. **Convención de clases**
   - Documentar en README o en este plan la convención BEM-like y aplicarla de forma gradual en SCSS (sin romper variantes existentes si no es necesario).

### Fase 4 – Diseño y UX

9. **Tokens y variables**
   - Revisar `_variables.scss` y temas; asegurar que todos los componentes que deban usar tokens los usen.
10. **Estados y accesibilidad**
    - Checklist por tipo de componente; aplicar focus visible, ARIA y contraste donde falte.
11. **Documentación**
    - README por familia (o un único README de la librería) con props, eventos, ejemplos y notas de accesibilidad.

### Fase 5 (opcional) – Reducción de duplicación variantes

12. **Componentes -1, -2, -3**
    - Valorar refactor a un solo componente con `design: 'default' | 'style-1' | 'style-2' | 'style-3'` por familia, o base compartida, para reducir archivos y mantener una sola API.

---

## 6. Criterios de “hecho”

- Todos los selectores son `lib-ui-components-<nombre>` y no hay duplicados.
- Todos los componentes con un solo SCSS usan `styleUrl`.
- Imports a modelos usan alias de path.
- CustomStyles se resuelve con interfaz compartida + utilidad en todos los componentes que lo usen.
- OnPush por defecto; Encapsulation.None solo donde esté justificado.
- Convención de clases documentada y aplicada de forma consistente.
- Checklist de accesibilidad y estados (focus, hover, disabled) aplicado según tipo de componente.
- Plan de fases ejecutado hasta la Fase 4 como mínimo; Fase 5 si se prioriza reducir duplicación.

---

## 8. Estado de implementación

- **Fase 1 (hecho):**
  - Selectores unificados a `lib-ui-components-<nombre>` en todos los componentes y usos actualizados en shared-components, feature-editor, featured-components y apps.
  - Duplicado footer corregido: `videogames-footer` usa `lib-ui-components-videogames-footer`.
  - Gallery corregido: `lib-ui-components-gallery` (antes `lib-ui-components-ui-gallery`).
  - Unificado `styleUrl` en todos los componentes que tenían un solo archivo SCSS.
  - Alias `@negocio/ui-components/models` añadido en `tsconfig.base.json` (uso desde apps; dentro de la lib se mantienen imports relativos para no crear entry points extra en Nx).
  - Utilidad `mergeCustomStyles()` en `lib/models/merge-custom-styles.util.ts`; componente piloto **button** migrado (usa `mergeCustomStyles(customStyles, 'btn')` y `ChangeDetectionStrategy.OnPush`).
- **Fase 2 (hecho):** Aplicado estándar (mergeCustomStyles + OnPush) a: Button (piloto), Chip, Spinner, Card, Input, Modal, Tabs, Table, Tooltip, Title, Accordion (acordeon), Breadcrumbs, List, Nav-bar.
- **Fases 3–4:** Pendientes (unificar acordeon/accordion, tokens y accesibilidad).

---

## 9. Referencias rápidas

- **Ruta base:** `libs/ui-components/src/lib`
- **Modelo de variantes:** `libs/ui-components/src/lib/models/ui-components-data.model.ts`
- **CustomStyles compartido:** `libs/ui-components/src/lib/models/custom-styles.interface.ts`
- **Utilidad mergeCustomStyles:** `libs/ui-components/src/lib/models/merge-custom-styles.util.ts`
- **Estilos globales de la lib:** `libs/ui-components/src/lib/styles/` (`_mixins.scss`, `_variables.scss`, `_applicators.scss`, etc.)
- **Exportaciones:** `libs/ui-components/src/index.ts`
