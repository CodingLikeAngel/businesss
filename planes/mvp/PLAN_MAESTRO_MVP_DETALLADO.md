# 🚀 PLAN MAESTRO MVP: De Prototipo a Negocio Viable

**Objetivo:** Transformar el editor actual en un producto comercializable (MVP) robusto, estable y listo para generar ingresos, ejecutando tareas granulares paso a paso.

---

## 🏗️ FASE 1: ROBUSTEZ ABSOLUTA DEL CORE (La Base)

_No se puede vender si el editor "rompe" el diseño. Esta fase es innegociable._

### 1.1. 🔴 Reparación del Sistema de Exportación (CRÍTICO)

- [ ] **Fix Imports:** Corregir rutas rotas en `libs/shared-components/src/index.ts` (apunta a `./services/export` inexistente).
- [ ] **Verify Export Service:** Asegurar que `WebComponentExporter` y `HtmlExporter` funcionan y generan código limpio.
- [ ] **Smoke Test:** Ejecutar `nx build` y verificar que genera el bundle de producción sin errores.

### 1.2. 🟡 Extensión "Smart-Adapt" (Layout Fluido)

_Aplicar la lógica del Acordeón a TODOS los componentes para evitar cortes._

- [ ] **Template Cleanup:** En `editor-layout-section.component.ts`, recorrer el `ngSwitch` y cambiar `style="height: 100%"` por `style="height: auto; min-height: 100%; display: block;"` para:
  - `ui-card` (todas las variantes)
  - `ui-list`
  - `ui-text / ui-title`
  - `ui-button`
  - `ui-chip`
- [ ] **Logic Update:** En `onIsolatedModeApplied`, generalizar la lógica de guardado:
  ```typescript
  if (isFlowComponent(type)) {
    styles.height = 'auto';
    styles.minHeight = detectedHeight + 'px';
  }
  ```

### 1.3. 🟢 Sistema de Redimensión (Resize)

- [ ] **Integración Visual:** Asegurar que los handles de resize (ya añadidos) se ven bien y no tapan contenido.
- [ ] **Persistencia:** Verificar que al redimensionar un slot, el valor se guarda en el JSON del layout y se restaura al recargar la página.

---

## 🧹 FASE 2: LIMPIEZA ARQUITECTÓNICA (Deuda Técnica)

_Eliminar lo viejo para que el mantenimiento sea barato y rápido._

### 2.1. 🗑️ Eliminación de Legacy Wrappers

_Ejecutar `PLAN_DELETION_LEGACY_COMPONENTS.md`_

- [ ] **Borrado Seguro:** Eliminar `editor-hero-section.component.ts`, `editor-features-section.component.ts`, etc.
- [ ] **Redirección de Catálogo:** Asegurar que el catálogo de componentes apunta solo a los UI Components puros (`lib-ui-components-*`) o sus equivalentes en Isolated Mode.

### 2.2. ⚡ Optimización de Imports

- [ ] **Tree Shaking:** Revisar `layout-section.module.ts` (o imports standalone) para quitar referencias a componentes borrados.

---

## 📱 FASE 3: EXPERIENCIA MÓVIL Y UX

_El 80% del tráfico de los clientes será móvil. El editor debe garantizar que se vea bien._

### 3.1. 📲 Lógica de Colapso Móvil

- [ ] **Auto-Stacking:** En `editor-layout-section.component.ts`, implementar lógica CSS media query:
  ```css
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr !important;
    }
    .slot {
      width: 100% !important;
      min-height: auto;
    }
  }
  ```
- [ ] **Preview Móvil:** Verificar que el botón de "Vista Móvil" del editor aplica correctamente las clases para simular este comportamiento.

### 3.2. 🎨 UI Polish (Pulido Visual)

- [ ] **Empty States:** Que los slots vacíos tengan un diseño "invitador" (dashed border suave, icono +).
- [ ] **Hover Effects:** Feedback visual claro al pasar el ratón sobre un slot editable (borde de color de marca).

---

## 💰 FASE 4: PREPARACIÓN DE NEGOCIO (Go-To-Market)

_Empaquetar la tecnología como producto vendible._

### 4.1. 📦 Producto "Demo"

- [ ] **Landing Page:** Crear una landing page _usando el propio editor_ que explique el producto. "Creado con Anto Studios".
- [ ] **Plantillas de Nicho:** Dejar listas 3 plantillas "Perfectas":
  1.  **Gym/Crossfit:** Oscura, Neon, fuerte en video/imagen.
  2.  **Restaurante:** Elegante, serif fonts, menú accordion.
  3.  **Portfolio/Agencia:** Minimal, grid asimétrico.

### 4.2. 💵 Modelo de Exportación/Venta

- [ ] **Botón "Premium Export":** Implementar un flujo donde "Exportar" sea una acción que simule pago (o valide licencia).
- [ ] **Generador de ZIP:** Que el export genere un ZIP con: `index.html`, `styles.css`, `assets/`. Código limpio, sin basura de Angular/Editor.

---

## 📅 Calendario de Ejecución Sugerido

| Semana | Foco           | Tarea Principal                              |
| :----- | :------------- | :------------------------------------------- |
| **S1** | **Core Fixes** | Fix Export + Smart-Adapt (Fase 1)            |
| **S2** | **Cleanup**    | Borrar Legacy + Resize Polish (Fase 2 + 1.3) |
| **S3** | **Móvil/UX**   | Responsive Logic + UI Polish (Fase 3)        |
| **S4** | **Launch**     | Crear Plantillas Demo + Landing (Fase 4)     |

---

**Siguiente Paso Recomendado:** Empezar inmediatamente con **Fase 1.1 (Fix Export)** y **1.2 (Smart-Adapt)**. Son bloqueantes.
