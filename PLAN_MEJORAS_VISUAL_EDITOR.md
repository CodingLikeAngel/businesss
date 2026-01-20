# Plan de Mejoras para el Editor Visual (PLAN_MEJORAS_VISUAL_EDITOR.md)

Este documento detalla el plan de acción para estabilizar, pulir y generalizar el sistema de "Drag & Drop" y redimensionado del editor visual, asegurando una experiencia de usuario fluida y "premium".

## 1. Análisis de Problemas Actuales

- **Pérdida de Contexto de Posición:** Al iniciar el arrastre o redimensionado, el cambio de `position: static/relative` a `absolute` causa saltos visuales si el elemento padre tiene layouts complejos (Flexbox/Grid) o márgenes/paddings no contabilizados.
- **Colapso de Dimensiones:** Elementos con ancho automático (`width: auto` o `fit-content`) pierden su forma al volverse absolutos.
- **Redimensionado "Hacia la Izquierda/Arriba":** Modificar el tamaño desde la izquierda o arriba requiere actualizar simultáneamente `width/height` y `left/top`. Actualmente, esto causa "temblores" o desplazamientos erráticos debido a conflictos entre el sistema de coordenadas del ratón y el posicionamiento CSS relativo.
- **Conflictos de Eventos:** La propagación de eventos puede activar comportamientos no deseados en elementos padres o hijos durante la edición.

## 2. Hoja de Ruta (Roadmap)

### Fase 1: Estabilización del Núcleo (Core Stability)

**Objetivo:** Eliminar "saltos" y comportamientos destructivos.

1.  **Ghost Dragging (Arrastre Fantasma):**

    - En lugar de mover el elemento real y corromper el layout del DOM en tiempo real, crear un "clon visual" (ghost) semitransparente que siga al ratón.
    - El elemento real permanece en su sitio hasta que el usuario suelta el ratón.
    - Al soltar, se calcula la nueva posición y se aplica, o se inserta en el nuevo contenedor si es un cambio de orden.

2.  **Abstracción de Coordenadas:**
    - Implementar un sistema que traduzca coordenadas de pantalla (MouseEvent) a coordenadas locales del contenedor padre de forma robusta, soportando `transform`, `scroll` y bordes.
    - Usar `getBoundingClientRect` del padre al _inicio_ de la operación para establecer el marco de referencia.

### Fase 2: Redimensionado "Premium"

**Objetivo:** Redimensionado fluido en todas direcciones.

1.  **Overlay Independiente:**

    - El overlay de redimensionado (borde azul) debe ser totalmente independiente del DOM del elemento.
    - Al redimensionar, se manipula el overlay primero. El elemento real se actualiza para "ajustarse" al overlay, no al revés.
    - Esto evita bucles de retroalimentación donde el redimensionado del elemento mueve el overlay, que a su vez mueve el elemento erráticamente.

2.  **Soporte Flex/Grid en Tiempo Real:**
    - Para elementos en contenedores Flex, el redimensionado debería afectar a `flex-basis` o `width` sin forzar `position: absolute`, a menos que el usuario esté explícitamente en un modo de "Diseño Libre" (Canvas).
    - Detectar automáticamente el modo de layout del padre (`getComputedStyle(parent).display`) y adaptar la estrategia de redimensionado.

### Fase 3: Generalización y UX

**Objetivo:** Que funcione igual de bien en un botón pequeño que en una sección gigante.

1.  **Estrategia de Selección Unificada:**

    - Asegurar que `selectElement` funcione consistentemente para cualquier nivel de anidamiento.
    - Evitar que clicks en hijos arrastren al padre y viceversa (StopPropagation inteligente).

2.  **Guías Inteligentes y Snapping:**

    - Refinar el sistema de guías visuales (ya existente) para que tenga "iman" (snap) con otros elementos hermanos, no solo con las coordenadas globales.

3.  **Persistencia Robusta (Undo/Redo):**
    - Integrar cada fin de operación (`mouseup`) con el `HistoryService` y el `Store` de NgRx.
    - Asegurar que _solo_ el estado final se guarda, no los pasos intermedios del arrastre.

## 3. Acciones Inmediatas (Para la Próxima Sesión)

1.  **Refactorizar `setupResize` en `VisualEditorService`:**

    - Cambiar la lógica para que calcule `left/top` basándose en el delta del ratón acumulado, no en la lectura continua del DOM, para evitar errores de redondeo acumulativos.
    - Asegurar que cuando se usa el handle `left` o `top`, se compense la posición exactamente para que el borde derecho/inferior permanezca visualmente "anclado".

2.  **Implementar `Ghost Dragging` para el movimiento:**

    - Es la solución más segura para evitar que el drag & drop rompa la estructura de la página mientras se decide la nueva ubicación.

3.  **Revisar Estilos Globales del Overlay:**
    - Asegurar que `pointer-events: none` esté en el overlay pero `pointer-events: all` en los handles, para que no bloqueen la interacción con el elemento si es necesaria (aunque para drag/resize, el overlay debe capturar todo).
