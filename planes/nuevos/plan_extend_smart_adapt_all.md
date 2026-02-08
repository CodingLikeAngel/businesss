# Plan Maestro: Extensión de "Layout Robusto" (Smart-Adapt) a Todos los Componentes

**Objetivo:** Garantizar que TODOS los componentes UI integrados en el editor flexible se comporten de manera responsiva y fluida, eliminando cortes de contenido y desbordamientos, tal como se logró con el Acordeón.

---

## 1. Principio "Smart-Adapt"

El principio técnico a replicar es:

1.  **Contenedor Fluido:** El wrapper del componente siempre debe tener `height: auto` para crecer con el contenido.
2.  **Mínimo Visual:** El tamaño definido visualmente en el modo aislado se guarda como `min-height`, asegurando presencia visual inicial.
3.  **Display Block:** El contenedor usa `display: block` y `margin: auto` para evitar colapsos de flexbox.

---

## 2. Mapa de Componentes a Actualizar

| Componente          | Tipo    | Estrategia                  | Estado Actual            |
| :------------------ | :------ | :-------------------------- | :----------------------- |
| **UI Accordion**    | Flujo   | ✅ Auto Height + Min Height | Implementado             |
| **UI Card (Todas)** | Flujo   | 🟡 Requiere actualización   | `height: auto` pendiente |
| **UI List**         | Flujo   | 🟡 Requiere actualización   | `height: auto` pendiente |
| **UI Title / Text** | Flujo   | 🟡 Requiere actualización   | `height: auto` pendiente |
| **UI Button**       | Flujo   | 🟡 Requiere actualización   | `height: auto` pendiente |
| **UI Chip**         | Flujo   | 🟡 Requiere actualización   | `height: auto` pendiente |
| **Draggable Box**   | Híbrido | 🟡 Requiere revisión        | `height` fijo o auto?    |
| **UI Image**        | Media   | 🔵 Híbrido (Auto/Fijo)      | Mantener ratio           |

---

## 3. Pasos de Ejecución

### Fase 1: Actualización Masiva de Lógica de Guardado (Logic Update)

**Archivo:** `editor-layout-section.component.ts` -> Método `onIsolatedModeApplied`

Modificaremos la lógica para que, al guardar desde el modo aislado, se aplique el patrón Smart-Adapt a todos los componentes de flujo.

```typescript
// Lógica a implementar
const flowComponents = [
  'ui-accordion',
  'ui-card',
  'ui-card-animated',
  'ui-card-product',
  'ui-list',
  'ui-title',
  'ui-button',
  'ui-chip',
  'draggable-box', // Opcional, dependiendo del uso
];

if (flowComponents.some((type) => currentSlot.componentType.includes(type))) {
  // Patrón Smart-Adapt
  finalStyles['height'] = 'auto';
  finalStyles['min-height'] = updatedConfig.size.height + 'px';
} else {
  // Patrón Estricto (imágenes, mapas, videos)
  finalStyles['height'] = updatedConfig.size.height + 'px';
}
```

### Fase 2: Actualización Masiva del Template (Template Cleanup)

**Archivo:** `editor-layout-section.component.ts` -> Template

Eliminaremos los estilos inline restrictivos (`height: 100%`) de todos los wrappers de componentes en el `ngSwitch` y los reemplazaremos por `height: auto` y `display: block`.

**Componentes afectados:**

1.  `lib-ui-components-button`
2.  `lib-ui-components-title`
3.  `lib-ui-components-card`
4.  `lib-ui-components-card-animated`
5.  `lib-ui-list`
6.  `lib-card-products`
7.  `lib-ui-components-chip`
8.  `lib-ui-components-draggable-box-1`

### Fase 3: Verificación de "Isolated Mode"

Asegurar que los componentes de modo aislado (`Editor...IsolatedModeComponent`) estén emitiendo correctamente el tamaño final (`size`) en el evento `applied`.

- _Nota:_ Si el componente aislado no reporta size, el `min-height` será 0 o incorrecto. Verificaremos que el `EditorDraggableBoxIsolatedMode` (que es la base de muchos) funcione bien.

---

## 4. Instrucciones para el Desarrollador (Yo)

1.  **Ejecutar Fase 1:** Modificar `onIsolatedModeApplied`.
2.  **Ejecutar Fase 2:** Modificar el HTML Template usando `multi_replace`.
3.  **Validar:** Crear una página de prueba y redimensionar cada tipo de componente para confirmar que:
    - Crece si se añade contenido.
    - No se corta (overflow).
    - Se centra correctamente.

---

**Iniciando ejecución inmediata de Fase 1 y 2...**
