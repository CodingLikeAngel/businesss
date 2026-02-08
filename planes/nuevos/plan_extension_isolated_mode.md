# Plan de Implementación: Extensión de Comportamiento Adaptativo (Tipo Acordeón) a Todos los Componentes UI

**Objetivo:**  
Estandarizar el comportamiento de los componentes en la sección de Layout Flexible (`EditorLayoutSection`) para que todos sigan el patrón "Container-Adaptive Flow" implementado exitosamente en el Acordeón. Esto asegura que los contenedores crezcan dinámicamente con el contenido, evitando recortes ("enanos") y desbordamientos, mientras respetan las dimensiones visuales iniciales definidas en el Modo Aislado.

---

## 1. Principios de Diseño (El "Patrón Acordeón")

Para cada componente UI integrado en el editor, aplicaremos las siguientes reglas:

1.  **Height: Auto**: El componente NUNCA debe tener `height: 100%` forzado en su wrapper o estilo inline si es un componente de contenido variable (texto, tarjetas, listas).
2.  **Min-Height Preservado**: La altura visual definida por el usuario en el Modo Aislado se guardará como `min-height`, garantizando una presencia visual inicial robusta sin impedir el crecimiento.
3.  **Contención Horizontal Segura**: Todo wrapper debe tener `max-width: 100%`, `box-sizing: border-box`, y `display: block` (con `margin: auto` para centrado) para evitar desbordamientos laterales.
4.  **Renderizado Natural**: El contenedor padre (`.slot-component`) debe ser un bloque (`display: block`) que permita el flujo natural del documento, eliminando restricciones Flexbox rígidas que causan conflictos de overflow.

---

## 2. Mapa de Componentes y Estrategia

### Grupo A: Componentes de Flujo (Texto y Listas)

_Estos componentes varían drásticamente de altura según el contenido._

- **UI Title / Text**: Crece con el texto.
- **UI List**: Crece con los items.
- **UI Chip**: Crece si hay muchos chips (wrap).
- **UI Button**: Generalmente fijo, pero debe permitir `height: auto` para tamaños grandes o multilínea.

**Estrategia:**

- Aplicar `height: auto` incondicionalmente.
- `min-height` basado en el tamaño detectado/editado.

### Grupo B: Contenedores Complejos (Cards y Acordeones)

_Tienen estructura interna que puede expandirse._

- **UI Card (Standard, Animated, Glass, Premium...)**: El contenido interno dicta la altura.
- **UI Card Product**: Imagen + Info.
- **UI Accordion** (Ya implementado).

**Estrategia:**

- Idéntica al Acordeón. `height: auto` imperativo.
- Revisar si el componente interno (`lib-ui-card`, etc.) tiene estilos `host { height: 100% }` que deban ser anulados o gestionados.

### Grupo C: Media (Imagen, Video, Mapa)

_Suelen tener ratio de aspecto o dimensiones fijas._

- **UI Image**: Usuario suele querer un tamaño exacto o ratio.
- **UI Video / Map**: Iframes o contenedores de ratio fijo.

**Estrategia:**

- **Híbrida**: Permitir `height` fijo (pixels) SI el usuario lo redimensiona explícitamente, pero por defecto comportarse como block.
- Si el usuario en Modo Aislado define un tamaño exacto, respetarlo como `height` (no solo `min-height`) para evitar saltos.

---

## 3. Pasos de Implementación Técnica

### Paso 1: Refactorización de `EditorLayoutSectionComponent` (Template)

Ubicación: `libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/editor-layout-section.component.ts`

**Acción:** Recorrer todos los `*ngSwitchCase` en el template y actualizar los estilos inline.

```html
<!-- Ejemplo para Cards y Listas -->
<div *ngSwitchCase="'ui-card'" [ngStyle]="getComponentStyles(slot)">
  <!-- ANTES: style="width: 100%; height: 100%;" -->
  <!-- AHORA: style="width: 100%; height: auto; display: block;" -->
  <lib-ui-components-card ...></lib-ui-components-card>
</div>
```

**Lista de Cambios en Template:**

- [ ] `ui-button`: `height: auto`
- [ ] `ui-title`: `height: auto`
- [ ] `ui-image`: Mantener control de altura, pero asegurar `max-width: 100%`.
- [ ] `ui-card`: `height: auto`
- [ ] `ui-card-animated`: `height: auto`
- [ ] `ui-list`: `height: auto`
- [ ] `ui-chip`: `height: auto`
- [ ] `draggable-box`: Revisar (este suele ser absoluto/fijo).

### Paso 2: Actualización de Lógica `onIsolatedModeApplied`

Ubicación: `libs/features/editor/feature-editor/src/lib/pages/editor/components/layout-section/editor-layout-section.component.ts`

**Acción:** Generalizar la lógica que aplicamos al Acordeón para incluir otros tipos.

```typescript
// Lógica Propuesta
const flowComponentTypes = ['ui-accordion', 'ui-card', 'ui-card-animated', 'ui-card-product', 'ui-list', 'ui-text', 'ui-title'];

if (flowComponentTypes.some((t) => currentSlot.componentType.includes(t))) {
  finalStyles['height'] = 'auto';
  finalStyles['min-height'] = updatedConfig.size.height + 'px';
} else {
  // Para Imagen/Video/Mapas, mantenemos altura fija exacta
  finalStyles['height'] = updatedConfig.size.height + 'px';
}
```

### Paso 3: Verificación de Modos Aislados

Asegurar que cada componente tenga su wrapper de Modo Aislado (`editor-[component]-isolated-mode.component.ts`) correctamente conectado para emitir el evento `applied` con el tamaño visual final.

- **Estado Actual**: Parece que la mayoría ya existen (`card-premium`, `list`, `chip`, `title`...).
- **Acción**: Verificar que al guardar, envíen el bounding box correcto para alimentar el `min-height`.

---

## 4. Ejecución

1.  Aplicar cambios de Template y Lógica en `EditorLayoutSectionComponent`.
2.  Probar componente por componente:
    - Añadir al layout.
    - Entrar en Modo Aislado.
    - Redimensionar/Editar contenido.
    - Guardar.
    - Verificar que en el Layout Flexible se adapta y no corta.

---

**Archivo creado por:** Agente Antigravity  
**Fecha:** 2026-02-08
