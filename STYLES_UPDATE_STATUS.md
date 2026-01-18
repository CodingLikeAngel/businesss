# Resumen de Actualización de Estilos Personalizados

## ✅ Estado Actual

### Componentes COMPLETADOS (Funcionan 100%):

1. ✅ **Footer** - Totalmente funcional con colores personalizados
2. ✅ **Header** - Totalmente funcional con colores personalizados
3. ✅ **Accordion** - Actualizado con el nuevo patrón
4. ✅ **List** - Actualizado con el nuevo patrón

### Patrón Implementado:

```typescript
// 1. Interface actualizada
export interface ComponentCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--component-bg'?: string;
  '--component-text'?: string;
  [key: string]: string | undefined;
}

// 2. Computed property
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

  Object.keys(customStyles).forEach(key => {
    if (key !== 'backgroundColor' && key !== 'color') {
      styles[key] = customStyles[key];
    }
  });

  return styles;
});

// 3. Template
<div [ngStyle]="componentStyles()" ...>

// 4. SCSS (si tiene variantes)
.component {
  background: var(--theme-bg, var(--component-bg, #default));
  color: var(--theme-color, var(--component-text, #default));

  @include shared.apply-all-variants('variant-');

  &[style*="background"] {
    background: var(--theme-bg) !important;
  }

  &[style*="background-color"] {
    background-color: var(--theme-bg) !important;
  }
}
```

### Propagación de Estilos (variant-selector.component.ts):

```typescript
// Para elementos globales (footer, header):
const configWithStyles = {
  ...source,
  customStyles: { ...(source.customStyles || {}), ...(source.styles || {}) },
};

if (this.selectedElement.type === 'footer') {
  this.variantService.setFooterConfig(configWithStyles);
}
```

## 📋 Componentes Pendientes

Los siguientes componentes tienen `customStyles` pero necesitan el patrón completo:

### Alta Prioridad (Usados frecuentemente en editor):

- [ ] Newsletter (`newsletter-section.component.ts`)
- [ ] Steps (`steps-section.component.ts`)
- [ ] Table (`table.component.ts`) - Ya tiene `tableStyles` pero necesita actualización
- [ ] Breadcrumbs (`breadcrumbs.component.ts`)
- [ ] Chip (`chip.component.ts`) - Ya tiene `chipStyles` pero necesita actualización
- [ ] Spinner (`spinner.component.ts`)
- [ ] Chart (`chart.component.ts`) - Ya tiene `chartStyles` pero necesita actualización
- [ ] Tabs (`tabs.component.ts`)

### Media Prioridad:

- [ ] Card (`cards/card/card.component.ts`)
- [ ] Card Animated (`cards/card-animated/card-animated.component.ts`)
- [ ] Card Premium (`cards/card-premium/card-premium.component.ts`)
- [ ] Button (`button/button.component.ts`)
- [ ] Hero (`hero/hero.component.ts`)
- [ ] NavBar (`nav-bars/nav/nav-bar.component.ts`)
- [ ] Gallery (`gallery/gallery.component.ts`)

### Baja Prioridad:

- [ ] Tooltip (`tooltip/tooltip.component.ts`)
- [ ] Title (`title/title.component.ts`)
- [ ] Image (`image/image.component.ts`)
- [ ] Input (`forms/input/input.component.ts`)
- [ ] DateTimePicker (`date-time-picker/date-time-picker.component.ts`)

## 🎯 Próximos Pasos

1. **Aplicar el patrón a los 8 componentes de alta prioridad**
2. **Probar cada componente en el editor** para verificar que los colores se aplican correctamente
3. **Actualizar componentes de media prioridad** según necesidad
4. **Documentar cualquier componente que requiera tratamiento especial**

## 🔧 Comandos Útiles

```bash
# Buscar todos los componentes con customStyles
grep -r "customStyles = input" libs/ui-components/src/lib --include="*.ts"

# Buscar componentes que ya tienen computed styles
grep -r "Styles = computed" libs/ui-components/src/lib --include="*.ts"
```

## ✨ Resultado Esperado

Después de completar todas las actualizaciones:

- ✅ Todos los componentes responderán a cambios de color en el editor
- ✅ Los colores personalizados sobrescribirán las variantes predeterminadas
- ✅ La experiencia de edición será consistente en todos los componentes
- ✅ Los estilos se propagarán correctamente desde el editor a los componentes











































Aquí tienes prompts específicos para mejorar el HTML y CSS de cada componente individual en `libs/ui-components/src/lib`. Cada prompt está diseñado para mejorar la estructura, accesibilidad, responsive design y experiencia visual:

## 🎯 **Prompts para Mejorar Componentes Individuales**

### **1. Hero Section** 
```
Mejora el componente hero-section mejorando su HTML y CSS:
- Reestructura el HTML para mejor semántica con header, main y aside
- Agrega micro-interacciones avanzadas (parallax scrolling, particle systems)
- Implementa mejor responsive design con breakpoints personalizados
- Añade efectos de entrada animados escalonados
- Mejora la accesibilidad con ARIA labels y navegación por teclado
- Optimiza el rendimiento con lazy loading de videos/imágenes
- Añade efectos de glassmorphism y backdrop-filter avanzados
```

### **2. Cards Component**
```
Mejora el componente card mejorando su HTML y CSS:
- Reestructura con mejor semántica usando article y figure
- Implementa hover effects 3D avanzados con transform-style: preserve-3d
- Añade efectos de iluminación dinámica y sombras realistas
- Crea variantes de tamaño más flexibles (square, wide, tall)
- Implementa mejor sistema de badges y status indicators
- Añade micro-animaciones para botones de acción
- Mejora el responsive con grid layouts adaptativos
```

### **3. Button Component**
```
Mejora el componente button mejorando su HTML y CSS:
- Reestructura con mejor semántica usando button y span para iconos
- Implementa ripple effects y efectos de presión táctil
- Añade estados de carga con spinners integrados
- Crea sistema de iconos más robusto con soporte SVG inline
- Implementa mejor focus states con outline personalizados
- Añade efectos de sonido (opcional) y haptic feedback
- Mejora la accesibilidad con aria-expanded y aria-pressed
```

### **4. Forms/Input Component**
```
Mejora el componente input mejorando su HTML y CSS:
- Reestructura con fieldsets y legends para mejor agrupación
- Implementa floating labels con animaciones suaves
- Añade validación visual en tiempo real con estados de error/success
- Crea mejor sistema de iconos para diferentes tipos de input
- Implementa autocomplete y datalist styling
- Añade efectos de enfoque con glow y transformaciones
- Mejora la accesibilidad con aria-describedby y role="alert"
```

### **5. Gallery Component**
```
Mejora el componente gallery mejorando su HTML y CSS:
- Reestructura con figure, figcaption y picture para mejor semántica
- Implementa lazy loading con Intersection Observer
- Añade efectos de lightbox modal con navegación por teclado
- Crea mejor sistema de filtros y categorías
- Implementa masonry layout con CSS Grid avanzado
- Añade efectos de zoom y pan en hover
- Mejora la accesibilidad con alt texts descriptivos
```

### **6. Pricing Table Section**
```
Mejora el componente pricing-table-section mejorando su HTML y CSS:
- Reestructura con table semántico y thead/tbody
- Implementa efectos de comparación side-by-side
- Añade tooltips informativos para features
- Crea mejor sistema de highlights para plan recomendado
- Implementa animaciones de entrada escalonadas
- Añade efectos de hover para filas y celdas
- Mejora el responsive con card layout en móvil
```

### **7. Products Section**
```
Mejora el componente products-section mejorando su HTML y CSS:
- Reestructura con grid system avanzado y CSS custom properties
- Implementa filtros y sorting con animaciones
- Añade efectos de carga skeleton para mejor UX
- Crea mejor sistema de badges de descuento y oferta
- Implementa infinite scroll o pagination styling
- Añade efectos de comparación de productos
- Mejora el responsive con masonry en desktop
```

### **8. Promotions Section**
```
Mejora el componente promotions-section mejorando su HTML y CSS:
- Reestructura con aside y call-to-action sections
- Implementa countdown timers con animaciones
- Añade efectos de confetti y celebraciones
- Crea mejor sistema de progress bars para ofertas
- Implementa efectos de slide-in desde diferentes direcciones
- Añade tooltips con información detallada
- Mejora la accesibilidad con aria-live regions
```

### **9. FAQ Section**
```
Mejora el componente faq-section mejorando su HTML y CSS:
- Reestructura con details/summary para mejor accesibilidad
- Implementa animaciones de acordeón suaves
- Añade sistema de búsqueda integrado
- Crea mejor iconografía para expand/collapse
- Implementa efectos de highlight para respuestas
- Añade categorías y filtros
- Mejora el responsive con mejor espaciado
```

### **10. Testimonials Section**
```
Mejora el componente testimonials-section mejorando su HTML y CSS:
- Reestructura con blockquote y cite para mejor semántica
- Implementa carousel infinito con touch/swipe
- Añade efectos de typewriter para texto
- Crea mejor sistema de avatars y ratings
- Implementa efectos de parallax en background
- Añade navegación por dots con preview
- Mejora la accesibilidad con aria-roledescription
```

### **11. Features Section**
```
Mejora el componente features-section mejorando su HTML y CSS:
- Reestructura con dl/dt/dd para listas descriptivas
- Implementa efectos de reveal on scroll avanzados
- Añade iconos animados SVG con morphing
- Crea mejor sistema de categorías y tabs
- Implementa efectos de counter animation
- Añade tooltips con información extendida
- Mejora el responsive con mejor grid system
```

### **12. Contact Section**
```
Mejora el componente contact-section mejorando su HTML y CSS:
- Reestructura con form semántico y fieldsets
- Implementa validación en tiempo real con feedback visual
- Añade mapa integrado con custom markers
- Crea mejor sistema de información de contacto
- Implementa efectos de envío exitoso con animaciones
- Añade soporte para múltiples métodos de contacto
- Mejora la accesibilidad con form validation
```

### **13. Stats Section**
```
Mejora el componente stats-section mejorando su HTML y CSS:
- Reestructura con data attributes para animaciones
- Implementa counter animations con easing personalizado
- Añade efectos de progress circles y bars
- Crea mejor sistema de tooltips con datos históricos
- Implementa efectos de entrada escalonados
- Añade comparativas y tendencias visuales
- Mejora el responsive con mejor typography scaling
```

### **14. Steps Section**
```
Mejora el componente steps-section mejorando su HTML y CSS:
- Reestructura con ol/li para mejor semántica
- Implementa progress indicator con animaciones
- Añade efectos de connector lines entre steps
- Crea mejor sistema de estados (completed, current, pending)
- Implementa efectos de step reveal progresivos
- Añade tooltips con información detallada
- Mejora la accesibilidad con aria-current
```

### **15. Accordion Component**
```
Mejora el componente accordion mejorando su HTML y CSS:
- Reestructura con details/summary para nativo accordion
- Implementa animaciones de height auto con CSS
- Añade efectos de icon rotation smooth
- Crea mejor sistema de multiple expand/collapse
- Implementa efectos de focus y active states
- Añade soporte para nested accordions
- Mejora la accesibilidad con aria-expanded
```

### **16. Modal Component**
```
Mejora el componente modal mejorando su HTML y CSS:
- Reestructura con dialog element para mejor semántica
- Implementa backdrop blur avanzado y efectos de entrada
- Añade soporte para múltiples modales
- Crea mejor sistema de focus trapping
- Implementa animaciones de entrada/salida personalizadas
- Añade efectos de drag para resize (opcional)
- Mejora la accesibilidad con aria-modal y focus management
```

### **17. Tabs Component**
```
Mejora el componente tabs mejorando su HTML y CSS:
- Reestructura con tablist y tabpanel roles
- Implementa animaciones de transición suaves entre tabs
- Añade efectos de underline animado
- Crea mejor sistema de tab variants (pills, buttons, minimal)
- Implementa lazy loading de tab content
- Añade soporte para tabs verticales
- Mejora la accesibilidad con aria-selected
```

### **18. Spinner Component**
```
Mejora el componente spinner mejorando su HTML y CSS:
- Reestructura con role="status" y aria-live
- Implementa múltiples variantes (dots, bars, rings, custom)
- Añade efectos de progress con porcentajes
- Crea mejor sistema de sizes y colors
- Implementa efectos de entrada/salida
- Añade soporte para spinners contextuales
- Mejora la accesibilidad con aria-label descriptivo
```

### **19. Chip Component**
```
Mejora el componente chip mejorando su HTML y CSS:
- Reestructura con button o span según interactividad
- Implementa efectos de close animation
- Añade soporte para avatars y iconos
- Crea mejor sistema de variants (filled, outlined, ghost)
- Implementa efectos de selección múltiple
- Añade efectos de ripple en click
- Mejora la accesibilidad con aria-pressed
```

### **20. Breadcrumbs Component**
```
Mejora el componente breadcrumbs mejorando su HTML y CSS:
- Reestructura con nav y ol para mejor semántica
- Implementa efectos de hover en items
- Añade soporte para iconos separadores custom
- Crea mejor sistema de responsive (collapse intermedio)
- Implementa efectos de active trail
- Añade soporte para breadcrumbs multinivel
- Mejora la accesibilidad con aria-current
```

## 🚀 **Prompt General para Todos los Componentes**

```
Para mejorar cualquier componente UI, considera estos aspectos:

1. SEMÁNTICA HTML:
   - Usa elementos semánticos apropiados (article, section, nav, etc.)
   - Implementa roles ARIA cuando sea necesario
   - Estructura lógica del contenido

2. ACCESIBILIDAD:
   - Contrast ratios WCAG AA (4.5:1 normal, 3:1 large)
   - Navegación por teclado completa
   - Screen reader support con aria-labels
   - Focus management en interactivos

3. RESPONSIVE DESIGN:
   - Mobile-first approach
   - Breakpoints personalizados
   - Touch-friendly targets (44px minimum)
   - Flexible layouts con CSS Grid/Flexbox

4. ANIMACIONES Y MICRO-INTERACCIONES:
   - Easing functions personalizadas
   - Performance optimizada (transform, opacity)
   - Estados hover/active/focus consistentes
   - Animaciones de entrada escalonadas

5. VISUAL DESIGN:
   - Consistent spacing system
   - Typography hierarchy clara
   - Color palette coherente
   - Shadows y depth apropiadas

6. FUNCIONALIDAD:
   - Estados de loading y error
   - Validación y feedback visual
   - Performance optimizada
   - Error boundaries
```

Estos prompts te ayudarán a mejorar cada componente individualmente, enfocándote en aspectos específicos de HTML semántico, CSS avanzado, accesibilidad y experiencia de usuario.