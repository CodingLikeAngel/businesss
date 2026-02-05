# 🛡️ Estándares de Robustez para Componentes Editables

Este documento define los estándares técnicos para crear componentes que sean robustos, predecibles y resistentes a datos corruptos o malformados.

---

## 🎯 Filosofía Core

> **"Un componente robusto nunca se rompe por datos externos."**

Esto significa que cualquier entrada (desde el store, API, o usuario) debe ser validada y saneada antes de aplicarse al estado visual.

---

## 📐 Arquitectura de Bounding (Límites)

### Problema Resuelto

El contorno de selección (tiradores, bordes) se desconectaba del contenido visible porque el "wrapper" tenía dimensiones independientes del componente interno.

### Solución Implementada

#### 1. Separación de Responsabilidades

```
┌─────────────────────────────────────────────┐
│  draggable-wrapper                          │
│  ├── position: absolute                     │
│  ├── left, top, width, height (dinámicos)   │
│  ├── outline (selección visual)             │
│  └── SIN estilos visuales de contenido      │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  lib-ui-component-X                 │    │
│  │  ├── width: 100%, height: 100%      │    │
│  │  ├── TODOS los estilos visuales     │    │
│  │  └── [customStyles] binding         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

#### 2. CSS del Wrapper (Solo Posicionamiento)

```scss
.draggable-wrapper {
  position: absolute !important;
  cursor: move;
  z-index: 100;

  // OUTLINE para selección (no afecta dimensiones)
  outline: 2px solid transparent;
  outline-offset: 0;
  transition: outline-color 0.15s ease;
}

.draggable-wrapper:hover {
  outline-color: rgba(99, 102, 241, 0.5);
}

.draggable-wrapper.is-dragging,
.draggable-wrapper.is-resizing {
  outline-color: var(--primary-accent);
  outline-width: 3px;
}

// Forzar que hijos llenen el contenedor
.draggable-wrapper > lib-ui-* {
  display: block;
  width: 100%;
  height: 100%;
}
```

---

## 📏 Validación de Dimensiones

### Regla de Oro

> **Nunca confiar en valores del store sin validación.**

### Límites Recomendados

| Propiedad | Mínimo | Máximo | Default |
| --------- | ------ | ------ | ------- |
| `width`   | 100px  | 800px  | 280px   |
| `height`  | 60px   | 600px  | 120px   |
| `left`    | 0px    | ∞      | 50px    |
| `top`     | 0px    | ∞      | 50px    |

### Implementación en TypeScript

```typescript
// En ngOnInit o loadPositionFromStore
private validateDimensions(incoming: { width?: number; height?: number }): { width: number; height: number } {
  const MIN_WIDTH = 100;
  const MAX_WIDTH = 800;
  const MIN_HEIGHT = 60;
  const MAX_HEIGHT = 600;

  const defaultSize = this.getDefaultSizeForVariant();

  let width = incoming.width || 0;
  let height = incoming.height || 0;

  if (width < MIN_WIDTH || width > MAX_WIDTH) {
    width = defaultSize.width;
  }
  if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
    height = defaultSize.height;
  }

  return { width, height };
}

private getDefaultSizeForVariant(): { width: number; height: number } {
  const defaults: Record<string, { width: number; height: number }> = {
    'draggable-box-1': { width: 280, height: 120 },
    'draggable-box-2': { width: 260, height: 100 },
    'draggable-box-3': { width: 320, height: 180 },
    // Añadir más variantes aquí
  };

  return defaults[this.componentVariant] || { width: 280, height: 120 };
}
```

---

## 🎨 Estilos Visuales: Wrapper vs Componente

### ❌ Incorrecto (Estilos en Wrapper)

```html
<div class="draggable-wrapper" [style.backgroundColor]="styles.backgroundColor" [style.border]="styles.border" [style.borderRadius]="styles.borderRadius">
  <lib-ui-component></lib-ui-component>
</div>
```

### ✅ Correcto (Estilos en Componente)

```html
<div class="draggable-wrapper" [style.left.px]="position.x" [style.top.px]="position.y" [style.width.px]="size.width" [style.height.px]="size.height" [class.is-dragging]="isDragging">
  <lib-ui-component [customStyles]="getCustomStyles()"> </lib-ui-component>
</div>
```

---

## 🔄 Flujo de Datos Robusto

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   NgRx Store    │───▶│   Validación     │───▶│   Estado Local  │
│  (puede tener   │    │  (clamp, filter) │    │  (siempre sano) │
│  datos malos)   │    └──────────────────┘    └─────────────────┘
└─────────────────┘
                                ▼
                       ┌──────────────────┐
                       │   Componente     │
                       │  (renderiza de   │
                       │   estado local)  │
                       └──────────────────┘
```

---

## ✅ Checklist de Robustez

### Antes de Renderizar

- [ ] ¿Se validan dimensiones mínimas/máximas?
- [ ] ¿Hay valores por defecto sensatos por tipo de componente?
- [ ] ¿Se clampean posiciones negativas?

### Estructura CSS

- [ ] ¿El wrapper usa `outline` en lugar de `border` para selección?
- [ ] ¿Los hijos tienen `width: 100%` y `height: 100%`?
- [ ] ¿Los estilos visuales están en el componente interno?

### Interacción

- [ ] ¿Las clases `.is-dragging` y `.is-resizing` se aplican correctamente?
- [ ] ¿Los tiradores de redimensión están dentro del wrapper?
- [ ] ¿El `mousedown` distingue entre tiradores y contenido?

---

## 🐛 Problemas Comunes y Soluciones

### Contorno desalineado con contenido

**Causa**: Estilos en el wrapper (border, padding) desplazan el contenido.
**Solución**: Mover estilos visuales al componente interno; usar outline en wrapper.

### Dimensiones gigantes al cargar

**Causa**: Datos corruptos en el store (width: 5000px).
**Solución**: Validar con `Math.min(MAX, Math.max(MIN, value))`.

### Componente no llena el wrapper

**Causa**: El componente UI no tiene `width: 100%; height: 100%`.
**Solución**: Añadir regla CSS forzada en el wrapper o en el propio componente.

---

**Última actualización**: 2026-02-05
