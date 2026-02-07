# 🚀 Plan Maestro de Implementación de Componentes V2

## Visión: "Componentes Inteligentes y Edición de Próxima Generación"

Este plan define la hoja de ruta para llevar todos los componentes UI al estándar de "Maestría" (Golden Standard), permitiendo una edición visual total, modo aislado premium y robustez estructural.

---

## 🎯 Objetivo General

Transformar la biblioteca de componentes UI en un ecosistema de diseño vivo donde cada elemento sea:

1.  **Aislable**: Edición sin distracciones vía Isolated Mode.
2.  **Draggable/Resizable**: Control total de layout en el canvas.
3.  **Persistente**: Integración nativa con NgRx y sistema de comandos (Undo/Redo).
4.  **Robusto**: Autogestión de bounding boxes y prevención de colapsos de sección.

---

## 🗺 Hoja de Ruta de Componentes

### 📦 Fase 1: Componentes de Contenido Base (Semana 1)

Integración de los "Big 5" y Isolated Mode para:

- [x] **Draggable Box**: (Completado) Referencia de robustez.
- [x] **Accordion (Suite completa)**: (Completado) Soporte para V1, V2, V3 con auto-expansión.
- [x] **Buttons (Universal)**: (Completado) Edición de bordes, iconos y modo aislado.
- [x] **Cards / Pricing Tables**: (Completado) Control de elevación y posicionamiento dinámico.
- [x] **Smart Images**: (Completado) Filtros, object-fit y foco dinámico.

### 🖼 Fase 2: Componentes Multimedia & Formas (Semana 2)

- [x] **Multimedia Pro**: Refactorización de `EditorImageSectionComponent` con soporte para posicionamiento libre y expansión automática.
- [x] **UIShapeComponent**: Creación de componente base para formas abstractas SVG integrada en el editor + Isolated Mode.
- [x] **Video Backgrounds**: Control de opacidad y overlays de color + Isolated Mode (En progreso).
- [x] **Google Maps Interactivo**: API real integrada con selección de puntos + Isolated Mode (En progreso).
- [x] **Icon / Badge**: Selector de biblioteca de íconos integrado en Isolated Mode.

### 🧩 Fase 3: Átomos Avanzados & Tipografía (Semana 3)

- [ ] **Titles & Text**: Isolated Mode para tipografía avanzada, gradientes de texto y sombras.
- [ ] **Showcase / Feature Items**: Edición granular de íconos, títulos y descripciones en malla.
- [ ] **Lists & Steps**: Reordenación drag-and-drop de elementos de lista.
- [ ] **Charts & Statistics**: Editor visual de datos y tipos de gráficos (Bar, Line, Pie).
- [ ] **Breadcrumbs & Navigation**: Gestión de rutas y estilos de navegación secundaria.

### 🏗 Fase 4: Layouts & Secciones Complejas (Semana 4)

- [ ] **Hero Sections Pro**: Gestión de backgrounds paralaje, mezcla de capas y video-hero.
- [ ] **Contact / Reservation Forms**: Constructor de formularios visual con validaciones dinámicas.
- [ ] **Tabs & Interaction Elements**: Edición de estados (Active, Hover) y transiciones.
- [ ] **Portfolio / Gallery Grid**: Gestión de albúms y efectos de lightroom.

### 🚀 Fase 5: Ecosistema & Inteligencia (Futuro)

- [ ] **Smart Container integration**: Layouts anidados con auto-ajuste de flujo (Flex/Grid).
- [ ] **Global Theme Sync**: Propagación de estilos desde modo aislado a toda la página.
- [ ] **AI Style Generator**: Sugerencia de variantes basadas en el contenido del componente.

---

## 🛠 Estándares de Implementación "Golden Standard"

### 1. Robustez Estructural (Prevención de Overflows)

Todo componente de sección debe implementar el sistema de **Autogestión de Altura** vía `autoExpandSectionHeight` heredado de `EnhancedBaseEditorSectionComponent`.

### 2. Protocolo "Isolated Mode" Unificado (MUST HAVE)

Cada `Editor{Component}Section` debe incluir su correspondiente `Editor{Component}IsolatedModeComponent` con:

- Atajo de teclado `I` para aislamiento.
- Botón flotante 🎯 rápido en el overlay del editor.
- Interfaz de usuario Blur/Dark premium.
- Control total de: **Content, Appearance, Styles, Dimensions**.

### 3. Registro Dinámico (Arquitectura de Futuro)

Migrar hacia un `ComponentRegistry` para evitar el crecimiento infinito de plantillas.

---

## 📋 Lista de Verificación para Nuevos Componentes (Definition of Done)

- [x] Soporta el input `customStyles` y lo aplica al elemento raíz del UI.
- [x] Implementa `VisualEditingConfig` con constraints de `containment: 'parent'`.
- [x] El Isolated Mode permite edición de contenido y estilo en tiempo real.
- [x] La sección se expande automáticamente al mover/redimensionar el elemento.
- [x] Todas las variantes visuales están mapeadas en el selector de Isolated Mode.

---

## 📅 Próximos Pasos Inmediatos

1.  **Isolated Mode para Video**: Crear el componente de edición aislada para `EditorVideoSectionComponent`.
2.  **Isolated Mode para Map**: Crear el componente de edición aislada para `EditorMapSectionComponent`.
3.  **Title Mastery**: Implementar el editor avanzado de textos y títulos con soporte para gradientes.

---

**Última actualización**: 2026-02-07
**Estado del Proyecto**: 40% completado
