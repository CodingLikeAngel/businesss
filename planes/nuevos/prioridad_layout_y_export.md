# Plan de Prioridad Absoluta: Layout Robusto y Sistema de Exportación

Este plan detalla los pasos críticos para estabilizar el núcleo del editor (Layout) y habilitar la funcionalidad de generar webs reales (Exportación), convirtiendo al editor de un prototipo visual a una herramienta funcional.

---

## 🟥 Prioridad 1: Sistema de Exportación (Fix Crítico)

**Objetivo:** Permitir que el proyecto compile correctamente y que el botón "Publicar/Exportar" funcione, generando código usable.

### 1.1. Reparación de Rutas de Importación

El sistema de build falla porque las referencias a los servicios de exportación están rotas.

- **Problema:** `libs/shared-components/src/index.ts` apunta a `./services/export` (inexistente).
- **Solución Real:** La carpeta correcta es `libs/shared-components/src/lib/services/export`.
- **Acción:**
  - Modificar `libs/shared-components/src/index.ts` para exportar correctamente:
    ```typescript
    export * from './lib/services/export'; // O la ruta relativa correcta al index del export
    ```

### 1.2. Verificación de Módulos de Exportación

Asegurar que la lógica de exportación está expuesta.

- **Acción:** Verificar `libs/shared-components/src/lib/services/export/index.ts`. Si no existe, crearlo y exportar:
  - `ExporterService`
  - `WebComponentExporter`
  - `HtmlExporter` (si existe)
  - Interfaces relacionadas.

### 1.3. Prueba de Humo (Smoke Test)

- **Acción:** Ejecutar un build limpio (`nx build`) y verificar que no hay errores de resolución de módulos.

---

## 🟧 Prioridad 2: Robustez del Layout (Extensión "Smart-Adapt")

**Objetivo:** Que TODOS los componentes (no solo el acordeón) se comporten de manera fluida y responsiva en el canvas, eliminando cortes de contenido y desbordamientos.

### 2.1. Estandarización de Contenedores (CSS & Template)

Aplicar la regla de oro: _"El contenedor se adapta al contenido, no al revés"_.

- **Archivo:** `editor-layout-section.component.ts`
- **Acciones en Template HTML:**
  - Recorrer cada `*ngSwitchCase` (Cards, Lists, Text, Chips).
  - Cambiar estilos inline de `height: 100%` a `height: auto`.
  - Añadir `display: block` y `width: 100%`.
- **Acciones en Lógica (TS):**
  - En `getComponentStyles(slot)`: Asegurar `max-width: 100%`, `box-sizing: border-box`, `margin: 0 auto`.
  - En `onIsolatedModeApplied`:
    - Para componentes de **Flujo** (Texto, Lista, Card, Acordeón): Guardar `height: auto` y usar el tamaño visual como `min-height`.
    - Para componentes **Media** (Imagen, Mapa): Permitir altura fija si el usuario la define explícitamente, pero con `object-fit: cover`.

### 2.2. Verificación Visual

- **Acción:**
  1. Insertar una "Card Animated" y llenarla de texto -> Debe crecer verticalmente.
  2. Insertar una "Lista" con 10 items -> Debe empujar el layout hacia abajo.
  3. Insertar una "Imagen" -> Debe respetar su ratio o tamaño fijo sin romper el ancho.

---

## 🟩 Prioridad 3: Validación Final (MVP Ready)

Una vez completados 1 y 2, el editor está listo para ser probado como producto.

### 3.1. Flujo Completo

1. Crear una página nueva.
2. Añadir secciones variadas (Hero, Features con Cards, FAQ con Acordeón).
3. Editar contenidos en Modo Aislado.
4. Volver al Layout -> **Verificar que todo se ve bien**.
5. Pulsar "Exportar" -> **Obtener un ZIP o HTML funcional**.

---

**Siguientes Pasos Inmediatos:**

1. Ejecutar corrección de imports de Exportación (Paso 1.1).
2. Ejecutar refactorización masiva de `editor-layout-section` (Paso 2.1).
