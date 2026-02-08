# Plan de Estandarización de Componentes - Anto Studios Editor

## 1. Objetivo

Elevar todos los componentes de la librería `libs/ui-components` al nivel de excelencia técnica y capacidades de edición del **Accordion** y la **Draggable Box**. Se busca una experiencia WYSIWYG total, persistente y visualmente premium.

## 2. El "Estándar Anto Studios"

Para que un componente se considere estandarizado, debe cumplir con los siguientes cuatro pilares:

### A. Comunicación Unificada (`IsolatedModeConfig`)

Todos los componentes deben intercambiar datos a través de la interfaz `IsolatedModeConfig`, que incluye:

- **Position**: Coordenadas `x, y` precisas en el lienzo.
- **Size**: Dimensiones `width, height` dinámicas.
- **Content**: Datos puros (textos, items, imágenes).
- **Styles**: Apariencia (colores, bordes, efectos).

### B. Modo Aislado Premium

Cada componente debe tener un editor dedicado que herede del sistema de "Glassmorphism":

- **Lienzo Infinito**: Canvas de 4000x4000px con rejilla inteligente.
- **Drag & Resize**: Manipulación directa en el canvas con snapping.
- **Undo/Redo**: Historial de cambios local en la sesión de edición.
- **Sidebar de Control**: Paneles colapsables para variantes, estilo y contenido.

### C. Soporte de Variantes y Estilos Custom

Implementación obligatoria de inputs reactivos (Signals):

- `variant`: `primary | secondary | glass | neon | cyberpunk`.
- `customStyles`: Objeto para inyectar CSS específico (background, color, etc.).
- `rounded`: `none | md | full`.
- `dark`: Boolean para modo noche.

### D. Persistencia en Layout Section

Los componentes deben soportar el sistema de **LayoutStyles**:

- Separación de estilos físicos (posicionamiento) de estilos visuales.
- No desborde: Respeto absoluto a los límites del contenedor grid cuando no están en modo "absolute".

---

## 3. Hoja de Ruta de Migración

### Fase 1: Componentes Esenciales (Priority: High)

_Objetivo: Estabilizar el contenido básico de cualquier página._

- [ ] **Title**: Unificar todas las variantes de títulos con control de tipografía y tamaño.
- [ ] **Image**: Editor con filtros (blur, brightness) y controles de object-fit.
- [ ] **Chip/Badge**: Sistema de colores dinámicos y variantes de borde.
- [ ] **Button**: Estandarizar el botón universal con estados hover y sombras.

### Fase 2: Contenedores y Layout (Priority: Medium)

_Objetivo: Controlar la estructura espacial._

- [ ] **UICard**: Soporte para slots internos y variantes de cristal.
- [ ] **List**: Editor de items con reordenamiento por drag-and-drop.
- [ ] **Spacer**: Control visual de espaciado mediante resize vertical/horizontal.
- [ ] **Smart Container**: Implementar anidamiento coordinado.

### Fase 3: Interactividad y Datos (Priority: Low)

_Objetivo: Añadir funcionalidad avanzada._

- [ ] **Forms/Inputs**: Estandarizar estilos de campos y botones de envío.
- [ ] **Tabs/FAQ**: Lógica de expansión similar al Accordion.
- [ ] **Chart/Table**: Editores de datos crudos integrados en la sidebar.

---

## 4. Guía Técnica para Nuevos Editores

1. **Ubicación del Editor**: Crear en `libs/features/editor/feature-editor/src/lib/pages/editor/components/[nombre-comp]`.
2. **Componente UI**: Mantenerlo agnóstico al editor en `libs/ui-components`.
3. **Mapeo en Section**: Actualizar `isolatedModeComponents` en `EditorLayoutSectionComponent` para registrar el nuevo tipo.
4. **Reseteo de Estilos**: Asegurar que `delete newStyles['width']` se ejecute al cambiar layouts globales para evitar rotura de estructura.

---

**Responsable**: Antigravity AI
**Estado**: En Progreso
**Versión**: 1.0.0
