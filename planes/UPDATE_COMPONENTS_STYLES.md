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






















📋 Complete Plan for Implementing Custom Styles Across ALL Editor Components
Components Status:
✅ Completed: accordion, hero, newsletter
🔄 Remaining: 27 components
Phase 1: Component Analysis & Preparation (1-2 days)
Goal: Set up infrastructure for all components

Create Shared Interfaces:

libs/ui-components/src/lib/models/custom-styles.interface.ts
Standard interface for all components
Update Variant Selector:

Add all component types to isTopLevelFieldMapper
Update critical fix section for all components
Ensure updateElementStyles works for all types
Phase 2: High-Impact Content Components (4-5 days)
Goal: Implement for components that users interact with most

2.1 Stats Component
2.2 Services Component
2.3 Products Component
2.4 Testimonials Component
2.5 FAQ Component
2.6 Gallery Component
Phase 3: Business Components (4-5 days)
Goal: Implement for business-critical components

3.1 Pricing Component
3.2 Promotions Component
3.3 Features Component
3.4 Contact Component
3.5 Showcase Component
Phase 4: Navigation & Layout Components (3-4 days)
Goal: Implement for navigation and layout elements

4.1 Header Component
4.2 Footer Component
4.3 Breadcrumbs Component
4.4 Tabs Component
4.5 Steps Component
Phase 5: Interactive UI Components (4-5 days)
Goal: Implement for interactive elements

5.1 Button Component
5.2 Input Component
5.3 CTA Component
5.4 Card Component
5.5 Chart Component
Phase 6: Utility Components (3-4 days)
Goal: Implement for smaller utility elements

6.1 Chip Component
6.2 Spinner Component
6.3 Title Component
6.4 Image Component
6.5 Table Component
6.6 List Component
6.7 Bubble Component
Implementation Pattern for Each Component
For each component, apply this exact pattern:

Component TypeScript (libs/ui-components/src/lib/{component}/{component}.component.ts):

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CustomStyles } from '../../models/custom-styles.interface';

@Component({
  encapsulation: ViewEncapsulation.None
})
export class ComponentName {
  @Input() customStyles: CustomStyles = {};
  
  get componentStyles() {
    const styles: Record<string, any> = {};
    // Process customStyles into CSS properties
    return styles;
  }
}
Component SCSS (libs/ui-components/src/lib/{component}/{component}.component.scss):

.component-class {
  background: var(--theme-bg, default);
  color: var(--theme-color, default);
}
Editor Component (libs/features/editor/feature-editor/src/lib/pages/editor/components/{component}/editor-{component}-section.component.html):

<lib-component-name
  [customStyles]="section.styles"
  [applyDynamicStyles]="section.styles">
</lib-component-name>
Variant Selector Updates:

Add to isTopLevelFieldMapper if needed
Add to critical fix section if needed
Phase 7: Testing & Validation (2-3 days)
Goal: Comprehensive testing of all implementations

Unit Tests: Test style processing for each component
Integration Tests: Test in editor with variant selector
Regression Tests: Ensure no existing functionality breaks
Performance Tests: Monitor for style processing impact
Success Metrics
✅ All 30 components support custom styles
✅ Consistent styling behavior across components
✅ No compilation errors
✅ No performance degradation
✅ All components respond to variant selector changes