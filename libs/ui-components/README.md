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

## 🔗 Enlaces Útiles

- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.io/docs)