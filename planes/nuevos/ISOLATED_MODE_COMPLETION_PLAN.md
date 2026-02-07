# Plan de Implementación: Modo Aislado Universal

Este plan detalla los pasos para completar la implementación del **Modo Aislado** en todos los componentes de la biblioteca de UI, asegurando una experiencia de edición premium, coherente y accesible desde el editor general.

## Objetivos

1.  **Modo Aislado para todos**: Cada componente principal debe tener su propio `Editor[Component]IsolatedModeComponent`.
2.  **Acceso Directo**: Todos los componentes en el editor general deben mostrar un botón flotante de "Editar" (🎯) al pasar el cursor (hover).
3.  **Layout Premium Consistente**: Sidebar a la izquierda (propiedades) y Canvas a la derecha (previsualización interactiva).
4.  **Persistencia**: Los cambios realizados en modo aislado deben sincronizarse correctamente con el estado global de la página.

## Estado Actual

- **Completados**: Draggable Box, Accordion, Button.
- **Existentes (Auditando)**: Card (varios), Chip, CTA, Features, Hero, Image, Map, Pricing, Shape, Showcase, Smart Container, Testimonials, Title, Video.
- **Pendientes (Prioridad Alta)**: Table, List, Tabs, Chart, Gallery, Breadcrumbs, Footer, Header, Nav-bar, Spinner, Tooltip.

---

## Fase 1: Auditoría y Estandarización de Existentes

Muchos componentes ya tienen un archivo `isolated-mode.component.ts` pero pueden tener inconsistencias de diseño o faltarles el acceso.

### 1.1 Checklist de Auditoría (Sidebar Left | Canvas Right)

- [ ] **Title**: Verificar layout y botón EDITAR corporativo.
- [ ] **Image**: Verificar layout y botón EDITAR corporativo.
- [ ] **Hero**: Verificar layout y botón EDITAR corporativo.
- [ ] **Pricing**: Verificar layout y botón EDITAR corporativo.
- [ ] **Testimonials**: Verificar layout y botón EDITAR corporativo.
- [ ] **Card (Animated, Premium, Product, Routes, Testimonial)**: Verificar consistencia.
- [ ] **Chip**: Integrar botón EDITAR en sección.
- [ ] **CTA / Features**: Integrar botón EDITAR en sección.
- [ ] **Map / Video**: Integrar botón EDITAR en sección.
- [ ] **Shape / Showcase**: Integrar botón EDITAR en sección.
- [ ] **Smart Container**: Integrar botón EDITAR en sección.

### 1.2 Acciones Técnicas

- **Botón "Editar" Masivo**: Asegurar que todos los templates de sección tengan el overlay flotante con el botón 🎯.
- **Persistencia**: Verificar que `onIsolatedModeApplied` en la sección actualice correctamente el store de variants.

---

## Fase 2: Implementación de Componentes Faltantes (Prioridad Alta)

Implementar el modo aislado para los componentes que aún no lo tienen.

### 2.1 Componentes de Estructura y Datos

- [ ] **Table**: Editor de filas/columnas, zebra striping, estilos de celda.
- [ ] **Tabs**: Gestión de pestañas activas, variantes de navegación.
- [ ] **Gallery**: Subida/gestión de imágenes, layouts de rejilla.
- [ ] **List**: Editor de bullet points, iconos de lista, espaciado.
- [ ] **Modal**: Editor de contenido del modal, triggers de apertura.

### 2.2 Navegación y Globales

- [ ] **Nav-bar / Header**: Editor de menús, enlaces, logos.
- [ ] **Footer**: Redes sociales, con columnas de enlaces.
- [ ] **Breadcrumbs**: Separadores, estilos.
- [ ] **Pagination**: Variantes, colores de página activa.

---

## Fase 3: Guía de Implementación para un Componente Nuevo

### 1. Crear el Componente de Modo Aislado

Ubicación: `libs/features/editor/feature-editor/src/lib/pages/editor/components/[name]/editor-[name]-isolated-mode.component.ts`

**Estructura HTML Estándar:**

```html
<div class="isolated-mode-overlay">
  <div class="isolated-mode-container">
    <div class="isolated-mode-header">...</div>
    <div class="isolated-mode-body">
      <!-- Flex-direction: row -->
      <div class="controls-sidebar">...</div>
      <!-- flex-shrink: 0 -->
      <div class="isolated-canvas">...</div>
      <!-- flex: 1 -->
    </div>
    <div class="isolated-mode-footer">...</div>
  </div>
</div>
```

### 2. Integrar en el Section Component

Ubicación: `libs/features/editor/feature-editor/src/lib/pages/editor/components/[name]/editor-[name]-section.component.ts`

**Pasos:**

- Inyectar el componente en `imports`.
- Añadir variable `showIsolatedMode = false`.
- Implementar `openIsolatedMode(event)` y `applyIsolatedChanges(config)`.
- **Template**: Añadir el botón en el header de la sección y el modal al final.

---

## Próximos Pasos Inmediatos

1.  **Ejecución de Auditoría**: Empezar con Table y Card para asegurar que el sistema de datos funciona.
2.  **Modifición de Section Base**: Investigar si se puede mover parte de la lógica del botón Editar a `EnhancedBaseEditorSectionComponent` para reducir código duplicado.
