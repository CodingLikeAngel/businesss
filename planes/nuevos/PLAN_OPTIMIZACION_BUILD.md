# 🚀 PLAN MAESTRO: Optimización de Build y Rendimiento

**Objetivo:** Reducir drásticamente los tiempos de compilación (dev/prod) y el tamaño del bundle inicial, eliminando dependencias circulares y código muerto heredado que ya no se utiliza en la nueva arquitectura de Sección Flexible.

---

## 🔍 Análisis del Problema

Actualmente, el tiempo de compilación es excesivo porque:

1.  **Barrel Files Gigantes:** `libs/shared-components/src/index.ts` exporta _todo_ lo que hay en `variant-selector`, provocando que cualquier módulo que importe una sola cosa de `shared-components` acabe cargando cientos de componentes innecesarios.
2.  **Componentes Monolíticos:** `VariantSelectorComponent` y `ComponentExplorerComponent` parecen importar referencias a casi todos los componentes del sistema, creando un grafo de dependencias masivo.
3.  **Código Legacy Mezclado:** La nueva arquitectura (`EditorLayoutSection`) convive con la antigua (`VisualEditorService`, `VariantSelector`) en el mismo módulo compartido.

---

## 🛠️ ESTRATEGIA DE OPTIMIZACIÓN

### FASE 1: Limpieza de "Barriles" (Barrel Files)

**Acción Inmediata:** Dejar de exportar componentes internos/legacy desde el `index.ts` público de la librería.

**Tareas:**

- [ ] **Refactor `libs/shared-components/src/index.ts`:**
  - Eliminar `export * from './lib/shared-components/variant-selector/variant-selector.component';`
  - Eliminar `export * from './lib/shared-components/variant-selector/component-explorer.component';`
  - Eliminar `export * from './lib/shared-components/variant-selector/design-editor.component';`
  - Mantener SOLO las exportaciones de servicios esenciales (`IsolatedModeIntegrationService`) y componentes que realmente se usen en el Feature Editor.

### FASE 2: Eliminación de Código Muerto (Dead Code Integration)

**Acción:** Eliminar físicamente los componentes que han sido reemplazados por el `EditorLayoutSection`.

**Tareas:**

- [ ] **Auditoría de Uso:** Verificar que `ComponentExplorerComponent` (85KB) ya no se usa en `EditorLayoutSection`.
- [ ] **Borrado Físico:** Eliminar `component-explorer.component.ts` y sus archivos asociados.
- [ ] **Borrado de Wrappers Legacy:** Ejecutar el `PLAN_DELETION_LEGACY_COMPONENTS.md` para eliminar `editor-hero-section.component.ts` y similares.

### FASE 3: Desacople del `VariantSelector`

**Acción:** El `VariantSelector` parece ser el antiguo orquestador. Si la nueva edición es vía "Modo Aislado" + "Toolbar Flotante", el `VariantSelector` gigante sobra.

**Tareas:**

- [ ] **Modularización:** Si partes de `VariantSelector` aún son útiles (ej. lógica de variantes), extraerlas a un servicio ligero (`VariantService` ya existe).
- [ ] **Lazy Loading:** Asegurar quHe solucionado el problema de invisibilidad de los handles. Ahora el estilo CSS está en su sitio:

Handles Visibles: Aparecen al hacer hover sobre un slot lleno.
Feedback Visual: El slot mostrará un borde discontinuo azul cuando se esté redimensionando (.slot.resizing).
Posicionamiento: El handle está centrado verticalmente a la derecha del slot, con un área de click de 24px.e los componentes de "Modo Aislado" (`*-isolated-mode`) se carguen solo cuando se entra en el editor, no en el main bundle.

### FASE 4: Optimización de Angular

**Acción:** Configurar el build para ser más agresivo ignorando módulos no usados.

**Tareas:**

- [ ] **Standalone Components:** Verificar que `EditorLayoutSectionComponent` sea `standalone: true` e importe _directamente_ lo que necesita, en lugar de importar Módulos Gigantes (`SharedModule`).
- [ ] **Imports Explícitos:** En `editor-layout-section.component.ts`, revisar sus imports. Si importa de `shared-components`, cambiarlo para importar archivos específicos si es posible (deep imports) o asegurar que el barrel file está limpio.

---

## 📉 Impacto Esperado

- **Build Time Dev:** Reducción del 40-60% (al romper dependencias circulares masivas).
- **Bundle Size:** Reducción significativa al eliminar `component-explorer`.
- **Estabilidad:** Menos errores de "Circular Dependency" y "Heap Out of Memory".

---

## 📅 Plan de Ejecución Inmediato

1.  **Paso 1:** Limpiar `libs/shared-components/src/index.ts` (Quitar exports basura).
2.  **Paso 2:** Eliminar `component-explorer.component.ts` (El archivo más pesado).
3.  **Paso 3:** Verificar que `EditorLayoutSection` sigue funcionando.

**¿Procedemos con el Paso 1?**
