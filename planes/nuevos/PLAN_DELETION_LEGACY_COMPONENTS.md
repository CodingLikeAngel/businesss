# Plan de Eliminación de Componentes Legacy (Limpieza Arquitectónica)

**Objetivo:** Eliminar todos los componentes de sección específicos ("wrappers legacy") que han quedado obsoletos tras la implementación exitosa de la `EditorLayoutSectionComponent` (Sección Flexible).

---

## 1. Justificación

Con la nueva arquitectura de **Sección Flexible**, cualquier componente UI (Acordeón, Hero, Features, etc.) puede ser renderizado dentro de un slot genérico. Mantener componentes de sección dedicados (ej. `EditorHeroSectionComponent`, `EditorAccordionSectionComponent`) duplica lógica, aumenta la deuda técnica y confunde al sistema de edición.

**Regla de Oro:**

- **Conservar:** `*.-isolated-mode.component.ts` (Lógica de edición específica).
- **Eliminar:** `*.-section.component.ts` (Wrappers de sección antiguos).

---

## 2. Inventario de Eliminación

### Grupo A: Componentes de UI Básicos

Ruta: `libs/features/editor/feature-editor/src/lib/pages/editor/components/`

| Carpeta      | Archivos a Eliminar                                                                | Archivos a Conservar                          |
| :----------- | :--------------------------------------------------------------------------------- | :-------------------------------------------- |
| `accordion/` | `editor-accordion-section.component.ts`, `editor-accordion-*-section.component.ts` | `editor-accordion-isolated-mode.component.ts` |
| `button/`    | `editor-button-section.component.ts` (si existe)                                   | `editor-button-isolated-mode.component.ts`    |
| `title/`     | `editor-title-section.component.ts` (si existe)                                    | `editor-title-isolated-mode.component.ts`     |
| `image/`     | `editor-image-section.component.ts` (si existe)                                    | `editor-image-isolated-mode.component.ts`     |
| `list/`      | `editor-list-section.component.ts` (si existe)                                     | `editor-list-isolated-mode.component.ts`      |
| `chip/`      | `editor-chip-section.component.ts` (si existe)                                     | `editor-chip-isolated-mode.component.ts`      |

### Grupo B: Componentes de Sección Complejos

| Carpeta         | Archivos a Eliminar                        | Archivos a Conservar                             |
| :-------------- | :----------------------------------------- | :----------------------------------------------- |
| `hero/`         | `editor-hero-section.component.ts`         | `editor-hero-isolated-mode.component.ts`         |
| `features/`     | `editor-features-section.component.ts`     | `editor-features-isolated-mode.component.ts`     |
| `testimonials/` | `editor-testimonials-section.component.ts` | `editor-testimonials-isolated-mode.component.ts` |
| `pricing/`      | `editor-pricing-section.component.ts`      | `editor-pricing-isolated-mode.component.ts`      |
| `gallery/`      | `editor-gallery-section.component.ts`      | `editor-gallery-isolated-mode.component.ts`      |
| `contact/`      | `editor-contact-section.component.ts`      | `editor-contact-isolated-mode.component.ts`      |
| `cta/`          | `editor-cta-section.component.ts`          | `editor-cta-isolated-mode.component.ts`          |
| `stats/`        | `editor-stats-section.component.ts`        | `editor-stats-isolated-mode.component.ts`        |
| `footer/`       | `editor-footer-section.component.ts`       | `editor-footer-isolated-mode.component.ts`       |

---

## 3. Plan de Ejecución

### Fase 1: Desacoplamiento (Safe Delete)

1.  **Buscar Referencias:** Verificar que `PageBuilderService` o el store no estén instanciando estos componentes legacy directamente.
2.  **Actualizar Mapa de Componentes:** Asegurar que `COMPONENT_CATALOG` en `layout-section.interfaces.ts` apunte a los componentes UI (`ui-accordion`, `ui-hero`) y NO a los wrappers de sección legacy.

### Fase 2: Borrado Físico

1.  Ejecutar script de borrado o borrar manualmente carpeta por carpeta.
2.  Eliminar exportaciones en `index.ts` (si las hay).

### Fase 3: Validación

1.  Ejecutar `nx build` para detectar imports rotos.
2.  Verificar que el editor carga correctamente y permite añadir componentes desde el Layout Flexible.

---

**Estado:** Pendiente de Ejecución.
