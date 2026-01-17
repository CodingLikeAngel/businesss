# Actualización de Estilos Personalizados - Componentes UI

## Patrón a Aplicar

Para cada componente que tenga `customStyles = input<T>({})`, necesitamos:

### 1. Actualizar la Interfaz de CustomStyles

```typescript
export interface ComponentCustomStyles {
  backgroundColor?: string;
  color?: string;
  // ... otras propiedades específicas del componente
  [key: string]: string | undefined;
}
```

### 2. Crear/Actualizar el Computed Property de Estilos

```typescript
componentStyles = computed(() => {
  const styles: Record<string, any> = {};
  const customStyles = this.customStyles();

  if (customStyles['backgroundColor']) {
    styles['--theme-bg'] = customStyles['backgroundColor'];
    styles['--component-bg'] = customStyles['backgroundColor'];
    styles['background'] = customStyles['backgroundColor'];
    styles['background-color'] = customStyles['backgroundColor'];
  }

  if (customStyles['color']) {
    styles['--theme-color'] = customStyles['color'];
    styles['--component-text'] = customStyles['color'];
    styles['color'] = customStyles['color'];
  }

  // Copy any other custom styles
  Object.keys(customStyles).forEach((key) => {
    if (key !== 'backgroundColor' && key !== 'color') {
      styles[key] = customStyles[key];
    }
  });

  return styles;
});
```

### 3. Actualizar el Template

```html
<div [ngStyle]="componentStyles()" ...></div>
```

### 4. Actualizar el SCSS (si tiene variantes)

```scss
.component {
  background: var(--theme-bg, var(--component-bg, #default));
  color: var(--theme-color, var(--component-text, #default));

  @include shared.apply-all-variants('variant-');

  // CRITICAL: Force inline styles to override variant backgrounds
  &[style*='background'] {
    background: var(--theme-bg) !important;
  }

  &[style*='background-color'] {
    background-color: var(--theme-bg) !important;
  }
}
```

## Componentes a Actualizar

- [x] Footer
- [x] Header
- [ ] Accordion
- [ ] List
- [ ] Newsletter
- [ ] Steps
- [ ] Table
- [ ] Breadcrumbs
- [ ] Chip
- [ ] Spinner
- [ ] Chart
- [ ] Tabs
- [ ] Card
- [ ] Card Animated
- [ ] Card Premium
- [ ] Button
- [ ] Hero
