# 🚀 Plan de Restauración y Upgrade: Modos Aislados Premium

**Objetivo**: Revertir la centralización rígida de los modos aislados y establecer el estándar **"Aislado Premium"** (Canvas + Sidebar + Undo/Redo) para todos los componentes del editor.

---

## 💎 El Estándar "Aislado Premium"

Cada componente debe tener su propio editor dedicado que cumpla con:

- [ ] **Canvas Interactivo**: Área de trabajo con fondo de rejilla (claro/oscuro).
- [ ] **Draggable & Resizable**: El componente en el canvas se puede mover y redimensionar manualmente.
- [ ] **Sidebar de Controles**: Organizado por secciones (Contenido, Estilo, Tipografía, Feedback, Dimensiones).
- [ ] **Sistema Undo/Redo**: Historial de cambios con `Ctrl+Z` / `Ctrl+Y`.
- [ ] **Sincronización de Temas**: Acceso a la paleta de colores global de la página.
- [ ] **Dock de Información**: Visualización en tiempo real de coordenadas (X, Y) y dimensiones (W, H).
- [ ] **Persistencia Robusta**: Guardado directo al estado de la sección en `NgRx`.

---

## 📋 Estado de Implementación

### 🟢 Fase 1: Los Pioneros (Completado)

- [x] **Button Isolated Mode**: Estándar de gradientes, hover y haptics.
- [x] **Accordion Isolated Mode**: Estándar de edición de items complejos y dimensiones.

### 🟡 Fase 2: Migración y Upgrade a Premium (En Proceso)

_Nota: Estos deben ser extraídos de `shared-components` y recreados como componentes individuales premium._

- [x] **Hero Section** (Completado)
- [x] **Features Section** (Completado)
- [x] **Testimonials Section** (Completado)
- [x] **Pricing Section** (Completado)
- [x] **CTA Section** (Completado)

### 🔴 Fase 3: Nuevos Modos Premium (Pendiente)

- [ ] **Card System** (Premium, Animated, Product)
- [ ] **Gallery Section**
- [ ] **Stats Section**
- [ ] **Contact Form**
- [ ] **Map / Video / Image**

---

## 🛠️ Roadmap de Ejecución

### Paso 1: Hero Section Premium (Actual)

1.  Crear `EditorHeroIsolatedModeComponent` en `libs/features/editor/feature-editor/src/lib/pages/editor/components/hero/`.
2.  Implementar visualización de variantes (Minimal, Split, Centered) en el canvas.
3.  Añadir controles de fondo (Imagen, Video, Gradiente).
4.  Vincular con `EditorHeroSectionComponent`.

### Paso 2: Features & Testimonials

1.  Re-implementar la gestión de arrays (items) con el patrón del Acordeón.
2.  Añadir controles de grid y espaciado.

### Paso 3: Limpieza de `shared-components`

1.  Eliminar los componentes "weird" una vez migrados a su versión premium.
2.  Simplificar `VariantSelectorComponent` para usar los nuevos triggers individuales.

---

**Última actualización**: 08 Feb 2026 - 12:45  
**Estado Actual**: Fase 2 Completada. Iniciando Fase 3 (Nuevos Modos Premium).
