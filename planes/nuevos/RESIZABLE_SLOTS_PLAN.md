# 🎯 Plan Maestro: Resizable Slots + Layout Robusto (Smart-Adapt)

**Estado Actual (Feb 2026):** En Progreso 🟢

- [x] `SlotResizeService` creado e integrado.
- [x] `ResizeHandleDirective` creada e integrada.
- [x] Lógica de Resize (drag) funcional en slots.
- [ ] Lógica de "Smart-Adapt" (auto-height) aplicada a todos los componentes (Próximo paso).
- [ ] Limpieza de componentes Legacy (Ver `PLAN_DELETION_LEGACY_COMPONENTS.md`).

---

## 1. Visión General

El objetivo final es una **Sección Flexible** (`EditorLayoutSectionComponent`) que permita:

1.  **Redimensionar Slots:** Ajustar ancho/alto de slots mediante drag handles.
2.  **Adaptar Contenido:** Que los componentes internos (Accordion, Card, List) crezcan verticalmente de forma inteligente ("Smart-Adapt") sin cortes.
3.  **Eliminar Redundancia:** Deshacerse de los antiguos wrappers de sección.

---

## 2. Fase A: Lógica de Resize (Drag Handles)

_Implementada parcialmente en Pasos 1031-1044_

### Funcionalidad Actual:

- Los slots tienen handles de redimensión.
- `SlotResizeService` gestiona el estado de resize.
- `EditorLayoutSectionComponent` persiste los cambios de tamaño (`styles.width`, `styles.height`).

### Tareas Pendientes (Fase A):

- [ ] **Snap to Grid:** Implementar ajuste magnético a múltiplos de 16px/32px.
- [ ] **Auto-Distribución:** Mejorar la lógica para que al agrandar un slot, el vecino se encoja proporcionalmente (ahora solo cambia el slot activo).
- [ ] **Persistencia:** Asegurar que `layoutConfig` guarda `customSize` correctamente en la DB.

---

## 3. Fase B: Layout Robusto "Smart-Adapt" (Prioridad Alta)

_Extensión de la lógica del Acordeón a TODOS los componentes UI._

**Problema:** Al redimensionar un slot o editar contenido, el componente interno puede cortarse si tiene `height: 100%` fijo o el contenedor no crece.

**Solución Técnica:**

1.  **En `onIsolatedModeApplied` (Logic):**

    - Identificar componentes de **Flujo** (Accordion, Card, List, Text, Button, Chip).
    - Aplicar siempre `height: 'auto'` y `min-height: [visual_height]px`.
    - Identificar componentes **Media** (Image, Video, Map).
    - Permitir `height` fijo si el usuario lo define explícitamente.

2.  **En Template HTML (View):**
    - Eliminar `style="height: 100%"` de todos los wrappers en el `ngSwitch`.
    - Usar `style="display: block; width: 100%; height: auto; min-height: 100%;"`.
    - Añadir `margin: 0 auto` para centrado seguro.

**Checklist de Componentes a Actualizar:**

- [ ] `ui-card` (Todas las variantes)
- [ ] `ui-list`
- [ ] `ui-title`
- [ ] `ui-button`
- [ ] `ui-chip`
- [ ] `draggable-box`

---

## 4. Fase C: Limpieza de Legacy (Housekeeping)

_Ejecutar en paralelo con Fase B._

Ver plan detallado en: `PLAN_DELETION_LEGACY_COMPONENTS.md`.

- Eliminar `editor-hero-section.component.ts`, `editor-features-section.component.ts`, etc.
- Mantener solo `*-isolated-mode.component.ts` para la edición al detalle.

---

## 5. Referencias de Código

### Smart-Adapt Pattern (Ejemplo)

```typescript
// En onIsolatedModeApplied
const flowComponents = ['ui-accordion', 'ui-card', 'ui-list', 'ui-text'];

if (flowComponents.some((t) => slot.componentType.includes(t))) {
  // Smart-Adapt: Auto height con suelo mínimo
  styles['height'] = 'auto';
  styles['min-height'] = `${visualHeight}px`;
  styles['display'] = 'block';
} else {
  // Strict Mode: Altura exacta (Media)
  styles['height'] = `${visualHeight}px`;
}
```

### Resize Logic (Ejemplo Snap)

```typescript
snapToGrid(val: number): number {
    const GRID = 16;
    return Math.round(val / GRID) * GRID;
}
```
