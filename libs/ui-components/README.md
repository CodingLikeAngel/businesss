# 🎨 UI Components Library

Biblioteca de componentes UI reutilizables con sistema de variants completo.

## 📚 Documentación

### 🚀 Guías Principales

- **[Guía Completa de Creación de Componentes](./COMPONENT_CREATION_GUIDE.md)** - Guía paso a paso detallada
- **[Plantillas Rápidas](./COMPONENT_TEMPLATES.md)** - Templates listos para copiar y pegar

### 📖 Resumen Rápido

Para crear un nuevo componente y añadirlo al editor:

1. **Crear Componente UI** → Ver [Guía Paso 1-2](./COMPONENT_CREATION_GUIDE.md#paso-1-crear-el-componente-ui)
2. **Exportar** → Ver [Guía Paso 3](./COMPONENT_CREATION_GUIDE.md#paso-3-exportar-el-componente)
3. **Registrar en Explorer** → Ver [Guía Paso 4](./COMPONENT_CREATION_GUIDE.md#paso-4-registrar-en-component-explorer)
4. **Crear Editor Section** → Ver [Guía Paso 5](./COMPONENT_CREATION_GUIDE.md#paso-5-crear-sección-de-editor)
5. **Añadir al Editor** → Ver [Guía Paso 6](./COMPONENT_CREATION_GUIDE.md#paso-6-añadir-al-editor-feature)
6. **Configurar Variants** → Ver [Guía Paso 7](./COMPONENT_CREATION_GUIDE.md#paso-7-configurar-variants-mínimo-3-4)

### ⚡ Quick Start

1. Usa las [Plantillas Rápidas](./COMPONENT_TEMPLATES.md)
2. Reemplaza los placeholders
3. Sigue el [Checklist Final](./COMPONENT_CREATION_GUIDE.md#checklist-final)

## 🏗️ Estructura

```
libs/ui-components/src/lib/
├── [component-name]/
│   ├── [component-name].component.ts
│   ├── [component-name].component.html
│   └── [component-name].component.scss
├── styles/
│   ├── _variants.scss      # Todos los variants disponibles
│   ├── _applicators.scss   # Mixins para aplicar variants
│   └── _mixins.scss        # Mixins generales
└── models/
    └── ui-components-data.model.ts
```

## 🎨 Sistema de Variants

Todos los componentes soportan variants globales:

- **Básicos**: `primary`, `secondary`, `outline`, `ghost`
- **Modernos**: `neon`, `cyberpunk`, `glass`, `gradient`, `retro`, `minimal`
- **Temáticos**: `dark`, `light`, `success`, `danger`
- **Y muchos más...** (ver `_variants.scss`)

### ⚠️ Regla Importante

El mixin `apply-all-variants` **DEBE** aplicarse en el elemento que tiene la clase `variant-*`:

```scss
.component {
  @include shared.apply-all-variants('variant-'); // ✅ Correcto
}
```

## 📝 Notas de Desarrollo

### Running unit tests

Run `nx test ui-components` to execute the unit tests.

### Comandos Nx

```bash
# Generar nuevo componente
nx g @nx/angular:component [name] --project=ui-components --style=scss

# Test
nx test ui-components

# Build
nx build ui-components
```

## 🎯 Tokens del tema

Los componentes consumen variables CSS definidas en `lib/styles/_variables.scss` y en el tema global. Usar estos tokens en lugar de valores fijos:

| Token | Uso |
|-------|-----|
| `--theme-bg` | Fondo del componente |
| `--theme-color` | Texto / color principal |
| `--theme-accent` | Acentos y hover |
| `--theme-radius` | Border radius general |
| `--theme-border` | Borde |
| `--theme-shadow` | Sombra |
| `--theme-font` | Fuente |
| `--theme-padding` | Padding estándar |
| `--theme-items-gap` | Separación entre ítems |
| `--fs-xs` … `--fs-2xl` | Escala tipográfica |
| `--sp-1` … `--sp-16` | Escala de espaciado |
| `--shadow-sm` … `--shadow-xl` | Sombras |

Los estilos personalizados (`customStyles`) se fusionan con `mergeCustomStyles()` y mapean `backgroundColor`/`color` a estos tokens y a variables con prefijo del componente (ej. `--btn-bg`, `--card-color`).

## 📐 Convención de clases (BEM-like)

- **Block:** nombre del componente (`btn`, `card`, `accordion-container`).
- **Element:** bloque + `--` o `-` + nombre (`card--title`, `accordion-header`, `accordion-content-wrapper`).
- **Modifier:** bloque/elemento + modificador (`btn--primary`, `card--size-wide`, `accordion-rounded-md`). Variantes de diseño: `variant-<nombre>` o `<block>-<variant>`.
- **Estados:** `is-expanded`, `is-open`, `is-active`, `dark` cuando apliquen.
- Variantes generadas con el mixin `apply-all-variants('<prefix>-')` desde `lib/styles`.

## ♿ Accesibilidad (checklist)

- **Botones / enlaces:** `aria-label` o texto visible, `aria-disabled` cuando corresponda, `:focus-visible` visible (outline/box-shadow).
- **Modales:** `role="dialog"`, `aria-modal="true"`, trampa de foco, cierre con Escape.
- **Tooltips:** no depender solo de hover; activación por teclado/focus; `aria-describedby` si se asocia al elemento disparador.
- **Formularios:** `<label>` asociado o `aria-label`; mensajes de error con `aria-describedby` o `aria-errormessage`.
- **Acordeón:** `aria-expanded`, `aria-controls` en el botón; `role="region"` y `aria-labelledby` en el panel; `:focus-visible` en el header.
- **Contraste:** cumplir WCAG 2.1 AA donde aplique (texto y controles).

## 📋 Props y eventos (resumen por componente)

| Componente | Inputs principales | Outputs | Notas a11y |
|------------|--------------------|---------|------------|
| **Button** | `variant`, `size`, `rounded`, `disabled`, `ariaLabel`, `expanded`, `pressed`, `customStyles` | `buttonClick` | `aria-label`, `aria-disabled`, `aria-expanded`, `aria-pressed`; `:focus-visible` |
| **Chip** | `variant`, `selected`, `removable`, `disabled`, `iconName`, `avatarSrc`, `customStyles` | `chipClick`, `chipRemove` | `aria-label`, `aria-pressed`; `:focus-visible` en chip y en botón de quitar |
| **Input** | `type`, `placeholder`, `label`, `variant`, `disabled`, `customStyles` | `valueChange`, `blur`, `focus` | Label asociado o `aria-label`; `:focus-visible`; mensajes de error con `aria-describedby` |
| **Accordion** | `items` (title/content), `variant`, `customStyles` | — | `aria-expanded`, `aria-controls`, `aria-labelledby` en paneles; `:focus-visible` en header |
| **Modal** | `isOpen`, `title`, `content`, `size`, `rounded`, `customStyles` | `close` | `aria-modal`, `aria-labelledby`, botón cerrar `aria-label`; trampa de foco; `:focus-visible` en close |
| **Tooltip** | `content`, `position`, `variant` | — | Activar por teclado/focus; `aria-describedby` en disparador |
| **Tabs** | `tabs`, `activeIndex`, `variant` | `activeIndexChange` | `role="tablist"`, `aria-selected` en tab, `aria-controls` |
| **Card** | `title`, `description`, `variant`, `customStyles` | — | Contenido semántico (heading + texto) |

Los tokens de tema (`--theme-bg`, `--theme-color`, `--theme-radius`, `--sp-*`, `--fs-*`) se aplican en Button, Chip, Accordion, Input y Modal para que un solo cambio de tema afecte a todos.

## 🔗 Enlaces Útiles

- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.io/docs)