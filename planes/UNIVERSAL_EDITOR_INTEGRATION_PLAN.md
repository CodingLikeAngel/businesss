# 🎯 Plan de Integración Universal del Editor Visual

Este plan define la transición hacia un **Sistema de Edición Universal** donde CUALQUIER componente UI puede ser draggable, resizable y editable de forma premium.

---

## 🎯 Objetivo Principal

Permitir una experiencia "Plug & Play" donde los desarrolladores puedan crear nuevos componentes que automáticamente soporten:

1.  **Selección & Highlighting**
2.  **Drag & Drop Nativo**
3.  **Redimensionado 8-Puntos**
4.  **Edición de Contenido** (Textos, Imágenes, Iconos)
5.  **Overrides de Estilo** (Shadows, Borders, Glassmorphism)
6.  **Historial & Persistencia** (Undo/Redo vía NgRx)

---

## 🛠 Fase 1: Fundación Core & Estándares Técnicos

### 1.1 Paridad de Propiedades Mandatorias (Los "Big 5")

Todo componente UI DEBE implementar estos inputs:

| Input          | Tipo                       | Descripción                                     |
| -------------- | -------------------------- | ----------------------------------------------- |
| `variant`      | string                     | Variante de estilo (primary, glass, neon, etc.) |
| `rounded`      | `'none' \| 'md' \| 'full'` | Preset de border-radius                         |
| `size`         | `'sm' \| 'md' \| 'lg'`     | Escala del componente                           |
| `dark`         | boolean                    | Modo oscuro localizado                          |
| `customStyles` | object                     | Overrides CSS manuales                          |

### 1.2 Estandarización de Prefijos CSS

Todos los componentes usan el prefijo `variant-` en su SCSS:

```scss
.my-component {
  @include shared.apply-all-variants('variant-');
}
```

### 1.3 Reglas de Renderizado de Contenedor

Los componentes UI deben:

- Usar `width: 100%` y `height: 100%`
- Usar `position: absolute; inset: 0;` si están dentro del wrapper del editor

---

## 🏗 Fase 2: Modo Aislado Premium (Isolated Mode)

### 2.1 Protocolo de Aislamiento

Cuando un componente entra en Isolated Mode:

1.  **Promoción de Z-Index**: `body.isolated-mode-active` eleva el canvas a `z-index: 9999999`
2.  **Romper Trampas de Perspectiva**: Desactivar `perspective` e `isolation` de elementos padres
3.  **Feedback Visual**: Canvas con fondo tipo checkerboard y grid magnético

### 2.2 Features Premium del Canvas

| Feature                           | Estado          |
| --------------------------------- | --------------- |
| Ambient Dark/Light Mode           | ✅ Implementado |
| Magnetic Grid (Snap 40px)         | ✅ Implementado |
| Ghost Preview (posición original) | ✅ Implementado |
| Undo/Redo Stack local             | ✅ Implementado |
| Position Info Dock                | ✅ Implementado |

---

## 🏗 Fase 3: Registro de Componentes & Factory

### 3.1 Resolver Dinámico (Próximamente)

En lugar de un gigantesco `ngSwitch` en `editor-feature.component.html`, migrar a:

1.  **Registry**: Mapa central `component-type` → `EditorComponentClass`
2.  **Auto-Registration**: Decorador o servicio que auto-registre componentes

---

## 🏗 Fase 4: Persistencia & Gestión de Estado

### 4.1 Updates Debounced a NgRx

```typescript
this.persistSubject$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => this.persistToStore());
```

### 4.2 Gestión de Capas (Z-Index)

Controles para ordenar elementos:

- `bringToFront()`
- `sendToBack()`
- `moveForward()`
- `moveBackward()`

---

## 🏗 Fase 5: Experiencia "Golden Standard" (UX Premium)

### 5.1 Diferenciación Morfológica

Las variantes no solo cambian colores; cambian la **estructura visual** (orbes de iconos, reflejos de glass, blobs decorativos).

### 5.2 Lógica de Prioridad de Estilos

```
Presets (None, Medium, Full) > Manual Overrides > Variant Defaults
```

### 5.3 Puntos de Entrada de Alta Velocidad

| Método           | Implementación                    |
| ---------------- | --------------------------------- |
| Doble Clic       | `(dblclick)="openIsolatedMode()"` |
| Botón Flotante   | `.quick-isolated-btn` con 🎯      |
| Atajo de Teclado | Tecla `I` para aislar             |

---

## 🏗 Fase 6: Capa de Robustez (NUEVO)

### 6.1 Arquitectura de Bounding

**Regla**: El wrapper solo gestiona posición/dimensiones. Los estilos visuales van en el componente interno.

```scss
.draggable-wrapper {
  outline: 2px solid transparent; // NO border
  outline-offset: 0;
}

.draggable-wrapper > lib-ui-component {
  width: 100%;
  height: 100%;
}
```

### 6.2 Validación de Dimensiones

```typescript
// Límites sensatos
const MIN_WIDTH = 100,
  MAX_WIDTH = 800;
const MIN_HEIGHT = 60,
  MAX_HEIGHT = 600;

if (incomingWidth < MIN_WIDTH || incomingWidth > MAX_WIDTH) {
  incomingWidth = defaultSize.width;
}
```

### 6.3 Carga Defensiva

Nunca confiar en datos del store sin validación:

```typescript
this.currentPosition = {
  x: Math.max(50, Math.min(500, config.position?.x || 100)),
  y: Math.max(50, Math.min(500, config.position?.y || 100)),
};
```

---

## 📋 Roadmap de Implementación

| Tarea                               | Prioridad | Estado         |
| ----------------------------------- | --------- | -------------- |
| **Draggable Box (Golden Standard)** | Alta      | ✅ Completado  |
| **Isolated Mode Premium**           | Alta      | ✅ Completado  |
| **Quick Action Entry Points**       | Media     | ✅ Completado  |
| **Undo/Redo Base System**           | Media     | ✅ Completado  |
| **Robustness Layer**                | Alta      | ✅ Completado  |
| **Grid & Snap System**              | Media     | ✅ Completado  |
| **Component Registry (Factory)**    | Media     | 📅 Planificado |
| **Z-Index Management UI**           | Baja      | 📅 Planificado |
| **Universal Button Integration**    | Media     | 📅 Planificado |

---

## ✅ Criterios de Éxito

- [x] El contorno de edición siempre encaja con el contenido visible
- [x] Los componentes se ven premium durante la edición (animaciones, feedback)
- [x] El Isolated Mode es el estándar para ediciones estructurales
- [ ] El stacking order (z-index) es completamente gestionable
- [x] Los "Big 5" (Variant, Rounded, Size, Dark, Custom) se sincronizan correctamente
- [x] Undo/Redo funciona para todas las propiedades editables
- [ ] Cualquier desarrollador puede añadir un componente premium en < 30 minutos

---

## 📚 Documentación Relacionada

| Documento                           | Propósito                               |
| ----------------------------------- | --------------------------------------- |
| `COMPONENT_CREATION_GUIDE.md`       | Guía paso a paso para crear componentes |
| `COMPONENT_TEMPLATES.md`            | Plantillas rápidas de código            |
| `DRAGGABLE_BOX_IMPROVEMENT_PLAN.md` | Referencia del Golden Standard          |
| `ROBUSTNESS_STANDARDS.md`           | Estándares de validación y bounding     |

---

**Última actualización**: 2026-02-05
